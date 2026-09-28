import { Inject, Injectable } from '@nestjs/common';
import { COMPRA_REPOSITORY_PORT, type CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { Compra } from '../../domain/entities/compra.entity';
import { failure, success, type CompraError, type Result } from '../result';
import { PRODUCTO_REPOSITORY_PORT, type ProductoRepositoryPort } from '../../../stock/domain/ports/producto.repository-port';
import { RegistrarEnvioUseCase } from '../../../envios/application/use-cases/registrar-envio.use-case';

@Injectable()
export class ActualizarEstadoCompraUseCase {
  constructor(
    @Inject(COMPRA_REPOSITORY_PORT) private readonly repository: CompraRepositoryPort,
    @Inject(PRODUCTO_REPOSITORY_PORT) private readonly productoRepository: ProductoRepositoryPort,
    private readonly registrarEnvioUseCase: RegistrarEnvioUseCase,
  ) {}

  async execute(codigo: string, estado: string): Promise<Result<Compra, CompraError>> {
    if (!codigo || codigo.trim().length === 0 || !estado || estado.trim().length === 0) {
      return failure({ code: 'VALIDATION_ERROR', message: 'El código y el estado son obligatorios.' });
    }

    try {
      const estadoNormalizado = estado.trim().toUpperCase();
      const actual = await this.repository.buscarCompraPorCodigo(codigo);
      if (!actual) {
        return failure({ code: 'COMPRA_NOT_FOUND', message: `No se encontró la compra ${codigo}.` });
      }

      const productos = actual.items.map(({ productoId, cantidad }) => ({ productoId, cantidad }));
      const estadoCambio = actual.estado !== estadoNormalizado;
      const debeReponer = estadoCambio && estadoNormalizado !== 'APPROVED' && !actual.inventarioRestituido;
      const debeDescontar = estadoNormalizado === 'APPROVED' && actual.inventarioRestituido;
      let movimiento: 'REPONER' | 'DESCONTAR' | undefined;

      if (debeReponer || debeDescontar) {
        const resultado = debeReponer
          ? await this.productoRepository.reponerStock(productos)
          : await this.productoRepository.descontarStock(productos);
        if (!resultado.ok) return failure(resultado.error);
        movimiento = debeReponer ? 'REPONER' : 'DESCONTAR';
      }

      const inventarioRestituido = debeReponer
        ? true
        : debeDescontar
          ? false
          : actual.inventarioRestituido;

      try {
        const compra = await this.repository.actualizarEstadoCompra(
          codigo,
          estadoNormalizado,
          inventarioRestituido,
        );
        if (compra) {
          if (estadoNormalizado === 'APPROVED') {
            const envio = await this.registrarEnvioUseCase.execute({
              compraId: compra.id,
              codigoCompra: compra.codigo,
              fechaCompra: compra.fecha,
              domicilio: compra.domicilioCliente,
            });
            if (!envio.ok) {
              return failure({
                code: 'PERSISTENCE_ERROR',
                message: `La compra fue aprobada, pero no se pudo registrar su envío: ${envio.error.message}`,
              });
            }
          }
          return success(compra);
        }
      } catch {
        const compensado = await this.compensarMovimiento(movimiento, productos);
        if (!compensado) {
          return failure({ code: 'PERSISTENCE_ERROR', message: 'Falló la actualización y también la compensación del stock.' });
        }
        return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible actualizar la compra.' });
      }

      const compensado = await this.compensarMovimiento(movimiento, productos);
      if (!compensado) {
        return failure({ code: 'PERSISTENCE_ERROR', message: 'Falló la actualización y también la compensación del stock.' });
      }
      return failure({ code: 'COMPRA_NOT_FOUND', message: `No se encontró la compra ${codigo}.` });
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible actualizar la compra.' });
    }
  }

  private async compensarMovimiento(
    movimiento: 'REPONER' | 'DESCONTAR' | undefined,
    productos: { productoId: string; cantidad: number }[],
  ): Promise<boolean> {
    if (movimiento === 'REPONER') return (await this.productoRepository.descontarStock(productos)).ok;
    if (movimiento === 'DESCONTAR') return (await this.productoRepository.reponerStock(productos)).ok;
    return true;
  }
}
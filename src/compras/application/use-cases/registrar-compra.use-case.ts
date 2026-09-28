import { Inject, Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { failure, success, type CompraError, type Result } from '../result';
import { Compra, TASA_IMPUESTO_COMPRA } from '../../domain/entities/compra.entity';
import { Item } from '../../domain/entities/item.entity';
import { COMPRA_REPOSITORY_PORT, type CompraRepositoryPort } from '../../domain/ports/compra.repository-port';

export interface RegistrarCompraItemCommand {
  productoId: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface RegistrarCompraCommand {
  clienteId: string;
  subtotal: number;
  items: RegistrarCompraItemCommand[];
}

@Injectable()
export class RegistrarCompraUseCase {
  constructor(
    @Inject(COMPRA_REPOSITORY_PORT)
    private readonly compraRepository: CompraRepositoryPort,
  ) {}

  async execute(command: RegistrarCompraCommand): Promise<Result<Compra, CompraError>> {
    let compra: Compra;

    try {
      if (!Array.isArray(command.items) || !command.items.length) {
        return failure({ code: 'VALIDATION_ERROR', message: 'La compra debe tener al menos un item.' });
      }
      const compraId = randomUUID();
      const items = command.items.map((item) => new Item(
        randomUUID(), compraId, item.productoId, item.cantidad, item.valorUnitario, item.valorTotal,
      ));
      const impuesto = Number((command.subtotal * TASA_IMPUESTO_COMPRA).toFixed(2));
      const total = Number((command.subtotal + impuesto).toFixed(2));
      const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
      compra = new Compra(
        compraId,
        command.clienteId,
        'PENDIENTE',
        this.generarCodigo(),
        fecha,
        command.subtotal,
        impuesto,
        total,
        items,
      );
    } catch (error) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Los datos de la compra no son válidos.',
      });
    }

    try {
      for (let intento = 0; intento < 10; intento += 1) {
        if (!(await this.compraRepository.buscarCompraPorCodigo(compra.codigo))) {
          const compraGuardada = await this.compraRepository.guardarCompra(compra);
          return success(compraGuardada);
        }
        compra = new Compra(
          compra.id,
          compra.clienteId,
          compra.estado,
          this.generarCodigo(),
          compra.fecha,
          compra.subtotal,
          compra.impuesto,
          compra.total,
          compra.items,
        );
      }
      return failure({
        code: 'DUPLICATE_CODE',
        message: 'No fue posible generar un código único para la compra.',
      });
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible registrar la compra.' });
    }
  }

  private generarCodigo(): string {
    return randomInt(1_000_000, 10_000_000).toString();
  }
}
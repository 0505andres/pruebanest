import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { failure, success, type CompraError, type Result } from '../result';
import { Compra } from '../../domain/entities/compra.entity';
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
  codigo: string;
  fecha: string;
  subtotal: number;
  impuesto: number;
  total: number;
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
      if (!command.items.length) {
        return failure({ code: 'VALIDATION_ERROR', message: 'La compra debe tener al menos un item.' });
      }
      const compraId = randomUUID();
      const items = command.items.map((item) => new Item(
        randomUUID(), compraId, item.productoId, item.cantidad, item.valorUnitario, item.valorTotal,
      ));
      compra = new Compra(
        compraId, command.clienteId, 'PENDIENTE', command.codigo, command.fecha,
        command.subtotal, command.impuesto, command.total, items,
      );
    } catch (error) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Los datos de la compra no son válidos.',
      });
    }

    try {
      if (await this.compraRepository.buscarCompraPorCodigo(command.codigo)) {
        return failure({ code: 'DUPLICATE_CODE', message: `Ya existe una compra con el código ${command.codigo}.` });
      }
      const compraGuardada = await this.compraRepository.guardarCompra(compra);
      return success(compraGuardada);
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible registrar la compra.' });
    }
  }
}
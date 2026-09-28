import { Inject, Injectable } from '@nestjs/common';
import { COMPRA_REPOSITORY_PORT, type CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { Compra } from '../../domain/entities/compra.entity';
import { failure, success, type CompraError, type Result } from '../result';

@Injectable()
export class ActualizarEstadoCompraUseCase {
  constructor(@Inject(COMPRA_REPOSITORY_PORT) private readonly repository: CompraRepositoryPort) {}

  async execute(codigo: string, estado: string): Promise<Result<Compra, CompraError>> {
    if (!codigo || codigo.trim().length === 0 || !estado || estado.trim().length === 0) {
      return failure({ code: 'VALIDATION_ERROR', message: 'El código y el estado son obligatorios.' });
    }

    try {
      const compra = await this.repository.actualizarEstadoCompra(codigo, estado);
      return compra
        ? success(compra)
        : failure({ code: 'COMPRA_NOT_FOUND', message: `No se encontró la compra ${codigo}.` });
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible actualizar la compra.' });
    }
  }
}
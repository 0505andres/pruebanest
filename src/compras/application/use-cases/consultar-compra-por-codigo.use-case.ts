import { Inject, Injectable } from '@nestjs/common';
import { Compra } from '../../domain/entities/compra.entity';
import { COMPRA_REPOSITORY_PORT, type CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { failure, success, type CompraError, type Result } from '../result';

@Injectable()
export class ConsultarCompraPorCodigoUseCase {
  constructor(@Inject(COMPRA_REPOSITORY_PORT) private readonly repository: CompraRepositoryPort) {}

  async execute(codigo: string): Promise<Result<Compra, CompraError>> {
    if (!codigo || codigo.trim().length === 0) {
      return failure({ code: 'VALIDATION_ERROR', message: 'El código de la compra es obligatorio.' });
    }

    try {
      const compra = await this.repository.buscarCompraPorCodigo(codigo);
      return compra
        ? success(compra)
        : failure({ code: 'COMPRA_NOT_FOUND', message: `No se encontró la compra ${codigo}.` });
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible consultar la compra.' });
    }
  }
}
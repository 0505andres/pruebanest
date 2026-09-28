import { Inject, Injectable } from '@nestjs/common';
import { failure, success, type ProductoError, type Result } from '../result';
import { PRODUCTO_REPOSITORY_PORT, type ProductoRepositoryPort } from '../../domain/ports/producto.repository-port';
import { Producto } from '../../domain/entities/producto.entity';

@Injectable()
export class GetProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY_PORT)
    private readonly repository: ProductoRepositoryPort,
  ) {}

  async execute(activos: boolean): Promise<Result<Producto[], ProductoError>> {
    if (typeof activos !== 'boolean') {
      return failure({
        code: 'VALIDATION_ERROR',
        message: 'La variable activos debe ser booleana.',
      });
    }

    try {
      return success(await this.repository.getProductos(activos));
    } catch {
      return failure({
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible consultar los productos.',
      });
    }
  }
}
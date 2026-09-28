import { Producto } from '../entities/producto.entity';

export interface ProductoRepositoryPort {
  getProductos(activos: boolean): Promise<Producto[]>;
}

export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT');
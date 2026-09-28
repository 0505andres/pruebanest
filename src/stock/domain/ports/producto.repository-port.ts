import { Producto } from '../entities/producto.entity';

export interface ProductoCantidad {
  productoId: string;
  cantidad: number;
}

export type ResultadoMovimientoStock =
  | { ok: true }
  | {
      ok: false;
      error: {
        code: 'PRODUCTO_NOT_FOUND' | 'STOCK_INSUFICIENTE' | 'PERSISTENCE_ERROR';
        message: string;
      };
    };

export interface ProductoRepositoryPort {
  getProductos(activos: boolean): Promise<Producto[]>;
  descontarStock(items: ProductoCantidad[]): Promise<ResultadoMovimientoStock>;
  reponerStock(items: ProductoCantidad[]): Promise<ResultadoMovimientoStock>;
}

export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT');
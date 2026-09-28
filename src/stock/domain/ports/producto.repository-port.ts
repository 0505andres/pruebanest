import { Producto } from '../entities/producto.entity';

export interface ProductoCantidad {
  productoId: string;
  cantidad: number;
}

export interface ProductoPrecio {
  productoId: string;
  valorUnitario: number;
}

export interface ErrorMovimientoStock {
  ok: false;
  error: {
    code: 'PRODUCTO_NOT_FOUND' | 'STOCK_INSUFICIENTE' | 'PERSISTENCE_ERROR';
    message: string;
  };
}

export type ResultadoMovimientoStock =
  | { ok: true }
  | ErrorMovimientoStock;

export type ResultadoDescuentoStock =
  | { ok: true; productos: ProductoPrecio[] }
  | ErrorMovimientoStock;

export interface ProductoRepositoryPort {
  getProductos(activos: boolean): Promise<Producto[]>;
  descontarStock(items: ProductoCantidad[]): Promise<ResultadoDescuentoStock>;
  reponerStock(items: ProductoCantidad[]): Promise<ResultadoMovimientoStock>;
}

export const PRODUCTO_REPOSITORY_PORT = Symbol('PRODUCTO_REPOSITORY_PORT');
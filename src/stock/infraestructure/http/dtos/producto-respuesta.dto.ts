import type { Producto } from '../../../domain/entities/producto.entity';

export class ProductoRespuestaDto {
  id!: string;
  nombre!: string;
  cantidad!: number;
  codigo!: string;
  foto!: string;
  categoria!: string;
  precio!: number;
  activo!: boolean;

  static fromDomain(producto: Producto): ProductoRespuestaDto {
    return {
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      codigo: producto.codigo,
      foto: producto.foto,
      categoria: producto.categoria,
      precio: producto.precio,
      activo: producto.activo,
    };
  }
}
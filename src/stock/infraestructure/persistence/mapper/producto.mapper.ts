import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';

export class ProductoMapper {
  static toDomain(raw: ProductoOrmEntity): Producto {
    return new Producto(
      raw.id,
      raw.nombre,
      raw.cantidad,
      raw.codigo,
      raw.foto,
      raw.categoria,
      Number(raw.precio),
      raw.activo,
    );
  }

  static toPersistence(producto: Producto): ProductoOrmEntity {
    const entity = new ProductoOrmEntity();
    entity.id = producto.id;
    entity.nombre = producto.nombre;
    entity.cantidad = producto.cantidad;
    entity.codigo = producto.codigo;
    entity.foto = producto.foto;
    entity.categoria = producto.categoria;
    entity.precio = producto.precio.toFixed(2);
    entity.activo = producto.activo;
    return entity;
  }
}
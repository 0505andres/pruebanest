import { Item } from '../../../domain/entities/item.entity';
import { ProductoOrmEntity } from '../../../../stock/infraestructure/persistence/entities/producto.orm-entity';
import { ItemOrmEntity } from '../entities/item.orm-entity';

export class ItemMapper {
  static toDomain(raw: ItemOrmEntity): Item {
    return new Item(
      raw.id,
      raw.compra.id,
      raw.producto.id,
      raw.cantidad,
      Number(raw.valorUnitario),
      Number(raw.valorTotal),
    );
  }

  static toPersistence(item: Item): ItemOrmEntity {
    const entity = new ItemOrmEntity();
    entity.id = item.id;
    entity.producto = Object.assign(new ProductoOrmEntity(), { id: item.productoId });
    entity.cantidad = item.cantidad;
    entity.valorUnitario = item.valorUnitario.toFixed(2);
    entity.valorTotal = item.valorTotal.toFixed(2);
    return entity;
  }
}
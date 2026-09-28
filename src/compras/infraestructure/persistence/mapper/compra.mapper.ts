import { ClienteOrmEntity } from '../../../../clientes/infraestructure/persistence/entities/cliente.orm-entity';
import { Compra } from '../../../domain/entities/compra.entity';
import { CompraOrmEntity } from '../entities/compra.orm-entity';
import { ItemMapper } from './item.mapper';

export class CompraMapper {
  static toDomain(raw: CompraOrmEntity): Compra {
    return new Compra(
      raw.id,
      raw.cliente.id,
      raw.estado,
      raw.codigo,
      raw.fecha,
      Number(raw.subtotal),
      Number(raw.impuesto),
      Number(raw.total),
      (raw.items ?? []).map((item) => ItemMapper.toDomain(item)),
    );
  }

  static toPersistence(compra: Compra): CompraOrmEntity {
    const entity = new CompraOrmEntity();
    entity.id = compra.id;
    entity.cliente = Object.assign(new ClienteOrmEntity(), { id: compra.clienteId });
    entity.estado = compra.estado;
    entity.codigo = compra.codigo;
    entity.fecha = compra.fecha;
    entity.subtotal = compra.subtotal.toFixed(2);
    entity.impuesto = compra.impuesto.toFixed(2);
    entity.total = compra.total.toFixed(2);
    entity.items = compra.items.map((item) => {
      const itemEntity = ItemMapper.toPersistence(item);
      itemEntity.compra = entity;
      return itemEntity;
    });
    return entity;
  }
}
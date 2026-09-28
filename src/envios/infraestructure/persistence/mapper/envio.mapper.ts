import { CompraOrmEntity } from '../../../../compras/infraestructure/persistence/entities/compra.orm-entity';
import { Envio } from '../../../domain/entities/envio.entity';
import { EnvioOrmEntity } from '../entities/envio.orm-entity';

export class EnvioMapper {
  static toDomain(raw: EnvioOrmEntity): Envio {
    return new Envio(raw.id, raw.compra.id, raw.fechaEnvio, raw.estado, raw.domicilio);
  }

  static toPersistence(envio: Envio): EnvioOrmEntity {
    const entity = new EnvioOrmEntity();
    entity.id = envio.id;
    entity.compra = Object.assign(new CompraOrmEntity(), { id: envio.compraId });
    entity.fechaEnvio = envio.fechaEnvio;
    entity.estado = envio.estado;
    entity.domicilio = envio.domicilio;
    return entity;
  }
}
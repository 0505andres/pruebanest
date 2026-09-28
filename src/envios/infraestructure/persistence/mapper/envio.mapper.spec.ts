import { CompraOrmEntity } from '../../../../compras/infraestructure/persistence/entities/compra.orm-entity';
import { EnvioOrmEntity } from '../entities/envio.orm-entity';
import { EnvioMapper } from './envio.mapper';
import { Envio } from '../../../domain/entities/envio.entity';

describe('EnvioMapper', () => {
  it('convierte la relación compra a compraId en dominio', () => {
    const raw = Object.assign(new EnvioOrmEntity(), {
      id: 'envio-1',
      compra: Object.assign(new CompraOrmEntity(), { id: 'compra-1' }),
      fechaEnvio: '2026-09-27',
      estado: 'ENVIADO',
      domicilio: 'Calle 123',
    });

    const envio = EnvioMapper.toDomain(raw);

    expect(envio.compraId).toBe('compra-1');
    expect(envio.fechaEnvio).toBe('2026-09-27');
  });

  it('convierte compraId a la relación ORM', () => {
    const envio = new Envio('envio-1', 'compra-1', '2026-09-27', 'ENVIADO', 'Calle 123');

    const raw = EnvioMapper.toPersistence(envio);

    expect(raw.compra.id).toBe('compra-1');
    expect(raw.estado).toBe('ENVIADO');
  });
});
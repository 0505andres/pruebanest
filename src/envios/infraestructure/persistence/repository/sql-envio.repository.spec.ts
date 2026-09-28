import { Repository } from 'typeorm';
import { EnvioOrmEntity } from '../entities/envio.orm-entity';
import { SqlEnvioRepository } from './sql-envio.repository';

describe('SqlEnvioRepository', () => {
  let repository: jest.Mocked<Repository<EnvioOrmEntity>>;
  let adapter: SqlEnvioRepository;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<EnvioOrmEntity>>;
    adapter = new SqlEnvioRepository(repository);
  });

  it('busca el envío filtrando por el código de compra asociado', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(adapter.estadoEnvioPorCompra('7890-2026092810')).resolves.toBeNull();

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { compra: { codigo: '7890-2026092810' } },
      relations: { compra: true },
    });
  });
});
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

    await expect(adapter.estadoEnvioPorCompra('1234567')).resolves.toBeNull();

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { compra: { codigo: '1234567' } },
      relations: { compra: true },
    });
  });
});
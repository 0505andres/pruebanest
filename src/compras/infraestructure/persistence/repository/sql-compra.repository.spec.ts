import { Repository } from 'typeorm';
import { CompraOrmEntity } from '../entities/compra.orm-entity';
import { SqlCompraRepository } from './sql-compra.repository';

describe('SqlCompraRepository', () => {
  let repository: jest.Mocked<Repository<CompraOrmEntity>>;
  let adapter: SqlCompraRepository;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<CompraOrmEntity>>;
    adapter = new SqlCompraRepository(repository);
  });

  it('actualiza el estado y el marcador interno de restitución de inventario', async () => {
    repository.update.mockResolvedValue({ affected: 1 } as never);
    repository.findOne.mockResolvedValue(null);

    await adapter.actualizarEstadoCompra('1234567', 'CANCELLED', true);

    expect(repository.update).toHaveBeenCalledWith(
      { codigo: '1234567' },
      { estado: 'CANCELLED', inventarioRestituido: true },
    );
  });

  it('no consulta la compra si el código no existe', async () => {
    repository.update.mockResolvedValue({ affected: 0 } as never);

    await expect(adapter.actualizarEstadoCompra('NO-EXISTE', 'PAGADA', false)).resolves.toBeNull();
    expect(repository.findOne).not.toHaveBeenCalled();
  });
});
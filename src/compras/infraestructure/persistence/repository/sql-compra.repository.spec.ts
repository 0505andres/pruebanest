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

  it('actualiza solo la columna estado', async () => {
    repository.update.mockResolvedValue({ affected: 1 } as never);
    repository.findOne.mockResolvedValue(null);

    await adapter.actualizarEstadoCompra('COM-001', 'PAGADA');

    expect(repository.update).toHaveBeenCalledWith(
      { codigo: 'COM-001' },
      { estado: 'PAGADA' },
    );
  });

  it('no consulta la compra si el código no existe', async () => {
    repository.update.mockResolvedValue({ affected: 0 } as never);

    await expect(adapter.actualizarEstadoCompra('NO-EXISTE', 'PAGADA')).resolves.toBeNull();
    expect(repository.findOne).not.toHaveBeenCalled();
  });
});
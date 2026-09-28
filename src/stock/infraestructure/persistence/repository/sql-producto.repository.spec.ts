import { EntityManager, Repository } from 'typeorm';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';
import { SqlProductoRepository } from './sql-producto.repository';

describe('SqlProductoRepository inventory movements', () => {
  let manager: jest.Mocked<Pick<EntityManager, 'findOne' | 'save'>>;
  let transaction: jest.Mock;
  let repository: jest.Mocked<Repository<ProductoOrmEntity>>;
  let adapter: SqlProductoRepository;

  beforeEach(() => {
    manager = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation(async (producto) => producto),
    };
    transaction = jest.fn(async (work: (entityManager: EntityManager) => Promise<unknown>) =>
      work(manager as unknown as EntityManager),
    );
    repository = {
      manager: { transaction } as unknown as EntityManager,
    } as unknown as jest.Mocked<Repository<ProductoOrmEntity>>;
    adapter = new SqlProductoRepository(repository);
  });

  it('descuenta todo el lote de forma transaccional y desactiva productos agotados', async () => {
    const producto = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1',
      codigo: 'PROD001',
      cantidad: 2,
      activo: true,
    });
    manager.findOne.mockResolvedValue(producto);

    await expect(adapter.descontarStock([{ productoId: 'producto-1', cantidad: 2 }])).resolves.toEqual({ ok: true });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(manager.findOne).toHaveBeenCalledWith(ProductoOrmEntity, {
      where: { id: 'producto-1' },
      lock: { mode: 'pessimistic_write' },
    });
    expect(manager.save).toHaveBeenCalledWith(expect.objectContaining({ cantidad: 0, activo: false }));
  });

  it('no guarda ningún producto si un item no tiene cantidad suficiente', async () => {
    const disponible = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1', codigo: 'PROD001', cantidad: 10, activo: true,
    });
    const agotado = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-2', codigo: 'PROD002', cantidad: 1, activo: true,
    });
    manager.findOne.mockResolvedValueOnce(disponible).mockResolvedValueOnce(agotado);

    await expect(adapter.descontarStock([
      { productoId: 'producto-1', cantidad: 2 },
      { productoId: 'producto-2', cantidad: 2 },
    ])).resolves.toMatchObject({ ok: false, error: { code: 'STOCK_INSUFICIENTE' } });

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('rechaza explícitamente una cantidad de item superior al stock del producto', async () => {
    const producto = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1', codigo: 'PROD001', cantidad: 1, activo: true,
    });
    manager.findOne.mockResolvedValue(producto);

    await expect(adapter.descontarStock([
      { productoId: 'producto-1', cantidad: 2 },
    ])).resolves.toEqual({
      ok: false,
      error: {
        code: 'STOCK_INSUFICIENTE',
        message: 'Stock insuficiente para el producto PROD001.',
      },
    });

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('agrupa líneas repetidas del mismo producto antes de descontar', async () => {
    const producto = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1', codigo: 'PROD001', cantidad: 3, activo: true,
    });
    manager.findOne.mockResolvedValue(producto);

    await expect(adapter.descontarStock([
      { productoId: 'producto-1', cantidad: 1 },
      { productoId: 'producto-1', cantidad: 2 },
    ])).resolves.toEqual({ ok: true });

    expect(manager.findOne).toHaveBeenCalledTimes(1);
    expect(manager.save).toHaveBeenCalledWith(expect.objectContaining({ cantidad: 0, activo: false }));
  });

  it('reactiva el producto cuando se repone una cantidad positiva', async () => {
    const producto = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1', codigo: 'PROD001', cantidad: 0, activo: false,
    });
    manager.findOne.mockResolvedValue(producto);

    await expect(adapter.reponerStock([{ productoId: 'producto-1', cantidad: 4 }])).resolves.toEqual({ ok: true });

    expect(manager.save).toHaveBeenCalledWith(expect.objectContaining({ cantidad: 4, activo: true }));
  });
});
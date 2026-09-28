import { Compra } from '../../domain/entities/compra.entity';
import { CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { ProductoRepositoryPort } from '../../../stock/domain/ports/producto.repository-port';
import { RegistrarCompraCommand, RegistrarCompraUseCase } from './registrar-compra.use-case';

describe('RegistrarCompraUseCase', () => {
  let repository: jest.Mocked<CompraRepositoryPort>;
  let productoRepository: jest.Mocked<ProductoRepositoryPort>;
  let useCase: RegistrarCompraUseCase;

  const command: RegistrarCompraCommand = {
    clienteId: 'cliente-1',
    subtotal: 100,
    items: [{ productoId: 'producto-1', cantidad: 2, valorUnitario: 50, valorTotal: 100 }],
  };

  beforeEach(() => {
    repository = {
      guardarCompra: jest.fn(),
      buscarCompraPorCodigo: jest.fn(),
      actualizarEstadoCompra: jest.fn(),
    };
    productoRepository = {
      getProductos: jest.fn(),
      descontarStock: jest.fn().mockResolvedValue({ ok: true }),
      reponerStock: jest.fn().mockResolvedValue({ ok: true }),
    };
    useCase = new RegistrarCompraUseCase(repository, productoRepository);
  });

  it('registra una compra con sus items cuando el código no existe', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(null);
    repository.guardarCompra.mockImplementation(async (compra) => compra);

    const result = await useCase.execute(command);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBeInstanceOf(Compra);
    expect(result.value.codigo).toMatch(/^\d{7}$/);
    expect(result.value.fecha).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(result.value.estado).toBe('PENDIENTE');
    expect(result.value.impuesto).toBe(19);
    expect(result.value.total).toBe(119);
    expect(result.value.items).toHaveLength(1);
    expect(repository.guardarCompra).toHaveBeenCalledWith(result.value);
    expect(productoRepository.descontarStock).toHaveBeenCalledWith([
      { productoId: 'producto-1', cantidad: 2 },
    ]);
  });

  it('devuelve conflicto cuando el código de compra ya existe', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue({} as Compra);

    await expect(useCase.execute(command)).resolves.toEqual({
      ok: false,
      error: {
        code: 'DUPLICATE_CODE',
        message: expect.stringContaining('único'),
      },
    });
    expect(repository.guardarCompra).not.toHaveBeenCalled();
    expect(productoRepository.descontarStock).not.toHaveBeenCalled();
  });

  it('devuelve error de validación para una compra sin items', async () => {
    await expect(useCase.execute({ ...command, items: [] })).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'La compra debe tener al menos un item.',
      },
    });
    expect(repository.buscarCompraPorCodigo).not.toHaveBeenCalled();
  });

  it('rechaza la compra cuando un item solicita más unidades que el producto disponible', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(null);
    productoRepository.descontarStock.mockResolvedValue({
      ok: false,
      error: {
        code: 'STOCK_INSUFICIENTE',
        message: 'El item solicita 2 unidades y solo hay 1 disponible.',
      },
    });

    const commandExcedeStock = {
      ...command,
      items: [{ ...command.items[0], cantidad: 2 }],
    };

    await expect(useCase.execute(commandExcedeStock)).resolves.toEqual({
      ok: false,
      error: {
        code: 'STOCK_INSUFICIENTE',
        message: 'El item solicita 2 unidades y solo hay 1 disponible.',
      },
    });
    expect(productoRepository.descontarStock).toHaveBeenCalledWith([
      { productoId: 'producto-1', cantidad: 2 },
    ]);
    expect(repository.guardarCompra).not.toHaveBeenCalled();
  });

  it('devuelve error de persistencia cuando falla el repositorio', async () => {
    repository.buscarCompraPorCodigo.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(command)).resolves.toEqual({
      ok: false,
      error: {
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible registrar la compra.',
      },
    });
    expect(productoRepository.descontarStock).not.toHaveBeenCalled();
  });

  it('restituye el stock si falla el guardado de la compra', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(null);
    repository.guardarCompra.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(command)).resolves.toMatchObject({
      ok: false,
      error: { code: 'PERSISTENCE_ERROR' },
    });
    expect(productoRepository.descontarStock).toHaveBeenCalledTimes(1);
    expect(productoRepository.reponerStock).toHaveBeenCalledWith([
      { productoId: 'producto-1', cantidad: 2 },
    ]);
  });
});
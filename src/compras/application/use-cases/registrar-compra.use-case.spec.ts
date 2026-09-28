import { Compra } from '../../domain/entities/compra.entity';
import { CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { RegistrarCompraCommand, RegistrarCompraUseCase } from './registrar-compra.use-case';

describe('RegistrarCompraUseCase', () => {
  let repository: jest.Mocked<CompraRepositoryPort>;
  let useCase: RegistrarCompraUseCase;

  const command: RegistrarCompraCommand = {
    clienteId: 'cliente-1',
    estado: 'PENDIENTE',
    codigo: 'COM-001',
    fecha: '2026-09-27 10:30:00',
    subtotal: 100,
    impuesto: 19,
    total: 119,
    items: [{ productoId: 'producto-1', cantidad: 2, valorUnitario: 50, valorTotal: 100 }],
  };

  beforeEach(() => {
    repository = {
      guardarCompra: jest.fn(),
      buscarCompraPorCodigo: jest.fn(),
      actualizarEstadoCompra: jest.fn(),
    };
    useCase = new RegistrarCompraUseCase(repository);
  });

  it('registra una compra con sus items cuando el código no existe', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(null);
    repository.guardarCompra.mockImplementation(async (compra) => compra);

    const result = await useCase.execute(command);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBeInstanceOf(Compra);
    expect(result.value.codigo).toBe(command.codigo);
    expect(result.value.items).toHaveLength(1);
    expect(repository.guardarCompra).toHaveBeenCalledWith(result.value);
  });

  it('devuelve conflicto cuando el código de compra ya existe', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue({} as Compra);

    await expect(useCase.execute(command)).resolves.toEqual({
      ok: false,
      error: {
        code: 'DUPLICATE_CODE',
        message: expect.stringContaining(command.codigo),
      },
    });
    expect(repository.guardarCompra).not.toHaveBeenCalled();
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

  it('devuelve error de persistencia cuando falla el repositorio', async () => {
    repository.buscarCompraPorCodigo.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(command)).resolves.toEqual({
      ok: false,
      error: {
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible registrar la compra.',
      },
    });
  });
});
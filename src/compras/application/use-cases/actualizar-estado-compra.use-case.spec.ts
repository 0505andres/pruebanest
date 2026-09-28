import { Compra } from '../../domain/entities/compra.entity';
import { Item } from '../../domain/entities/item.entity';
import { CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { ActualizarEstadoCompraUseCase } from './actualizar-estado-compra.use-case';

describe('ActualizarEstadoCompraUseCase', () => {
  let repository: jest.Mocked<CompraRepositoryPort>;
  let useCase: ActualizarEstadoCompraUseCase;
  const compra = new Compra('compra-1', 'cliente-1', 'PENDIENTE', '1234567', '2026-09-27 10:30:00', 100, 19, 119, [new Item('item-1', 'compra-1', 'producto-1', 1, 100, 100)]);

  beforeEach(() => {
    repository = {
      guardarCompra: jest.fn(),
      buscarCompraPorCodigo: jest.fn(),
      actualizarEstadoCompra: jest.fn(),
    };
    useCase = new ActualizarEstadoCompraUseCase(repository);
  });

  it('actualiza el estado de una compra existente', async () => {
    const actualizada = new Compra(compra.id, compra.clienteId, 'PAGADA', compra.codigo, compra.fecha, compra.subtotal, compra.impuesto, compra.total, compra.items);
    repository.actualizarEstadoCompra.mockResolvedValue(actualizada);

    await expect(useCase.execute('1234567', 'PAGADA')).resolves.toEqual({ ok: true, value: actualizada });
    expect(repository.actualizarEstadoCompra).toHaveBeenCalledWith('1234567', 'PAGADA');
  });

  it('devuelve COMPRA_NOT_FOUND cuando el código no existe', async () => {
    repository.actualizarEstadoCompra.mockResolvedValue(null);

    await expect(useCase.execute('1234567', 'PAGADA')).resolves.toEqual({
      ok: false,
      error: { code: 'COMPRA_NOT_FOUND', message: expect.stringContaining('1234567') },
    });
  });

  it('devuelve VALIDATION_ERROR cuando falta el estado', async () => {
    await expect(useCase.execute('1234567', '')).resolves.toEqual({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: expect.any(String) },
    });
    expect(repository.actualizarEstadoCompra).not.toHaveBeenCalled();
  });
});
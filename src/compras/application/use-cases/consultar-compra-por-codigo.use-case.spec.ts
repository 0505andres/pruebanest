import { Compra } from '../../domain/entities/compra.entity';
import { Item } from '../../domain/entities/item.entity';
import { CompraRepositoryPort } from '../../domain/ports/compra.repository-port';
import { ConsultarCompraPorCodigoUseCase } from './consultar-compra-por-codigo.use-case';

describe('ConsultarCompraPorCodigoUseCase', () => {
  let repository: jest.Mocked<CompraRepositoryPort>;
  let useCase: ConsultarCompraPorCodigoUseCase;
  const compra = new Compra('compra-1', 'cliente-1', 'PENDIENTE', '7890-2026092810', '2026-09-27 10:30:00', 100, 19, 119, [new Item('item-1', 'compra-1', 'producto-1', 1, 100)]);

  beforeEach(() => {
    repository = {
      guardarCompra: jest.fn(),
      buscarCompraPorCodigo: jest.fn(),
      actualizarEstadoCompra: jest.fn(),
    };
    useCase = new ConsultarCompraPorCodigoUseCase(repository);
  });

  it('devuelve la compra encontrada', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(compra);

    await expect(useCase.execute('7890-2026092810')).resolves.toEqual({ ok: true, value: compra });
    expect(repository.buscarCompraPorCodigo).toHaveBeenCalledWith('7890-2026092810');
  });

  it('devuelve COMPRA_NOT_FOUND cuando no existe', async () => {
    repository.buscarCompraPorCodigo.mockResolvedValue(null);

    await expect(useCase.execute('7890-2026092810')).resolves.toEqual({
      ok: false,
      error: { code: 'COMPRA_NOT_FOUND', message: expect.stringContaining('7890-2026092810') },
    });
  });

  it('devuelve VALIDATION_ERROR para código vacío', async () => {
    await expect(useCase.execute('')).resolves.toEqual({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: expect.any(String) },
    });
    expect(repository.buscarCompraPorCodigo).not.toHaveBeenCalled();
  });
});
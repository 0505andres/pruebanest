import { Envio } from '../../domain/entities/envio.entity';
import { EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { EstadoEnvioPorCompraUseCase } from './estado-envio-por-compra.use-case';

describe('EstadoEnvioPorCompraUseCase', () => {
  let repository: jest.Mocked<EnvioRepositoryPort>;
  let useCase: EstadoEnvioPorCompraUseCase;
  const envio = new Envio('envio-1', 'compra-1', '2026-09-27', 'ENVIADO', 'Calle 123');

  beforeEach(() => {
    repository = {
      guardarEnvio: jest.fn(),
      estadoEnvioPorCompra: jest.fn(),
    };
    useCase = new EstadoEnvioPorCompraUseCase(repository);
  });

  it('devuelve el estado del envío asociado a la compra', async () => {
    repository.estadoEnvioPorCompra.mockResolvedValue(envio);

    await expect(useCase.execute('compra-1')).resolves.toEqual({ ok: true, value: envio });
    expect(repository.estadoEnvioPorCompra).toHaveBeenCalledWith('compra-1');
  });

  it('devuelve ENVIO_NOT_FOUND si la compra no tiene envío', async () => {
    repository.estadoEnvioPorCompra.mockResolvedValue(null);

    await expect(useCase.execute('compra-1')).resolves.toEqual({
      ok: false,
      error: {
        code: 'ENVIO_NOT_FOUND',
        message: expect.stringContaining('compra-1'),
      },
    });
  });

  it('devuelve error de validación para una compra vacía', async () => {
    await expect(useCase.execute('')).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: expect.any(String),
      },
    });
    expect(repository.estadoEnvioPorCompra).not.toHaveBeenCalled();
  });
});
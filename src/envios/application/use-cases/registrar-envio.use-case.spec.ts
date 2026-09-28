import { Envio } from '../../domain/entities/envio.entity';
import { EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { RegistrarEnvioCommand, RegistrarEnvioUseCase } from './registrar-envio.use-case';

describe('RegistrarEnvioUseCase', () => {
  let repository: jest.Mocked<EnvioRepositoryPort>;
  let useCase: RegistrarEnvioUseCase;

  const command: RegistrarEnvioCommand = {
    compraId: 'compra-1',
    codigoCompra: '1234567',
    fechaCompra: '2026-09-28 10:30:00',
    domicilio: 'Calle 123',
  };

  beforeEach(() => {
    repository = {
      guardarEnvio: jest.fn(),
      estadoEnvioPorCompra: jest.fn(),
    };
    repository.estadoEnvioPorCompra.mockResolvedValue(null);
    useCase = new RegistrarEnvioUseCase(repository);
  });

  it('registra un envío válido', async () => {
    repository.guardarEnvio.mockImplementation(async (envio) => envio);

    const result = await useCase.execute(command);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBeInstanceOf(Envio);
    expect(result.value.compraId).toBe(command.compraId);
    expect(result.value.fechaEnvio).toBe('2026-10-01');
    expect(result.value.estado).toBe('PROCESO');
    expect(result.value.domicilio).toBe(command.domicilio);
    expect(repository.guardarEnvio).toHaveBeenCalledWith(result.value);
    expect(repository.estadoEnvioPorCompra).toHaveBeenCalledWith(command.codigoCompra);
  });

  it('devuelve error de validación para una fecha inválida', async () => {
    await expect(useCase.execute({ ...command, fechaCompra: 'fecha-invalida' })).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: expect.stringContaining('fecha de creación'),
      },
    });
    expect(repository.guardarEnvio).not.toHaveBeenCalled();
  });

  it('devuelve el envío existente y evita duplicarlo', async () => {
    const existing = new Envio('envio-existing', command.compraId, '2026-10-01', 'PROCESO', command.domicilio);
    repository.estadoEnvioPorCompra.mockResolvedValue(existing);

    await expect(useCase.execute(command)).resolves.toEqual({ ok: true, value: existing });
    expect(repository.estadoEnvioPorCompra).toHaveBeenCalledWith(command.codigoCompra);
    expect(repository.guardarEnvio).not.toHaveBeenCalled();
  });

  it('devuelve error de persistencia si falla el repositorio', async () => {
    repository.guardarEnvio.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(command)).resolves.toEqual({
      ok: false,
      error: {
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible registrar el envío.',
      },
    });
  });
});
import { Envio } from '../../domain/entities/envio.entity';
import { EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { RegistrarEnvioCommand, RegistrarEnvioUseCase } from './registrar-envio.use-case';

describe('RegistrarEnvioUseCase', () => {
  let repository: jest.Mocked<EnvioRepositoryPort>;
  let useCase: RegistrarEnvioUseCase;

  const command: RegistrarEnvioCommand = {
    compraId: 'compra-1',
    fechaEnvio: '2026-09-27',
    estado: 'PREPARANDO',
    domicilio: 'Calle 123',
  };

  beforeEach(() => {
    repository = {
      guardarEnvio: jest.fn(),
      estadoEnvioPorCompra: jest.fn(),
    };
    useCase = new RegistrarEnvioUseCase(repository);
  });

  it('registra un envío válido', async () => {
    repository.guardarEnvio.mockImplementation(async (envio) => envio);

    const result = await useCase.execute(command);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBeInstanceOf(Envio);
    expect(result.value.compraId).toBe(command.compraId);
    expect(result.value.fechaEnvio).toBe(command.fechaEnvio);
    expect(repository.guardarEnvio).toHaveBeenCalledWith(result.value);
  });

  it('devuelve error de validación para una fecha inválida', async () => {
    await expect(useCase.execute({ ...command, fechaEnvio: '27-09-2026' })).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: expect.stringContaining('yyyy-mm-dd'),
      },
    });
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
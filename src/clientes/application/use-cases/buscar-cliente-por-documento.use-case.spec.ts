import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteRepositoryPort } from '../../domain/ports/cliente.repository-port';
import { ClienteEmail } from '../../domain/value-objects/cliente-email.vo';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { BuscarClientePorDocumentoUseCase } from './buscar-cliente-por-documento.use-case';

describe('BuscarClientePorDocumentoUseCase', () => {
  let repository: jest.Mocked<ClienteRepositoryPort>;
  let useCase: BuscarClientePorDocumentoUseCase;

  const numeroDocumento = '12345678';
  const cliente = new Cliente(
    'cliente-1',
    'Ana Perez',
    new NumeroDocumento(numeroDocumento),
    new ClienteEmail('ana@example.com'),
    'Calle 123',
    '5551234567',
  );

  beforeEach(() => {
    repository = {
      guardar: jest.fn(),
      buscarPorDocumento: jest.fn(),
      buscarPorId: jest.fn(),
    };
    useCase = new BuscarClientePorDocumentoUseCase(repository);
  });

  it('devuelve el cliente encontrado por su número de documento', async () => {
    repository.buscarPorDocumento.mockResolvedValue(cliente);

    await expect(useCase.execute(numeroDocumento)).resolves.toEqual({
      ok: true,
      value: cliente,
    });
    expect(repository.buscarPorDocumento).toHaveBeenCalledWith(numeroDocumento);
  });

  it('lanza NotFoundException cuando no existe el cliente', async () => {
    repository.buscarPorDocumento.mockResolvedValue(null);

    await expect(useCase.execute(numeroDocumento)).resolves.toEqual({
      ok: false,
      error: {
        code: 'CLIENT_NOT_FOUND',
        message: expect.stringContaining(numeroDocumento),
      },
    });
    expect(repository.buscarPorDocumento).toHaveBeenCalledWith(numeroDocumento);
  });

  it('rechaza un número de documento inválido antes de consultar el repositorio', async () => {
    await expect(useCase.execute('123')).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: expect.stringContaining('debe tener entre 5 y 20 caracteres'),
      },
    });
    expect(repository.buscarPorDocumento).not.toHaveBeenCalled();
  });

  it('devuelve un error de persistencia si falla el repositorio', async () => {
    repository.buscarPorDocumento.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(numeroDocumento)).resolves.toEqual({
      ok: false,
      error: {
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible consultar el cliente.',
      },
    });
  });
});
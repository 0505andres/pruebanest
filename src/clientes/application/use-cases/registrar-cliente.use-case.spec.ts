import { ConflictException } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteRepositoryPort } from '../../domain/ports/cliente.repository-port';
import { ClienteEmail } from '../../domain/value-objects/cliente-email.vo';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { RegistrarClienteUseCase } from './registrar-cliente.use-case';

describe('RegistrarClienteUseCase', () => {
  let repository: jest.Mocked<ClienteRepositoryPort>;
  let useCase: RegistrarClienteUseCase;

  const command = {
    nombre: 'Ana Perez',
    numeroDocumento: '12345678',
    telefono: '5551234567',
    correo: 'ana@example.com',
    domicilio: 'Calle 123',
  };

  beforeEach(() => {
    repository = {
      guardar: jest.fn(),
      buscarPorDocumento: jest.fn(),
    };
    useCase = new RegistrarClienteUseCase(repository);
  });

  it('registra el cliente cuando el documento no existe', async () => {
    repository.buscarPorDocumento.mockResolvedValue(null);
    repository.guardar.mockImplementation(async (cliente) => cliente);

    const result = await useCase.execute(command);

    expect(repository.buscarPorDocumento).toHaveBeenCalledWith(command.numeroDocumento);
    expect(repository.guardar).toHaveBeenCalledWith(result);
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nombre: command.nombre,
        numeroDocumento: new NumeroDocumento(command.numeroDocumento),
        correo: new ClienteEmail(command.correo),
        domicilio: command.domicilio,
        telefono: command.telefono,
      }),
    );
  });

  it('rechaza el registro si ya existe el número de documento', async () => {
    const existingCliente = new Cliente(
      'cliente-existente',
      'Otra persona',
      new NumeroDocumento(command.numeroDocumento),
      new ClienteEmail('otra@example.com'),
      'Otra dirección',
      '5550000000',
    );
    repository.buscarPorDocumento.mockResolvedValue(existingCliente);

    await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
    expect(repository.guardar).not.toHaveBeenCalled();
  });

  it('rechaza un número de documento inválido antes de consultar el repositorio', async () => {
    await expect(
      useCase.execute({ ...command, numeroDocumento: '123' }),
    ).rejects.toThrow('debe tener entre 5 y 20 caracteres');
    expect(repository.buscarPorDocumento).not.toHaveBeenCalled();
  });

  it('rechaza un correo sin dominio válido antes de consultar el repositorio', async () => {
    await expect(
      useCase.execute({ ...command, correo: 'ana@example' }),
    ).rejects.toThrow('no es válido');
    expect(repository.buscarPorDocumento).not.toHaveBeenCalled();
  });
});
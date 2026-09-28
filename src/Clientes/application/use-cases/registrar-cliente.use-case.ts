import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteEmail } from '../../domain/value-objects/cliente-email.vo';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { CLIENTE_REPOSITORY_PORT, type ClienteRepositoryPort, } from '../../domain/ports/cliente.repository-port';

export interface RegistrarClienteCommand {
    nombre: string;
    numeroDocumento: string;
    telefono: string;
    correo: string;
    domicilio: string;
}

@Injectable()
export class RegistrarClienteUseCase {
    constructor(
        @Inject(CLIENTE_REPOSITORY_PORT)
        private readonly repository: ClienteRepositoryPort,
    ) { }

    async execute(command: RegistrarClienteCommand): Promise<Cliente> {
        // 1. Instanciamos los Value Objects (ejecutan sus reglas de validación en el constructor)
        const documentoVO = new NumeroDocumento(command.numeroDocumento);
        const emailVO = new ClienteEmail(command.correo);

        // 2. Regla de negocio: Verificar que no exista un cliente con el mismo documento
        const clienteExistente = await this.repository.buscarPorDocumento(
            documentoVO.value,
        );
        if (clienteExistente) {
            throw new ConflictException(
                `Ya existe un cliente registrado con el documento ${documentoVO.value}`,
            );
        }

        // 3. Crear la entidad de dominio con un ID único 
        const nuevoCliente = new Cliente(randomUUID(), command.nombre, documentoVO,  emailVO, command.domicilio,command.telefono,);
        // 4. Guardar a través del puerto abstracto 
        return await this.repository.guardar(nuevoCliente);
    }
}
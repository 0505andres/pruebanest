import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { failure, success, type ClienteError, type Result } from '../result';
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

    async execute(command: RegistrarClienteCommand): Promise<Result<Cliente, ClienteError>> {
        let documentoVO: NumeroDocumento;
        let emailVO: ClienteEmail;

        try {
            documentoVO = new NumeroDocumento(command.numeroDocumento);
            emailVO = new ClienteEmail(command.correo);
        } catch (error) {
            if (error instanceof Error) {
                return failure({ code: 'VALIDATION_ERROR', message: error.message });
            }
            return failure({ code: 'VALIDATION_ERROR', message: 'Los datos del cliente no son válidos.' });
        }

        try {
            const clienteExistente = await this.repository.buscarPorDocumento(documentoVO.value);
            if (clienteExistente) {
                return failure({
                    code: 'DUPLICATE_DOCUMENT',
                    message: `Ya existe un cliente registrado con el documento ${documentoVO.value}`,
                });
            }

            const nuevoCliente = new Cliente(
                randomUUID(),
                command.nombre,
                documentoVO,
                emailVO,
                command.domicilio,
                command.telefono,
            );

            return success(await this.repository.guardar(nuevoCliente));
        } catch {
            return failure({
                code: 'PERSISTENCE_ERROR',
                message: 'No fue posible registrar el cliente.',
            });
        }
    }
}
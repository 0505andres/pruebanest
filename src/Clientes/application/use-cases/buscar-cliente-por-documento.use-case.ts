import { Injectable, Inject } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { CLIENTE_REPOSITORY_PORT, type ClienteRepositoryPort, } from '../../domain/ports/cliente.repository-port';
import { failure, success, type ClienteError, type Result } from '../result';


@Injectable()
export class BuscarClientePorDocumentoUseCase {
    constructor(@Inject(CLIENTE_REPOSITORY_PORT)
    private readonly repository: ClienteRepositoryPort,
    ) { }

    async execute(numeroDocumento: string): Promise<Result<Cliente, ClienteError>> {
        let documentoVO: NumeroDocumento;

        try {
            documentoVO = new NumeroDocumento(numeroDocumento);
        } catch (error) {
            if (error instanceof Error) {
                return failure({ code: 'VALIDATION_ERROR', message: error.message });
            }
            return failure({ code: 'VALIDATION_ERROR', message: 'El número de documento no es válido.' });
        }

        try {
            const cliente = await this.repository.buscarPorDocumento(documentoVO.value);
            if (!cliente) {
                return failure({
                    code: 'CLIENT_NOT_FOUND',
                    message: `Cliente con número de documento '${documentoVO.value}' no fue encontrado.`,
                });
            }

            return success(cliente);
        } catch {
            return failure({
                code: 'PERSISTENCE_ERROR',
                message: 'No fue posible consultar el cliente.',
            });
        }
    }
}
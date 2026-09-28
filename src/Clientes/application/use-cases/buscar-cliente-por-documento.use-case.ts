import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { CLIENTE_REPOSITORY_PORT, type ClienteRepositoryPort, } from '../../domain/ports/cliente.repository-port';


@Injectable()
export class BuscarClientePorDocumentoUseCase {
    constructor(@Inject(CLIENTE_REPOSITORY_PORT)
    private readonly repository: ClienteRepositoryPort,
    ) { }

    async execute(numeroDocumento: string): Promise<Cliente> {
        // 1. Instanciamos el Value Object (valida formato y longitud antes de ir a BD)
        const documentoVO = new NumeroDocumento(numeroDocumento);

        // 2. Buscamos a través del puerto 
        const cliente = await this.repository.buscarPorDocumento(documentoVO.value);

        if (!cliente) { throw new NotFoundException(`Cliente con número de documento '${documentoVO.value}' no fue encontrado.`,); }

        return cliente;
    }
}
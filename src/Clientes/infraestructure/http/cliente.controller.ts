import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { RegistrarClienteUseCase } from '../../application/use-cases/registrar-cliente.use-case';
import { BuscarClientePorDocumentoUseCase } from '../../application/use-cases/buscar-cliente-por-documento.use-case';
import type { ClienteError } from '../../application/result';
import { ClienteRespuestaDto } from './dtos/cliente-respuesta.dto';
import { CrearClienteDto } from './dtos/crear-cliente.dto';

@Controller('clientes')
export class ClienteController {
    constructor(private readonly registrarClienteUseCase: RegistrarClienteUseCase,
        private readonly buscarClientePorDocumentoUseCase: BuscarClientePorDocumentoUseCase,
    ) { }


    @Post()
    async registrar(@Body() dto: CrearClienteDto) {
        const result = await this.registrarClienteUseCase.execute({
            nombre: dto.nombre, numeroDocumento: dto.numeroDocumento, telefono: dto.telefono, correo: dto.correo, domicilio: dto.domicilio,
        });

        if (!result.ok) {
            this.lanzarErrorHttp(result.error);
        }

        return { mensaje: 'Cliente registrado exitosamente', data: ClienteRespuestaDto.fromDomain(result.value) };
    }

    @Get('documento/:numeroDocumento')
    async buscarPorDocumento(@Param('numeroDocumento') numeroDocumento: string) {
        const result = await this.buscarClientePorDocumentoUseCase.execute(numeroDocumento);

        if (!result.ok) {
            this.lanzarErrorHttp(result.error);
        }

        return { data: ClienteRespuestaDto.fromDomain(result.value) };
    }

    private lanzarErrorHttp(error: ClienteError): never {
        switch (error.code) {
            case 'VALIDATION_ERROR':
                throw new BadRequestException(error.message);
            case 'DUPLICATE_DOCUMENT':
                throw new ConflictException(error.message);
            case 'CLIENT_NOT_FOUND':
                throw new NotFoundException(error.message);
            default:
                throw new InternalServerErrorException(error.message);
        }
    }
}
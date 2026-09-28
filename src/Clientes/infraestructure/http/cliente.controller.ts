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
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ClienteRespuestaDto } from './dtos/cliente-respuesta.dto';
import { CrearClienteDto } from './dtos/crear-cliente.dto';

@Controller('clientes')
@ApiTags('Clientes')
export class ClienteController {
    constructor(private readonly registrarClienteUseCase: RegistrarClienteUseCase,
        private readonly buscarClientePorDocumentoUseCase: BuscarClientePorDocumentoUseCase,
    ) { }


    @Post()
    @ApiOperation({ summary: 'Registrar un cliente' })
    @ApiCreatedResponse({
        description: 'Cliente registrado correctamente.',
        schema: { example: { mensaje: 'Cliente registrado exitosamente', data: { id: 'uuid', nombre: 'Ana Pérez', numeroDocumento: '12345678', correo: 'ana@example.com', telefono: '+573001234567', domicilio: 'Calle 123 #45-67' } } },
    })
    @ApiBadRequestResponse({ description: 'Los datos del cliente no son válidos.' })
    @ApiConflictResponse({ description: 'Ya existe un cliente con ese documento.' })
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
    @ApiOperation({ summary: 'Buscar cliente por número de documento' })
    @ApiParam({ name: 'numeroDocumento', example: '12345678' })
    @ApiOkResponse({
        description: 'Cliente encontrado.',
        schema: { example: { data: { id: 'uuid', nombre: 'Ana Pérez', numeroDocumento: '12345678', correo: 'ana@example.com', telefono: '+573001234567', domicilio: 'Calle 123 #45-67' } } },
    })
    @ApiNotFoundResponse({ description: 'No se encontró el cliente.' })
    @ApiBadRequestResponse({ description: 'El número de documento no es válido.' })
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
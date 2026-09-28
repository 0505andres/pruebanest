import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EstadoEnvioPorCompraUseCase } from '../../application/use-cases/estado-envio-por-compra.use-case';
import { RegistrarEnvioUseCase } from '../../application/use-cases/registrar-envio.use-case';
import type { EnvioError } from '../../application/result';
import { CrearEnvioDto } from './dtos/crear-envio.dto';
import { EnvioRespuestaDto } from './dtos/envio-respuesta.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('envios')
@ApiTags('Envíos')
export class EnvioController {
  constructor(
    private readonly registrarEnvioUseCase: RegistrarEnvioUseCase,
    private readonly estadoEnvioPorCompraUseCase: EstadoEnvioPorCompraUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un envío para una compra' })
  @ApiCreatedResponse({
    description: 'Envío registrado correctamente.',
    schema: { example: { data: { id: 'envio-uuid', compraId: 'compra-uuid', fechaEnvio: '2026-09-28', estado: 'PREPARANDO', domicilio: 'Calle 123 #45-67' } } },
  })
  @ApiBadRequestResponse({ description: 'Los datos del envío no son válidos.' })
  async registrar(@Body() dto: CrearEnvioDto) {
    const result = await this.registrarEnvioUseCase.execute(dto);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: EnvioRespuestaDto.fromDomain(result.value) };
  }

  @Get('compra/:compraId')
  @ApiOperation({ summary: 'Consultar el estado del envío por compra' })
  @ApiParam({ name: 'compraId', example: 'b8e9c541-1b5c-4d78-9329-69efc85c5630' })
  @ApiOkResponse({
    description: 'Estado del envío encontrado.',
    schema: { example: { data: { id: 'envio-uuid', compraId: 'compra-uuid', fechaEnvio: '2026-09-28', estado: 'ENVIADO', domicilio: 'Calle 123 #45-67' } } },
  })
  @ApiNotFoundResponse({ description: 'La compra todavía no tiene un envío registrado.' })
  async estadoPorCompra(@Param('compraId') compraId: string) {
    const result = await this.estadoEnvioPorCompraUseCase.execute(compraId);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: EnvioRespuestaDto.fromDomain(result.value) };
  }

  private lanzarErrorHttp(error: EnvioError): never {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        throw new BadRequestException(error.message);
      case 'ENVIO_NOT_FOUND':
        throw new NotFoundException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
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

@Controller('envios')
export class EnvioController {
  constructor(
    private readonly registrarEnvioUseCase: RegistrarEnvioUseCase,
    private readonly estadoEnvioPorCompraUseCase: EstadoEnvioPorCompraUseCase,
  ) {}

  @Post()
  async registrar(@Body() dto: CrearEnvioDto) {
    const result = await this.registrarEnvioUseCase.execute(dto);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: EnvioRespuestaDto.fromDomain(result.value) };
  }

  @Get('compra/:compraId')
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
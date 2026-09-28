import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { EstadoEnvioPorCompraUseCase } from '../../application/use-cases/estado-envio-por-compra.use-case';
import type { EnvioError } from '../../application/result';
import { EnvioRespuestaDto } from './dtos/envio-respuesta.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('envios')
@ApiTags('Envíos')
export class EnvioController {
  constructor(
    private readonly estadoEnvioPorCompraUseCase: EstadoEnvioPorCompraUseCase,
  ) {}

  @Get('compra/:codigoCompra')
  @ApiOperation({ summary: 'Consultar el estado del envío por código de compra' })
  @ApiParam({ name: 'codigoCompra', example: '1234567', description: 'Código de compra de 7 dígitos.' })
  @ApiOkResponse({
    description: 'Estado del envío encontrado.',
    schema: { example: { data: { id: 'envio-uuid', compraId: 'compra-uuid', fechaEnvio: '2026-09-28', estado: 'ENVIADO', domicilio: 'Calle 123 #45-67' } } },
  })
  @ApiNotFoundResponse({ description: 'La compra todavía no tiene un envío registrado.' })
  async estadoPorCompra(@Param('codigoCompra') codigoCompra: string) {
    const result = await this.estadoEnvioPorCompraUseCase.execute(codigoCompra);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: EnvioRespuestaDto.fromDomain(result.value) };
  }

  private lanzarErrorHttp(error: EnvioError): never {
    if (error.code === 'ENVIO_NOT_FOUND') throw new NotFoundException(error.message);
    throw new InternalServerErrorException(error.message);
  }
}
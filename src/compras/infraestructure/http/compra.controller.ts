import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActualizarEstadoCompraUseCase } from '../../application/use-cases/actualizar-estado-compra.use-case';
import { ConsultarCompraPorCodigoUseCase } from '../../application/use-cases/consultar-compra-por-codigo.use-case';
import { RegistrarCompraUseCase } from '../../application/use-cases/registrar-compra.use-case';
import type { CompraError } from '../../application/result';
import { ActualizarEstadoCompraDto } from './dtos/actualizar-estado-compra.dto';
import { CompraRespuestaDto } from './dtos/compra-respuesta.dto';
import { CrearCompraDto } from './dtos/crear-compra.dto';

@Controller('compras')
export class CompraController {
  constructor(
    private readonly registrarCompraUseCase: RegistrarCompraUseCase,
    private readonly consultarCompraPorCodigoUseCase: ConsultarCompraPorCodigoUseCase,
    private readonly actualizarEstadoCompraUseCase: ActualizarEstadoCompraUseCase,
  ) {}

  @Post()
  async registrar(@Body() dto: CrearCompraDto) {
    const result = await this.registrarCompraUseCase.execute(dto);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: CompraRespuestaDto.fromDomain(result.value) };
  }

  @Get('codigo/:codigo')
  async consultarPorCodigo(@Param('codigo') codigo: string) {
    const result = await this.consultarCompraPorCodigoUseCase.execute(codigo);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: CompraRespuestaDto.fromDomain(result.value) };
  }

  @Patch(':codigo/estado')
  async actualizarEstado(
    @Param('codigo') codigo: string,
    @Body() dto: ActualizarEstadoCompraDto,
  ) {
    const result = await this.actualizarEstadoCompraUseCase.execute(codigo, dto.estado);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: CompraRespuestaDto.fromDomain(result.value) };
  }

  private lanzarErrorHttp(error: CompraError): never {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        throw new BadRequestException(error.message);
      case 'DUPLICATE_CODE':
        throw new ConflictException(error.message);
      case 'COMPRA_NOT_FOUND':
        throw new NotFoundException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
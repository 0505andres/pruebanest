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
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('compras')
@ApiTags('Compras')
export class CompraController {
  constructor(
    private readonly registrarCompraUseCase: RegistrarCompraUseCase,
    private readonly consultarCompraPorCodigoUseCase: ConsultarCompraPorCodigoUseCase,
    private readonly actualizarEstadoCompraUseCase: ActualizarEstadoCompraUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una compra con sus items' })
  @ApiCreatedResponse({
    description: 'Compra registrada correctamente.',
    schema: { example: { data: { id: 'uuid', clienteId: 'cliente-uuid', estado: 'PENDIENTE', codigo: 'COM-001', fecha: '2026-09-27 10:30:00', subtotal: 100.5, impuesto: 19.1, total: 119.6, items: [{ id: 'item-uuid', compraId: 'uuid', productoId: 'producto-uuid', cantidad: 2, valorUnitario: 50.25, valorTotal: 100.5 }] } } },
  })
  @ApiBadRequestResponse({ description: 'Los datos de la compra no son válidos.' })
  @ApiConflictResponse({ description: 'Ya existe una compra con ese código.' })
  async registrar(@Body() dto: CrearCompraDto) {
    const result = await this.registrarCompraUseCase.execute(dto);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: CompraRespuestaDto.fromDomain(result.value) };
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Consultar una compra por código' })
  @ApiParam({ name: 'codigo', example: 'COM-001' })
  @ApiOkResponse({
    description: 'Compra encontrada.',
    schema: { example: { data: { id: 'uuid', clienteId: 'cliente-uuid', estado: 'PENDIENTE', codigo: 'COM-001', fecha: '2026-09-27 10:30:00', subtotal: 100.5, impuesto: 19.1, total: 119.6, items: [] } } },
  })
  @ApiNotFoundResponse({ description: 'No se encontró la compra.' })
  async consultarPorCodigo(@Param('codigo') codigo: string) {
    const result = await this.consultarCompraPorCodigoUseCase.execute(codigo);
    if (!result.ok) this.lanzarErrorHttp(result.error);
    return { data: CompraRespuestaDto.fromDomain(result.value) };
  }

  @Patch(':codigo/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una compra' })
  @ApiParam({ name: 'codigo', example: 'COM-001' })
  @ApiOkResponse({
    description: 'Estado de la compra actualizado.',
    schema: { example: { data: { id: 'uuid', clienteId: 'cliente-uuid', estado: 'PAGADA', codigo: 'COM-001', fecha: '2026-09-27 10:30:00', subtotal: 100.5, impuesto: 19.1, total: 119.6, items: [] } } },
  })
  @ApiBadRequestResponse({ description: 'El estado no es válido.' })
  @ApiNotFoundResponse({ description: 'No se encontró la compra.' })
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
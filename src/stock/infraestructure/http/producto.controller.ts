import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GetProductosUseCase } from '../../application/use-cases/get-productos.use-case';
import type { ProductoError } from '../../application/result';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetProductosDto } from './dtos/get-productos.dto';
import { ProductoRespuestaDto } from './dtos/producto-respuesta.dto';

@Controller('stock/productos')
@ApiTags('Stock')
export class ProductoController {
  constructor(private readonly getProductosUseCase: GetProductosUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos por estado activo' })
  @ApiQuery({ name: 'activos', type: Boolean, required: true, example: true })
  @ApiOkResponse({
    description: 'Lista de productos filtrada por estado.',
    schema: { example: { data: [{ id: 'uuid', nombre: 'Teclado', cantidad: 10, codigo: 'TEC-001', foto: 'data:image/png;base64,...', categoria: 'Periféricos', precio: 25.5, activo: true }] } },
  })
  @ApiBadRequestResponse({ description: 'El filtro activos debe ser true o false.' })
  async getProductos(@Query() dto: GetProductosDto) {
    const result = await this.getProductosUseCase.execute(dto.activos);

    if (!result.ok) {
      this.lanzarErrorHttp(result.error);
    }

    return { data: result.value.map(ProductoRespuestaDto.fromDomain) };
  }

  private lanzarErrorHttp(error: ProductoError): never {
    if (error.code === 'VALIDATION_ERROR') {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(error.message);
  }
}
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GetProductosUseCase } from '../../application/use-cases/get-productos.use-case';
import type { ProductoError } from '../../application/result';
import { GetProductosDto } from './dtos/get-productos.dto';
import { ProductoRespuestaDto } from './dtos/producto-respuesta.dto';

@Controller('stock/productos')
export class ProductoController {
  constructor(private readonly getProductosUseCase: GetProductosUseCase) {}

  @Get()
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
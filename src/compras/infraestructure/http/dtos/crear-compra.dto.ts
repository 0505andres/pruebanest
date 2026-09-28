import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Min, ValidateNested } from 'class-validator';

export class CrearCompraItemDto {
  @IsString()
  @IsNotEmpty()
  productoId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorUnitario!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorTotal!: number;
}

export class CrearCompraDto {
  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @IsString()
  @IsNotEmpty()
  estado!: string;

  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: 'La fecha debe tener el formato yyyy-mm-dd hh:mm:ss.',
  })
  fecha!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  impuesto!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearCompraItemDto)
  items!: CrearCompraItemDto[];
}
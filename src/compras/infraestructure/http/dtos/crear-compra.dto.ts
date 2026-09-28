import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCompraItemDto {
  @ApiProperty({ example: 'a4f8a550-31fc-44de-a3c5-a8cdd4641bd6' })
  @IsString()
  @IsNotEmpty()
  productoId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @ApiProperty({ example: 50.25, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorUnitario!: number;

  @ApiProperty({ example: 100.5, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorTotal!: number;
}

export class CrearCompraDto {
  @ApiProperty({ example: 'b8e9c541-1b5c-4d78-9329-69efc85c5630' })
  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @ApiProperty({ example: 'COM-001' })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiProperty({ example: '2026-09-27 10:30:00', description: 'Fecha en formato yyyy-mm-dd hh:mm:ss.' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: 'La fecha debe tener el formato yyyy-mm-dd hh:mm:ss.',
  })
  fecha!: string;

  @ApiProperty({ example: 100.5, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal!: number;

  @ApiProperty({ example: 19.1, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  impuesto!: number;

  @ApiProperty({ example: 119.6, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total!: number;

  @ApiProperty({ type: () => [CrearCompraItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearCompraItemDto)
  items!: CrearCompraItemDto[];
}
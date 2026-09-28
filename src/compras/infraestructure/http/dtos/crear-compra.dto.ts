import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
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

}

export class CrearCompraDto {
  @ApiProperty({ example: 'b8e9c541-1b5c-4d78-9329-69efc85c5630' })
  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @ApiProperty({ example: 100.5, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal!: number;

  @ApiProperty({ type: () => [CrearCompraItemDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1, { message: 'La compra debe tener al menos un item.' })
  @ValidateNested({ each: true })
  @Type(() => CrearCompraItemDto)
  items!: CrearCompraItemDto[];
}
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductosDto {
  @ApiProperty({ type: Boolean, example: true, description: 'Filtra productos activos (true) o inactivos (false).' })
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'La variable activos debe ser booleana.' })
  activos!: boolean;
}
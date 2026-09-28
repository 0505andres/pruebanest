import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class GetProductosDto {
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'La variable activos debe ser booleana.' })
  activos!: boolean;
}
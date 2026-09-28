import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarEstadoCompraDto {
  @ApiProperty({ example: 'PAGADA' })
  @IsString()
  @IsNotEmpty()
  estado!: string;
}
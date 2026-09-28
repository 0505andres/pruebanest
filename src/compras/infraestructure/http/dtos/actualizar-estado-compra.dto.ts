import { IsNotEmpty, IsString } from 'class-validator';

export class ActualizarEstadoCompraDto {
  @IsString()
  @IsNotEmpty()
  estado!: string;
}
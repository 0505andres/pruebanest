import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearEnvioDto {
  @ApiProperty({ example: 'b8e9c541-1b5c-4d78-9329-69efc85c5630' })
  @IsString()
  @IsNotEmpty()
  compraId!: string;

  @ApiProperty({ example: '2026-09-28', description: 'Fecha en formato yyyy-mm-dd.' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de envío debe tener el formato yyyy-mm-dd.',
  })
  fechaEnvio!: string;

  @ApiProperty({ example: 'PREPARANDO' })
  @IsString()
  @IsNotEmpty()
  estado!: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  @IsNotEmpty()
  domicilio!: string;
}
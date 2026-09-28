import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CrearEnvioDto {
  @IsString()
  @IsNotEmpty()
  compraId!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de envío debe tener el formato yyyy-mm-dd.',
  })
  fechaEnvio!: string;

  @IsString()
  @IsNotEmpty()
  estado!: string;

  @IsString()
  @IsNotEmpty()
  domicilio!: string;
}
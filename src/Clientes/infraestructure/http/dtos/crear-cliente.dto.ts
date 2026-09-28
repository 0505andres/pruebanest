import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearClienteDto {
    @ApiProperty({ example: 'Ana Pérez', description: 'Nombre completo del cliente.' })
    @IsString({ message: "Los nombres deben ser texto." })
    @IsNotEmpty({ message: "Los nombres son obligatorios." })
    nombre: string;
    @ApiProperty({ example: '12345678', minLength: 5, maxLength: 20 })
    @IsString({ message: "El documento debe ser texto." })
    @IsNotEmpty({ message: "El número de documento es obligatorio." })
    @Length(5, 20, {
        message: "El documento debe tener entre 5 y 20 caracteres.",
    })
    numeroDocumento: string;
    @ApiProperty({ example: '+573001234567' })
    @IsString({ message: "El teléfono debe ser texto." })
    @IsNotEmpty({ message: "El teléfono es obligatorio." })
    telefono: string;
    @ApiProperty({ example: 'ana@example.com' })
    @IsEmail({}, { message: "El formato del correo es inválido." })
    @IsNotEmpty({ message: "El correo es obligatorio." })
    correo: string;
    @ApiProperty({ example: 'Calle 123 #45-67' })
    @IsString({ message: "La dirección debe ser texto." })
    @IsNotEmpty({ message: "La dirección es obligatoria." })
    domicilio: string;
}

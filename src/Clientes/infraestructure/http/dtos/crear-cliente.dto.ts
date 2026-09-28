import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CrearClienteDto {
    @IsString({ message: "Los nombres deben ser texto." })
    @IsNotEmpty({ message: "Los nombres son obligatorios." })
    nombre: string;
    @IsString({ message: "El documento debe ser texto." })
    @IsNotEmpty({ message: "El número de documento es obligatorio." })
    @Length(5, 20, {
        message: "El documento debe tener entre 5 y 20 caracteres.",
    })
    numeroDocumento: string;
    @IsString({ message: "El teléfono debe ser texto." })
    @IsNotEmpty({ message: "El teléfono es obligatorio." })
    telefono: string;
    @IsEmail({}, { message: "El formato del correo es inválido." })
    @IsNotEmpty({ message: "El correo es obligatorio." })
    correo: string;
    @IsString({ message: "La dirección debe ser texto." })
    @IsNotEmpty({ message: "La dirección es obligatoria." })
    domicilio: string;
}

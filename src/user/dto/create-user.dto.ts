import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  // Validación de email con formato correcto
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  // Validación de contraseña con mínimo 6 caracteres
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  // Validación de nombre
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  // Rol del usuario
  @IsOptional()
  @IsEnum(['admin', 'profesor', 'alumno'], {
    message: 'El rol debe ser admin, profesor o alumno',
  })
  rol?: string;
}

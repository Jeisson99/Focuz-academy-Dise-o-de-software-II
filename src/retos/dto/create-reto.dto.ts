import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class CreateRetoDto {
  @IsString({ message: 'El ID del nivel debe ser texto' })
  @IsNotEmpty({ message: 'El ID del nivel es obligatorio' })
  nivel_id: string;

  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsEnum(['quiz', 'codigo', 'proyecto'], {
    message: 'El tipo debe ser quiz, codigo o proyecto',
  })
  tipo?: string;

  @IsOptional()
  @IsInt({ message: 'Los intentos máximos deben ser un número entero' })
  @Min(1, { message: 'Los intentos máximos deben ser al menos 1' })
  intentos_max?: number;

  @IsOptional()
  @IsInt({ message: 'El puntaje base debe ser un número entero' })
  @Min(0, { message: 'El puntaje base no puede ser negativo' })
  puntaje_base?: number;
}

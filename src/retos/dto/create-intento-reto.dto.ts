import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateIntentoRetoDto {
  @IsString({ message: 'El ID del progreso del nivel debe ser texto' })
  @IsNotEmpty({ message: 'El ID del progreso del nivel es obligatorio' })
  progreso_nivel_id: string;

  @IsString({ message: 'El ID del reto debe ser texto' })
  @IsNotEmpty({ message: 'El ID del reto es obligatorio' })
  reto_id: string;

  @IsOptional()
  @IsInt({ message: 'El número de intento debe ser un entero' })
  @Min(1, { message: 'El número de intento debe ser al menos 1' })
  numero_intento?: number;

  @IsOptional()
  @IsInt({ message: 'El puntaje obtenido debe ser un entero' })
  @Min(0, { message: 'El puntaje no puede ser negativo' })
  puntaje_obtenido?: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo aprobado debe ser un booleano' })
  aprobado?: boolean;

  @IsOptional()
  @IsInt({ message: 'La duración debe ser un entero' })
  @Min(0, { message: 'La duración no puede ser negativa' })
  duracion_seg?: number;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

export class CreateNivelDto {
  @IsString({ message: 'El curso_id debe ser un texto (UUID)' })
  @IsNotEmpty({ message: 'El curso_id es obligatorio' })
  curso_id: string;

  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe ser al menos 1' })
  orden: number;

  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La URL del video debe ser un texto' })
  url_video?: string;

  @IsOptional()
  @IsBoolean({ message: 'es_obligatorio debe ser un booleano' })
  es_obligatorio?: boolean;
}

export class CreateGuiaImplementacionDto {
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'El contenido debe ser texto' })
  contenido?: string;

  @IsOptional()
  @IsString({ message: 'La URL del recurso debe ser un texto' })
  url_recurso?: string;
}

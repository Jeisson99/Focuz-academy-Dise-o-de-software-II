import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class CreateLogroDto {
  @IsString()
  @IsNotEmpty()
  curso_id: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  icono_url?: string;

  @IsEnum(['racha', 'velocidad', 'precision', 'constancia'])
  tipo: string;

  @IsInt()
  @Min(1)
  umbral: number;
}

export class SumarPuntosDto {
  @IsInt()
  @Min(1)
  puntos: number;
}

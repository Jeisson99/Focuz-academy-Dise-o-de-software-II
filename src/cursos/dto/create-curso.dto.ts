import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateCursoDto {
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsOptional()
  @IsString({ message: 'La url del video introductorio debe ser texto' })
  url_video_intro?: string;

  @IsOptional()
  @IsEnum(['borrador', 'publicado', 'archivado'], {
    message: 'El estado debe ser borrador, publicado o archivado',
  })
  estado?: string;
}

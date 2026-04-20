import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoriaVideoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(7)
  color_hex?: string;
  
  // icono_url e icono_public_id no se reciben en el DTO porque 
  // se generarán internamente a partir del archivo subido
}

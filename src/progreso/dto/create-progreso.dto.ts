import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class StartProgresoDto {
  @IsString({ message: 'El nivel_id debe ser un UUID' })
  @IsNotEmpty()
  nivel_id: string;

  @IsString({ message: 'El inscripcion_id debe ser un UUID' })
  @IsNotEmpty()
  inscripcion_id: string;
}

export class UpdateProgresoDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  segundos_vistos?: number;
}

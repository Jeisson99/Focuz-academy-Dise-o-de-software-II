import { IsString, IsNotEmpty } from 'class-validator';

export class StartSesionDto {
  @IsString()
  @IsNotEmpty()
  inscripcion_id: string;
}

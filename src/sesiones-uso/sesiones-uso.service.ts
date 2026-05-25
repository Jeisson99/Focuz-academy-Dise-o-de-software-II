import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SesionUso } from './entities/sesion-uso.entity';
import { StartSesionDto } from './dto/create-sesiones-uso.dto';

@Injectable()
export class SesionesUsoService {
  constructor(
    @InjectRepository(SesionUso)
    private readonly sesionRepository: Repository<SesionUso>,
  ) {}

  async iniciarSesion(startDto: StartSesionDto) {
    const sesion = this.sesionRepository.create({
      inscripcion_id: startDto.inscripcion_id,
      inicio: new Date(),
      fecha: new Date(), // Guardamos la fecha actual para reportes por día
    });

    return await this.sesionRepository.save(sesion);
  }

  async cerrarSesion(id: string) {
    const sesion = await this.sesionRepository.findOne({ where: { id } });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada');
    }

    if (sesion.fin) {
      throw new BadRequestException('Esta sesión ya fue cerrada');
    }

    const fin = new Date();
    const duracionMs = fin.getTime() - sesion.inicio.getTime();

    sesion.fin = fin;
    sesion.duracion_seg = Math.floor(duracionMs / 1000); // Calculamos segundos

    return await this.sesionRepository.save(sesion);
  }
}

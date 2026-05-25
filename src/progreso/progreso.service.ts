import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgresoNivel } from './entities/progreso-nivel.entity';
import { StartProgresoDto, UpdateProgresoDto } from './dto/create-progreso.dto';

@Injectable()
export class ProgresoService {
  constructor(
    @InjectRepository(ProgresoNivel)
    private readonly progresoRepository: Repository<ProgresoNivel>,
  ) {}

  async iniciarNivel(startDto: StartProgresoDto) {
    // Verificamos si ya existe el progreso
    const existente = await this.progresoRepository.findOne({
      where: {
        inscripcion_id: startDto.inscripcion_id,
        nivel_id: startDto.nivel_id,
      },
    });

    if (existente) {
      // Si ya existía, contamos que volvió a ver el video
      existente.veces_visto_video += 1;
      return await this.progresoRepository.save(existente);
    }

    // Si es nuevo, lo creamos
    const nuevoProgreso = this.progresoRepository.create({
      inscripcion_id: startDto.inscripcion_id,
      nivel_id: startDto.nivel_id,
      veces_visto_video: 1,
    });

    return await this.progresoRepository.save(nuevoProgreso);
  }

  async findOne(id: string) {
    const progreso = await this.progresoRepository.findOne({ where: { id } });
    if (!progreso) throw new NotFoundException('Progreso no encontrado');
    return progreso;
  }

  async actualizarTiempo(id: string, updateDto: UpdateProgresoDto) {
    const progreso = await this.findOne(id);

    if (updateDto.segundos_vistos) {
      progreso.tiempo_total_seg += updateDto.segundos_vistos;
    }

    return await this.progresoRepository.save(progreso);
  }

  async completarNivel(id: string) {
    const progreso = await this.findOne(id);

    if (progreso.completado) {
      throw new BadRequestException(
        'Este nivel ya fue marcado como completado',
      );
    }

    progreso.completado = true;
    progreso.fecha_fin = new Date();

    return await this.progresoRepository.save(progreso);
  }

  async getProgresoDeInscripcion(inscripcion_id: string) {
    return await this.progresoRepository.find({
      where: { inscripcion_id },
      relations: ['nivel'], // Traemos el nivel para ver el título
    });
  }
}

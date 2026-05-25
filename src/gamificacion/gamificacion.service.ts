import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamificacionCurso } from './entities/gamificacion-curso.entity';
import { Logro } from './entities/logro.entity';
import { UsuarioLogro } from './entities/usuario-logro.entity';
import { CreateLogroDto, SumarPuntosDto } from './dto/create-gamificacion.dto';

@Injectable()
export class GamificacionService {
  constructor(
    @InjectRepository(GamificacionCurso)
    private readonly gamificacionRepository: Repository<GamificacionCurso>,
    @InjectRepository(Logro)
    private readonly logroRepository: Repository<Logro>,
    @InjectRepository(UsuarioLogro)
    private readonly usuarioLogroRepository: Repository<UsuarioLogro>,
  ) {}

  // ===================== LOGROS (Admin/Profesor) =====================
  async createLogro(createLogroDto: CreateLogroDto) {
    const logro = this.logroRepository.create(createLogroDto);
    return await this.logroRepository.save(logro);
  }

  async findLogrosByCurso(curso_id: string) {
    return await this.logroRepository.find({ where: { curso_id } });
  }

  // ===================== ESTADÍSTICAS (Alumno) =====================
  async inicializarStats(inscripcion_id: string) {
    const stats = this.gamificacionRepository.create({ inscripcion_id });
    return await this.gamificacionRepository.save(stats);
  }

  async getMyStats(inscripcion_id: string) {
    let stats = await this.gamificacionRepository.findOne({
      where: { inscripcion_id },
    });
    if (!stats) {
      // Si no existen, los creamos por defecto
      stats = await this.inicializarStats(inscripcion_id);
    }

    // Buscar logros obtenidos
    const logrosObtenidos = await this.usuarioLogroRepository.find({
      where: { gamificacion_curso_id: stats.id },
      relations: ['logro'],
    });

    return {
      estadisticas: stats,
      logros: logrosObtenidos.map((ul) => ul.logro),
    };
  }

  async sumarPuntos(inscripcion_id: string, sumarPuntosDto: SumarPuntosDto) {
    let stats = await this.gamificacionRepository.findOne({
      where: { inscripcion_id },
    });
    if (!stats) {
      stats = await this.inicializarStats(inscripcion_id);
    }

    stats.puntos_acumulados += sumarPuntosDto.puntos;

    // Lógica básica de nivel (cada 100 puntos = 1 nivel)
    stats.nivel_xp = Math.floor(stats.puntos_acumulados / 100) + 1;

    return await this.gamificacionRepository.save(stats);
  }
}

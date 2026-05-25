import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCursoDto: CreateCursoDto, userId: string) {
    const curso = this.cursoRepository.create({
      ...createCursoDto,
      profesor_id: userId,
    });
    return await this.cursoRepository.save(curso);
  }

  async findAllPublicados() {
    return await this.cursoRepository.find({
      where: { estado: 'publicado' },
      relations: ['profesor'],
    });
  }

  async findAll() {
    return await this.cursoRepository.find({
      relations: ['profesor'],
    });
  }

  async findOne(id: string) {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['profesor'],
    });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto, user: User) {
    const curso = await this.findOne(id);
    this.verificarPermisoProfesor(curso, user);

    Object.assign(curso, updateCursoDto);
    return await this.cursoRepository.save(curso);
  }

  async cambiarEstado(id: string, estado: string, user: User) {
    const curso = await this.findOne(id);
    this.verificarPermisoProfesor(curso, user);

    curso.estado = estado;
    return await this.cursoRepository.save(curso);
  }

  async remove(id: string) {
    const curso = await this.findOne(id);
    return await this.cursoRepository.remove(curso);
  }

  async inscribirAlumno(curso_id: string, usuario_id: string) {
    const curso = await this.findOne(curso_id);

    if (curso.estado !== 'publicado') {
      throw new BadRequestException(
        'No puedes inscribirte a un curso que no está publicado',
      );
    }

    const existeInscripcion = await this.inscripcionRepository.findOne({
      where: { curso_id, usuario_id },
    });

    if (existeInscripcion) {
      throw new BadRequestException('Ya estás inscrito en este curso');
    }

    const inscripcion = this.inscripcionRepository.create({
      curso_id,
      usuario_id,
    });

    return await this.inscripcionRepository.save(inscripcion);
  }

  async obtenerEstadisticas(cursoId: string, user: User) {
    const curso = await this.findOne(cursoId);
    this.verificarPermisoProfesor(curso, user);

    const totalAlumnos = await this.inscripcionRepository.count({
      where: { curso_id: cursoId },
    });

    return {
      cursoId,
      titulo: curso.titulo,
      totalAlumnosInscritos: totalAlumnos,
    };
  }

  private verificarPermisoProfesor(curso: Curso, user: User) {
    if (user.rol !== 'admin' && curso.profesor_id !== user.id) {
      throw new UnauthorizedException(
        'No tienes permiso para modificar un curso que no creaste tú.',
      );
    }
  }
}

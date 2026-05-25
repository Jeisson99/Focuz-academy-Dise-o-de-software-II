import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nivel } from './entities/nivel.entity';
import { GuiaImplementacion } from './entities/guia-implementacion.entity';
import {
  CreateNivelDto,
  CreateGuiaImplementacionDto,
} from './dto/create-nivele.dto';

@Injectable()
export class NivelesService {
  constructor(
    @InjectRepository(Nivel)
    private readonly nivelRepository: Repository<Nivel>,
    @InjectRepository(GuiaImplementacion)
    private readonly guiaRepository: Repository<GuiaImplementacion>,
  ) {}

  async create(createNivelDto: CreateNivelDto) {
    const nivel = this.nivelRepository.create(createNivelDto);
    return await this.nivelRepository.save(nivel);
  }

  async findByCurso(curso_id: string) {
    return await this.nivelRepository.find({
      where: { curso_id },
      order: { orden: 'ASC' },
      relations: ['guia'], // Traemos la guía anexa si la tiene
    });
  }

  async findOne(id: string) {
    const nivel = await this.nivelRepository.findOne({
      where: { id },
      relations: ['guia'],
    });
    if (!nivel) throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    return nivel;
  }

  async addGuia(nivel_id: string, createGuiaDto: CreateGuiaImplementacionDto) {
    const nivel = await this.findOne(nivel_id);

    // Verificar si ya tiene guía (relación 1 a 1)
    if (nivel.guia) {
      throw new BadRequestException(
        'Este nivel ya tiene una guía de implementación',
      );
    }

    const guia = this.guiaRepository.create({
      ...createGuiaDto,
      nivel_id,
    });

    return await this.guiaRepository.save(guia);
  }
}

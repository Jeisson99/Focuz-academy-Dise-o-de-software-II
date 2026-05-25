import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Reto } from './entities/reto.entity';
import { IntentoReto } from './entities/intento-reto.entity';

@Injectable()
export class RetosService {
  constructor(
    @InjectRepository(Reto)
    private readonly retoRepository: Repository<Reto>,
    @InjectRepository(IntentoReto)
    private readonly intentoRetoRepository: Repository<IntentoReto>,
  ) {}

  async create(createRetoDto: DeepPartial<Reto>) {
    const reto = this.retoRepository.create(createRetoDto);
    return await this.retoRepository.save(reto);
  }

  async findAll() {
    return await this.retoRepository.find();
  }

  async findOne(id: string) {
    const reto = await this.retoRepository.findOne({ where: { id } });
    if (!reto) throw new NotFoundException('Reto no encontrado');
    return reto;
  }

  async update(id: string, updateRetoDto: DeepPartial<Reto>) {
    const reto = await this.findOne(id);
    Object.assign(reto, updateRetoDto);
    return await this.retoRepository.save(reto);
  }

  async remove(id: string) {
    const reto = await this.findOne(id);
    return await this.retoRepository.remove(reto);
  }

  async registrarIntento(intentoDto: DeepPartial<IntentoReto>) {
    const intento = this.intentoRetoRepository.create(intentoDto);
    return await this.intentoRetoRepository.save(intento);
  }
}

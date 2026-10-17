import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelesService } from './niveles.service';
import { NivelesController } from './niveles.controller';
import { Nivel } from './entities/nivel.entity';
import { GuiaImplementacion } from './entities/guia-implementacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nivel, GuiaImplementacion])],
  controllers: [NivelesController],
  providers: [NivelesService],
})
export class NivelesModule {}

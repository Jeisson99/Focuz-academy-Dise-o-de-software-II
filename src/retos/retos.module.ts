import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetosService } from './retos.service';
import { RetosController } from './retos.controller';
import { Reto } from './entities/reto.entity';
import { IntentoReto } from './entities/intento-reto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reto, IntentoReto])],
  controllers: [RetosController],
  providers: [RetosService],
})
export class RetosModule {}

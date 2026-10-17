import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';
import { ProgresoNivel } from './entities/progreso-nivel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgresoNivel])],
  controllers: [ProgresoController],
  providers: [ProgresoService],
})
export class ProgresoModule {}

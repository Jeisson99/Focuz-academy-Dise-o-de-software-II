import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionesUsoService } from './sesiones-uso.service';
import { SesionesUsoController } from './sesiones-uso.controller';
import { SesionUso } from './entities/sesion-uso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SesionUso])],
  controllers: [SesionesUsoController],
  providers: [SesionesUsoService],
})
export class SesionesUsoModule {}

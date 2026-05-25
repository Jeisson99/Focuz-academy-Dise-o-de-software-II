import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificacionService } from './gamificacion.service';
import { GamificacionController } from './gamificacion.controller';
import { GamificacionCurso } from './entities/gamificacion-curso.entity';
import { Logro } from './entities/logro.entity';
import { UsuarioLogro } from './entities/usuario-logro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamificacionCurso, Logro, UsuarioLogro])],
  controllers: [GamificacionController],
  providers: [GamificacionService],
})
export class GamificacionModule {}

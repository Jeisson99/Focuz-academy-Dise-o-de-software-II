import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { Curso } from './entities/curso.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Inscripcion]),
    CloudinaryModule, // Importamos Cloudinary para subir imágenes
  ],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService], // Por si otro módulo necesita los cursos
})
export class CursosModule {}

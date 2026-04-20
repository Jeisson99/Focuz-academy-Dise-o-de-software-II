import { Module } from '@nestjs/common';
import { CategoriaVideoService } from './categoria-video.service';
import { CategoriaVideoController } from './categoria-video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaVideo } from './entities/categoria-video.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaVideo]),
    CloudinaryModule, // Importar para usar CloudinaryService
  ],
  controllers: [CategoriaVideoController],
  providers: [CategoriaVideoService],
})
export class CategoriaVideoModule {}

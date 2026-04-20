import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoriaVideoDto } from './dto/create-categoria-video.dto';
import { UpdateCategoriaVideoDto } from './dto/update-categoria-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaVideo } from './entities/categoria-video.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoriaVideoService {
  constructor(
    @InjectRepository(CategoriaVideo)
    private readonly categoriaVideoRepository: Repository<CategoriaVideo>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoriaVideoDto: CreateCategoriaVideoDto, file?: Express.Multer.File) {
    let icono_url: string | null = null;
    let icono_public_id: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'categorias');
      icono_url = uploadResult.secure_url;
      icono_public_id = uploadResult.public_id;
    }

    const nuevaCategoria = this.categoriaVideoRepository.create({
      ...createCategoriaVideoDto,
      icono_url,
      icono_public_id,
    });

    return await this.categoriaVideoRepository.save(nuevaCategoria);
  }

  async findAll() {
    return await this.categoriaVideoRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaVideoRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoría de video con ID #${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaVideoDto: UpdateCategoriaVideoDto, file?: Express.Multer.File) {
    const categoria = await this.findOne(id);
    
    let icono_url = categoria.icono_url;
    let icono_public_id = categoria.icono_public_id;

    if (file) {
      // Si suben una nueva imagen, eliminamos la anterior (si existía)
      if (categoria.icono_public_id) {
        try {
          await this.cloudinaryService.deleteFile(categoria.icono_public_id);
        } catch (error) {
          console.warn('Error al eliminar imagen anterior de Cloudinary:', error.message);
        }
      }

      // Subir nueva imagen
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'categorias');
      icono_url = uploadResult.secure_url;
      icono_public_id = uploadResult.public_id;
    }

    // Actualizamos la entidad
    Object.assign(categoria, {
      ...updateCategoriaVideoDto,
      icono_url,
      icono_public_id,
    });

    return await this.categoriaVideoRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    // Intentar eliminar la imagen de Cloudinary si existe
    if (categoria.icono_public_id) {
      try {
        await this.cloudinaryService.deleteFile(categoria.icono_public_id);
      } catch (error) {
        console.warn('Error al eliminar imagen de Cloudinary:', error.message);
      }
    }

    return await this.categoriaVideoRepository.remove(categoria);
  }
}

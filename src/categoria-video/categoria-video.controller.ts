import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CategoriaVideoService } from './categoria-video.service';
import { CreateCategoriaVideoDto } from './dto/create-categoria-video.dto';
import { UpdateCategoriaVideoDto } from './dto/update-categoria-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Asumiendo que esta es la ruta

@Controller('categoria-video')
export class CategoriaVideoController {
  constructor(private readonly categoriaVideoService: CategoriaVideoService) { }

  //@UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('icono'))
  create(
    @Body() createCategoriaVideoDto: CreateCategoriaVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoriaVideoService.create(createCategoriaVideoDto, file);
  }

  @Get()
  findAll() {
    return this.categoriaVideoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaVideoService.findOne(+id);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('icono'))
  update(
    @Param('id') id: string,
    @Body() updateCategoriaVideoDto: UpdateCategoriaVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoriaVideoService.update(+id, updateCategoriaVideoDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaVideoService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RetosService } from './retos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateRetoDto } from './dto/create-reto.dto';
import { UpdateRetoDto } from './dto/update-reto.dto';
import { CreateIntentoRetoDto } from './dto/create-intento-reto.dto';

@Controller('retos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RetosController {
  constructor(private readonly retosService: RetosService) {}

  @Post()
  @Roles('admin', 'profesor')
  create(@Body() createRetoDto: CreateRetoDto) {
    return this.retosService.create(createRetoDto);
  }

  @Get()
  findAll() {
    return this.retosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retosService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'profesor')
  update(@Param('id') id: string, @Body() updateRetoDto: UpdateRetoDto) {
    return this.retosService.update(id, updateRetoDto);
  }

  @Delete(':id')
  @Roles('admin', 'profesor')
  remove(@Param('id') id: string) {
    return this.retosService.remove(id);
  }

  @Post('intento')
  @Roles('alumno')
  registrarIntento(@Body() intentoDto: CreateIntentoRetoDto) {
    return this.retosService.registrarIntento(intentoDto);
  }
}

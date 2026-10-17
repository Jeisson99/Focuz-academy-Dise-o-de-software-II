import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NivelesService } from './niveles.service';
import {
  CreateNivelDto,
  CreateGuiaImplementacionDto,
} from './dto/create-nivele.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('niveles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NivelesController {
  constructor(private readonly nivelesService: NivelesService) {}

  @Post()
  @Roles('admin', 'profesor')
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
  }

  @Post(':id/guia')
  @Roles('admin', 'profesor')
  addGuia(
    @Param('id') nivel_id: string,
    @Body() createGuiaDto: CreateGuiaImplementacionDto,
  ) {
    return this.nivelesService.addGuia(nivel_id, createGuiaDto);
  }

  @Get('curso/:curso_id')
  // Abierto a todos los autenticados (alumnos, profes, admins)
  findByCurso(@Param('curso_id') curso_id: string) {
    return this.nivelesService.findByCurso(curso_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }
}

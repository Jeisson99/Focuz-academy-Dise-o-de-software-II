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
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('cursos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Roles('admin', 'profesor')
  create(@Body() createCursoDto: CreateCursoDto, @GetUser() user: User) {
    return this.cursosService.create(createCursoDto, user.id);
  }

  @Get('publicados')
  findAllPublicados() {
    return this.cursosService.findAllPublicados();
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  @Post(':id/inscribir')
  @Roles('alumno')
  inscribir(@Param('id') id: string, @GetUser() user: User) {
    return this.cursosService.inscribirAlumno(id, user.id);
  }

  @Get(':id/estadisticas')
  @Roles('admin', 'profesor')
  obtenerEstadisticas(@Param('id') id: string, @GetUser() user: User) {
    return this.cursosService.obtenerEstadisticas(id, user);
  }

  @Patch(':id')
  @Roles('admin', 'profesor')
  update(
    @Param('id') id: string,
    @Body() updateCursoDto: UpdateCursoDto,
    @GetUser() user: User,
  ) {
    return this.cursosService.update(id, updateCursoDto, user);
  }

  @Patch(':id/estado')
  @Roles('admin', 'profesor')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @GetUser() user: User,
  ) {
    return this.cursosService.cambiarEstado(id, estado, user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}

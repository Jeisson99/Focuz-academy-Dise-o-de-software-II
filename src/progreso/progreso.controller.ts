import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { StartProgresoDto, UpdateProgresoDto } from './dto/create-progreso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('progreso')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Post('iniciar')
  @Roles('alumno')
  iniciarNivel(@Body() startDto: StartProgresoDto) {
    return this.progresoService.iniciarNivel(startDto);
  }

  @Patch(':id/actualizar')
  @Roles('alumno')
  actualizarTiempo(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgresoDto,
  ) {
    return this.progresoService.actualizarTiempo(id, updateDto);
  }

  @Patch(':id/completar')
  @Roles('alumno')
  completarNivel(@Param('id') id: string) {
    return this.progresoService.completarNivel(id);
  }

  @Get('inscripcion/:inscripcion_id')
  getProgreso(@Param('inscripcion_id') inscripcion_id: string) {
    // Alumno o Profesor pueden ver esto
    return this.progresoService.getProgresoDeInscripcion(inscripcion_id);
  }
}

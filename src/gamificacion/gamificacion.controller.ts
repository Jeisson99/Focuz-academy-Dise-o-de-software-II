import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GamificacionService } from './gamificacion.service';
import { CreateLogroDto, SumarPuntosDto } from './dto/create-gamificacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('gamificacion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamificacionController {
  constructor(private readonly gamificacionService: GamificacionService) {}

  // ================= LOGROS (Profesores y Admins) =================
  @Post('logros')
  @Roles('admin', 'profesor')
  createLogro(@Body() createLogroDto: CreateLogroDto) {
    return this.gamificacionService.createLogro(createLogroDto);
  }

  @Get('logros/curso/:curso_id')
  getLogrosDeCurso(@Param('curso_id') curso_id: string) {
    return this.gamificacionService.findLogrosByCurso(curso_id);
  }

  // ================= ESTADÍSTICAS (Alumnos) =================
  @Get('mis-stats/:inscripcion_id')
  @Roles('alumno')
  getMyStats(@Param('inscripcion_id') inscripcion_id: string) {
    return this.gamificacionService.getMyStats(inscripcion_id);
  }

  @Patch('sumar-puntos/:inscripcion_id')
  @Roles('admin', 'profesor') // Solo el sistema o un profe puede inyectar puntos manualmente
  sumarPuntos(
    @Param('inscripcion_id') inscripcion_id: string,
    @Body() sumarPuntosDto: SumarPuntosDto,
  ) {
    return this.gamificacionService.sumarPuntos(inscripcion_id, sumarPuntosDto);
  }
}

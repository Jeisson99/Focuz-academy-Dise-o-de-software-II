import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SesionesUsoService } from './sesiones-uso.service';
import { StartSesionDto } from './dto/create-sesiones-uso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sesiones-uso')
@UseGuards(JwtAuthGuard)
export class SesionesUsoController {
  constructor(private readonly sesionesUsoService: SesionesUsoService) {}

  @Post('entrada')
  iniciarSesion(@Body() startSesionDto: StartSesionDto) {
    return this.sesionesUsoService.iniciarSesion(startSesionDto);
  }

  @Patch('salida/:id')
  cerrarSesion(@Param('id') id: string) {
    return this.sesionesUsoService.cerrarSesion(id);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelDto } from './create-nivele.dto';

export class UpdateNiveleDto extends PartialType(CreateNivelDto) {}

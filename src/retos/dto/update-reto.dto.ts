import { PartialType } from '@nestjs/mapped-types';
import { CreateRetoDto } from './create-reto.dto';

export class UpdateRetoDto extends PartialType(CreateRetoDto) {}

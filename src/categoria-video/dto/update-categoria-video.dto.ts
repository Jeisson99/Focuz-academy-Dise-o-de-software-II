import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaVideoDto } from './create-categoria-video.dto';

export class UpdateCategoriaVideoDto extends PartialType(CreateCategoriaVideoDto) {}

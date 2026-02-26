import { PartialType } from '@nestjs/mapped-types';
import { CreateModeloPrecioTemporadaDto } from './create-modelo-precio-temporada.dto';

export class UpdateModeloPrecioTemporadaDto extends PartialType(
  CreateModeloPrecioTemporadaDto,
) {}

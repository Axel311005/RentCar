import { PartialType } from '@nestjs/mapped-types';
import { CreateTemporadaPrecioDto } from './create-temporada-precio.dto';

export class UpdateTemporadaPrecioDto extends PartialType(
  CreateTemporadaPrecioDto,
) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculoImagenDto } from './create-vehiculo-imagen.dto';

export class UpdateVehiculoImagenDto extends PartialType(
  CreateVehiculoImagenDto,
) {}

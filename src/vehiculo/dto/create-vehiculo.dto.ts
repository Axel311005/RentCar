import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { VehiculoEstado } from '../enums/vehiculo-estado.enum';

export class CreateVehiculoDto {
  @ApiProperty({ description: 'Placa única del vehículo', example: 'ABC-123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  placa: string;

  @ApiPropertyOptional({ description: 'Color del vehículo', example: 'Rojo' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  color?: string;

  @ApiProperty({
    description: 'Estado del vehículo',
    enum: VehiculoEstado,
    example: VehiculoEstado.DISPONIBLE,
  })
  @IsEnum(VehiculoEstado)
  estado: VehiculoEstado;

  @ApiPropertyOptional({
    description: 'Kilometraje actual del vehículo',
    example: 12345.67,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  kilometraje?: number;

  @ApiProperty({
    description: 'UUID del modelo asociado',
    example: 'd4c2ff1f-73f2-4a4f-8bfb-7ca8ef1fc95d',
    format: 'uuid',
  })
  @IsUUID('4')
  modeloId: string;
}

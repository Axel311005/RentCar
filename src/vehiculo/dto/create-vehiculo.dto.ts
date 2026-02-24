import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { VehiculoEstado } from '../enums/vehiculo-estado.enum';

export class CreateVehiculoDto {
  @ApiProperty({ description: 'Marca del vehículo', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  marca: string;

  @ApiProperty({ description: 'Modelo del vehículo', example: 'RAV4' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  modelo: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2024,
    minimum: 1900,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  anio: number;

  @ApiProperty({ description: 'Placa única del vehículo', example: 'ABC-123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  placa: string;

  @ApiProperty({
    description: 'Precio de alquiler por día',
    example: 149.9,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPorDia: number;

  @ApiPropertyOptional({
    description: 'Estado del vehículo',
    enum: VehiculoEstado,
    example: VehiculoEstado.DISPONIBLE,
  })
  @IsOptional()
  @IsEnum(VehiculoEstado)
  estado?: VehiculoEstado;

  @ApiPropertyOptional({
    description: 'Indicador de disponibilidad lógica',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({
    description: 'UUID de la categoría asociada',
    example: 'd4c2ff1f-73f2-4a4f-8bfb-7ca8ef1fc95d',
    format: 'uuid',
  })
  @IsUUID('4')
  categoriaId: string;
}

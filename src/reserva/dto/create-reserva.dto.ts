import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ReservaEstado } from '../enums/reserva-estado.enum';

export class CreateReservaDto {
  @ApiProperty({
    description: 'Fecha de inicio de la reserva',
    example: '2026-03-10',
    type: String,
    format: 'date',
  })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de la reserva',
    example: '2026-03-15',
    type: String,
    format: 'date',
  })
  @IsDateString()
  fechaFin: string;

  @ApiProperty({
    description: 'Cantidad total de días',
    example: 5,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadDias: number;

  @ApiProperty({ description: 'Precio total de la reserva', example: 749.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioTotal: number;

  @ApiPropertyOptional({
    description: 'Estado de la reserva',
    enum: ReservaEstado,
    example: ReservaEstado.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(ReservaEstado)
  estado?: ReservaEstado;

  @ApiProperty({
    description: 'UUID del cliente asociado',
    example: '3057d2fa-df6d-46d6-a774-6f0110f3fb66',
    format: 'uuid',
  })
  @IsUUID('4')
  clienteId: string;

  @ApiProperty({
    description: 'UUID del vehículo asociado',
    example: '15f4e164-071f-4ea6-8ac2-ec89e4ec32b7',
    format: 'uuid',
  })
  @IsUUID('4')
  vehiculoId: string;
}

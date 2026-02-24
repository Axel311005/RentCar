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
  Min,
} from 'class-validator';
import { MetodoPago } from '../enums/metodo-pago.enum';
import { PagoEstado } from '../enums/pago-estado.enum';

export class CreatePagoDto {
  @ApiProperty({ description: 'Monto del pago', example: 500, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto: number;

  @ApiProperty({
    description: 'Método de pago aplicado',
    enum: MetodoPago,
    example: MetodoPago.TARJETA,
  })
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @ApiPropertyOptional({
    description: 'Estado del pago',
    enum: PagoEstado,
    example: PagoEstado.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(PagoEstado)
  estado?: PagoEstado;

  @ApiPropertyOptional({
    description: 'Referencia externa del pago',
    example: 'TXN-2026-000145',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  referencia?: string;

  @ApiProperty({
    description: 'UUID de la reserva asociada',
    example: 'f55e9947-9966-4ad8-9f2d-d90f2a6d31cd',
    format: 'uuid',
  })
  @IsUUID('4')
  reservaId: string;
}

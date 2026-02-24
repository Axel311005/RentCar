import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateVehiculoImagenDto {
  @ApiProperty({
    description: 'UUID del vehículo al que pertenece la imagen',
    example: '15f4e164-071f-4ea6-8ac2-ec89e4ec32b7',
    format: 'uuid',
  })
  @IsUUID('4')
  vehiculoId: string;

  @ApiProperty({
    description: 'URL de la imagen',
    example: 'https://cdn.rentcar.com/vehiculos/rav4-front.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Texto alternativo para accesibilidad',
    example: 'Toyota RAV4 vista frontal',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  altText?: string;

  @ApiPropertyOptional({
    description: 'Indica si la imagen será principal',
    example: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  esPrincipal?: boolean;
}

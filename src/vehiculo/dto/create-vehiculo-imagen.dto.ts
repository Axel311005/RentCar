import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateVehiculoImagenDto {
  @ApiProperty({
    description: 'URL de la imagen del vehículo',
    example: 'https://cdn.rentcar.com/vehiculos/rav4-front.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Texto alternativo de la imagen',
    example: 'Toyota RAV4 vista frontal',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  altText?: string;

  @ApiPropertyOptional({
    description: 'Indica si es la imagen principal del vehículo',
    example: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  esPrincipal?: boolean;
}

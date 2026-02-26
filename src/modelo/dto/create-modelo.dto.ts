import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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
import { EstadoGeneral } from 'src/enum/estado-general.enum';

export class CreateModeloDto {
  @ApiProperty({ description: 'Marca del modelo', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  marca: string;

  @ApiProperty({ description: 'Nombre del modelo', example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @ApiProperty({ description: 'Año del modelo', example: 2025, minimum: 1900 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  anio: number;

  @ApiPropertyOptional({
    description: 'Tipo de combustible',
    example: 'gasolina',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tipoCombustible?: string;

  @ApiPropertyOptional({ description: 'Capacidad de pasajeros', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacidadPasajeros?: number;

  @ApiPropertyOptional({
    description: 'Estado del modelo',
    enum: EstadoGeneral,
    example: EstadoGeneral.ACTIVO,
    default: EstadoGeneral.ACTIVO,
  })
  @IsOptional()
  @IsEnum(EstadoGeneral)
  estado?: EstadoGeneral;

  @ApiProperty({
    description: 'Precio base diario',
    example: 75.5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioBaseDiario: number;

  @ApiProperty({
    description: 'UUID de la categoría asociada al modelo',
    example: 'd4c2ff1f-73f2-4a4f-8bfb-7ca8ef1fc95d',
    format: 'uuid',
  })
  @IsUUID('4')
  categoriaId: string;
}

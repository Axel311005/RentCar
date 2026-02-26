import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTemporadaPrecioDto {
  @ApiProperty({
    description: 'Descripción de la temporada',
    example: 'Temporada alta de verano',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  descripcion: string;

  @ApiProperty({
    description: 'Fecha de inicio de temporada',
    example: '2026-12-01',
    type: String,
    format: 'date',
  })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de temporada',
    example: '2027-02-28',
    type: String,
    format: 'date',
  })
  @IsDateString()
  fechaFin: string;
}

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateModeloPrecioTemporadaDto {
  @ApiProperty({
    description: 'UUID del modelo',
    example: '15f4e164-071f-4ea6-8ac2-ec89e4ec32b7',
    format: 'uuid',
  })
  @IsUUID('4')
  modeloId: string;

  @ApiProperty({
    description: 'UUID de la temporada de precio',
    example: '3057d2fa-df6d-46d6-a774-6f0110f3fb66',
    format: 'uuid',
  })
  @IsUUID('4')
  temporadaId: string;

  @ApiProperty({
    description: 'Precio diario para la temporada',
    example: 92.5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioDiario: number;
}

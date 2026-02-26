import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsUUID } from 'class-validator';

export class CreateVehiculoImagenDto {
  @ApiProperty({
    description: 'UUID del modelo al que pertenece la imagen',
    example: '15f4e164-071f-4ea6-8ac2-ec89e4ec32b7',
    format: 'uuid',
  })
  @IsUUID('4')
  modeloId: string;

  @ApiProperty({
    description: 'URL de la imagen',
    example: 'https://cdn.rentcar.com/vehiculos/rav4-front.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

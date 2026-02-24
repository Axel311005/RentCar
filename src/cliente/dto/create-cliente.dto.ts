import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nombres del cliente',
    example: 'Juan Carlos',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del cliente',
    example: 'Pérez Gómez',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico único del cliente',
    example: 'juan.perez@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+51987654321',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  @ApiProperty({
    description: 'UUID del usuario asociado al cliente',
    example: '8b0f44cc-c31f-4f60-aa58-e2f30e2d6f99',
    format: 'uuid',
  })
  @IsUUID('4')
  userId: string;
}

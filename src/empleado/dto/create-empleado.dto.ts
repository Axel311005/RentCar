import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { EstadoGeneral } from 'src/enum/estado-general.enum';

export class CreateEmpleadoDto {
  @ApiProperty({ description: 'Nombres del empleado', example: 'Ana María' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombres: string;

  @ApiProperty({ description: 'Apellidos del empleado', example: 'López Díaz' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico único del empleado',
    example: 'ana.lopez@rentcar.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Teléfono del empleado',
    example: '+51987654321',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @ApiProperty({ description: 'Cargo del empleado', example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  cargo: string;

  @ApiPropertyOptional({
    description: 'Estado del empleado',
    enum: EstadoGeneral,
    example: EstadoGeneral.ACTIVO,
    default: EstadoGeneral.ACTIVO,
  })
  @IsOptional()
  @IsEnum(EstadoGeneral)
  estado?: EstadoGeneral;

  @ApiProperty({
    description: 'UUID del usuario asociado al empleado',
    example: '8b0f44cc-c31f-4f60-aa58-e2f30e2d6f99',
    format: 'uuid',
  })
  @IsUUID('4')
  userId: string;
}

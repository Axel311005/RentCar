import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NoSqlInjection } from 'src/common/validators/no-sql-injection.decorator';
import { NoExcessiveRepetition } from 'src/common/validators/no-excessive-repetition.decorator';
import { NoRandomString } from 'src/common/validators/no-random-string.decorator';
import { AllowedCharacters } from 'src/common/validators/allowed-characters.decorator';

class CreateUserClienteDto {
  @ApiProperty({ description: 'Nombres del cliente', example: 'Juan Carlos' })
  @IsString()
  @MinLength(1)
  @MaxLength(120, { message: 'Los nombres no pueden exceder 120 caracteres' })
  @AllowedCharacters()
  @NoSqlInjection()
  @NoExcessiveRepetition(4)
  @NoRandomString()
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del cliente',
    example: 'Pérez',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120, { message: 'Los apellidos no pueden exceder 120 caracteres' })
  @AllowedCharacters()
  @NoSqlInjection()
  @NoExcessiveRepetition(4)
  @NoRandomString()
  apellidos: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+59598123456',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30, { message: 'El teléfono no puede exceder 30 caracteres' })
  @NoSqlInjection()
  telefono: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'email', example: 'juanito32@gmail.com' })
  @IsString()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-Z0-9._%+-]{6,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'El correo debe tener al menos 6 caracteres antes del @',
  })
  @NoSqlInjection()
  // No aplicamos NoRandomString ni NoExcessiveRepetition porque el email ya tiene validación estricta
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({ description: 'contraseña', example: 'Juanito1234' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  // @ApiProperty()
  // @IsString()
  // @MinLength(1)
  // @ApiProperty({description: 'fullname', example : 'Juanito Perez'})
  // fullName: string;

  @ApiProperty({
    description: 'ID del cliente (UUID)',
    example: '11af3d88-cf96-4db1-b66d-7c8f31c9f255',
  })
  @IsUUID('4')
  @IsOptional()
  clienteId?: string;

  @ApiProperty({
    description: 'ID del empleado (UUID)',
    example: '8c66e2d6-9331-44cd-9d9d-adb6358d49df',
  })
  @IsUUID('4')
  @IsOptional()
  empleadoId?: string;

  @ApiPropertyOptional({
    description: 'Datos para crear un nuevo cliente asociado al usuario',
    type: () => CreateUserClienteDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserClienteDto)
  clienteData?: CreateUserClienteDto;
}

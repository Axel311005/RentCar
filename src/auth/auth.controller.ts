import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserRolesDto } from './dto';
import { CreateEmployeeUserDto } from './dto/create-employee-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-header.decorator';
import { IncomingHttpHeaders } from 'http';
import { ValidRoles } from './interfaces';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { ttl: 3600000, limit: 3 } }) // Solo 3 registros por hora por IP
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('register/employee')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Registrar un usuario interno para un empleado' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  createEmployeeUser(@Body() dto: CreateEmployeeUserDto) {
    return this.authService.createEmployeeUser(dto);
  }

  @Post('login')
  @Throttle({ short: { ttl: 60000, limit: 5 } }) // Solo 5 intentos de login por minuto por IP
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }
  @Patch('users/:id/roles')
  @Auth(ValidRoles.admin)
  @ApiTags('Users')
  @ApiOperation({ summary: 'Actualizar roles de un usuario' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario (UUID)',
    example: 'a3f0f1c2-1234-4b5a-9c0d-ef1234567890',
  })
  @ApiResponse({ status: 200, description: 'Roles actualizados correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida o usuario no existe',
  })
  updateUserRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    return this.authService.updateUserRoles(id, dto);
  }
}

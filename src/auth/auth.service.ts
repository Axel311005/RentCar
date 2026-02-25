import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto';
import { EncryptionService } from './services/encryption.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { CreateEmployeeUserDto } from './dto/create-employee-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly maxFailedLoginAttempts: number;
  private readonly loginBlockWindowMinutes: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,

    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.maxFailedLoginAttempts = this.resolveEnvInt(
      'AUTH_MAX_LOGIN_ATTEMPTS',
      3,
      1,
    );
    this.loginBlockWindowMinutes = this.resolveEnvInt(
      'AUTH_LOGIN_BLOCK_MINUTES',
      15,
      1,
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, clienteId, empleadoId, clienteData, ...userData } =
        createUserDto;

      if (clienteId && empleadoId) {
        throw new BadRequestException(
          'Un usuario no puede estar vinculado a cliente y empleado a la vez',
        );
      }

      if (clienteId && clienteData) {
        throw new BadRequestException(
          'Proporcione el id del cliente existente o los datos para crear uno nuevo, pero no ambos.',
        );
      }

      let cliente: Cliente | undefined = undefined;
      let empleado: Empleado | undefined = undefined;

      if (clienteId) {
        const clienteEntity = await this.clienteRepository.findOne({
          where: { id: clienteId },
        });
        if (!clienteEntity) {
          throw new BadRequestException(
            `Cliente con id ${clienteId} no existe`,
          );
        }
        cliente = clienteEntity;
      }

      if (empleadoId) {
        const empleadoEntity = await this.empleadoRepository.findOne({
          where: { id: empleadoId },
        });
        if (!empleadoEntity) {
          throw new BadRequestException(
            `Empleado con id ${empleadoId} no existe`,
          );
        }
        empleado = empleadoEntity;
      }

      if (!clienteId && clienteData) {
        const nuevoCliente = this.clienteRepository.create();
        nuevoCliente.nombres = clienteData.nombres;
        nuevoCliente.apellidos = clienteData.apellidos;
        nuevoCliente.telefono = clienteData.telefono;
        nuevoCliente.email = userData.email;

        cliente = await this.clienteRepository.save(nuevoCliente);
      }

      const user = this.userRepository.create({
        ...userData,
        password: this.encryptionService.encrypt(password),
        cliente,
        empleado,
      });

      if (empleado) {
        user.roles = ['admin'];
      } else if (cliente) {
        user.roles = ['cliente'];
      }

      await this.userRepository.save(user);

      delete (user as any).password;

      return {
        ...user,

        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const startTime = Date.now();
    const MIN_RESPONSE_TIME_MS = 200; // Tiempo mínimo de respuesta para evitar timing attacks

    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          roles: true,
          loginAttempts: true,
          blockedUntil: true,
          isActive: true,
        },
        relations: ['cliente', 'empleado'],
      });

      // Usar un hash dummy si el usuario no existe para mantener tiempos consistentes
      const dummyHash =
        '$2a$10$dummyhashfordummycomparison1234567890123456789012';

      // Siempre ejecutar la comparación de contraseña para evitar timing attacks
      let passwordMatches = false;

      if (user) {
        // Detectar si la contraseña está en formato bcrypt (legacy) o AES-256
        const isBcryptHash =
          user.password.startsWith('$2a$') ||
          user.password.startsWith('$2b$') ||
          user.password.startsWith('$2y$');

        if (isBcryptHash) {
          passwordMatches = bcrypt.compareSync(password, user.password);

          // Si la contraseña coincide, migrar automáticamente a AES-256
          if (passwordMatches) {
            try {
              await this.userRepository.update(user.id, {
                password: this.encryptionService.encrypt(password),
              });
            } catch (migrationError) {
              console.error(
                'Error al migrar contraseña a AES-256:',
                migrationError,
              );
            }
          }
        } else {
          passwordMatches = this.encryptionService.compare(
            password,
            user.password,
          );
        }
      } else {
        // Usuario no existe - comparar con hash dummy para mantener tiempo consistente
        // Esto asegura que el tiempo de respuesta sea similar independientemente de si el usuario existe
        bcrypt.compareSync(password, dummyHash);
      }

      // Manejar intentos fallidos solo si el usuario existe
      if (user && !passwordMatches) {
        const now = new Date();
        const currentAttempts = user.loginAttempts ?? 0;
        const nextAttempts = currentAttempts + 1;

        if (nextAttempts >= this.maxFailedLoginAttempts) {
          const blockDurationMs = this.loginBlockWindowMinutes * 60 * 1000;
          const blockUntil = new Date(now.getTime() + blockDurationMs);

          await this.userRepository.update(user.id, {
            loginAttempts: 0,
            blockedUntil: blockUntil,
          });
        } else {
          await this.userRepository.update(user.id, {
            loginAttempts: nextAttempts,
          });
        }
      }

      // Si no hay usuario o la contraseña no coincide, usar mensaje genérico
      if (!user || !passwordMatches) {
        // Asegurar tiempo mínimo de respuesta para evitar timing attacks
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_RESPONSE_TIME_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed),
          );
        }
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Si llegamos aquí, el usuario existe y la contraseña es correcta
      if (!user.isActive) {
        // Asegurar tiempo mínimo de respuesta
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_RESPONSE_TIME_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed),
          );
        }
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const now = new Date();
      const lockedUntil = user.blockedUntil
        ? new Date(user.blockedUntil)
        : null;

      if (lockedUntil && lockedUntil.getTime() > now.getTime()) {
        // Asegurar tiempo mínimo de respuesta
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_RESPONSE_TIME_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed),
          );
        }
        // Mensaje genérico que no revele información específica
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Si llegamos aquí, el usuario existe, la contraseña es correcta, está activo y no está bloqueado
      // Limpiar intentos fallidos si existen
      const currentAttempts = user.loginAttempts ?? 0;
      if (currentAttempts !== 0 || user.blockedUntil) {
        await this.userRepository.update(user.id, {
          loginAttempts: 0,
          blockedUntil: null,
        });
      }

      const empleadoInfo = user.empleado
        ? {
            id: user.empleado.id,
            nombreCompleto: [user.empleado.nombres, user.empleado.apellidos]
              .filter(
                (value) => typeof value === 'string' && value.trim().length > 0,
              )
              .join(' ')
              .trim(),
          }
        : null;

      const clienteInfo = user.cliente
        ? {
            id: user.cliente.id,
            nombreCompleto: [user.cliente.nombres, user.cliente.apellidos]
              .filter(
                (value) => typeof value === 'string' && value.trim().length > 0,
              )
              .join(' ')
              .trim(),
          }
        : null;

      return {
        id: user.id,
        email: user.email,
        roles: user.roles,
        empleado: empleadoInfo,
        cliente: clienteInfo,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.handleDbErrors(error);
    }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async createEmployeeUser(dto: CreateEmployeeUserDto) {
    const payload: CreateUserDto = {
      email: dto.email,
      password: dto.password,
      empleadoId: dto.empleadoId,
    };

    return this.create(payload);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private resolveEnvInt(envVar: string, fallback: number, min: number): number {
    const rawValue = process.env[envVar];
    if (rawValue !== undefined) {
      const parsed = Number.parseInt(rawValue, 10);
      if (Number.isFinite(parsed) && parsed >= min) {
        return parsed;
      }
    }
    return fallback;
  }

  private handleDbErrors(error: any): never {
    // Log del error
    this.logger.error('Database error in AuthService:', {
      code: error.code,
      detail: error.detail,
      message: error.message,
    });

    // Error de duplicado (email ya existe)
    // SIEMPRE usar mensaje genérico para evitar enumeración
    if (error.code === '23505') {
      throw new BadRequestException(
        'No se pudo completar la operación. Por favor, verifique los datos e intente nuevamente.',
      );
    }

    // Error de foreign key
    if (error.code === '23503') {
      throw new BadRequestException(
        'No se puede realizar esta operación porque hay registros relacionados.',
      );
    }

    // Error de campo requerido
    if (error.code === '23502') {
      throw new BadRequestException(
        'Faltan campos requeridos. Por favor, complete todos los campos obligatorios.',
      );
    }

    // Error desconocido - mensaje amigable pero genérico
    throw new InternalServerErrorException(
      'Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente más tarde.',
    );
  }

  async updateUserRoles(userId: string, { roles }: UpdateUserRolesDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new BadRequestException(`Usuario con id ${userId} no existe`);

    // Ensure unique roles and preserve only valid ones
    user.roles = Array.from(new Set(roles));

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
    };
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';
import { User } from '../user/entities/user.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async getUserOrFail(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User con id ${userId} no encontrado`);
    }
    return user;
  }

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const { userId, ...empleadoData } = createEmpleadoDto;
    const user = await this.getUserOrFail(userId);

    const empleadoExistente = await this.empleadoRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (empleadoExistente) {
      throw new ConflictException(
        `El user ${userId} ya está asociado a un empleado`,
      );
    }

    const empleado = this.empleadoRepository.create({
      ...empleadoData,
      activo: empleadoData.activo ?? true,
      user,
    });
    return this.empleadoRepository.save(empleado);
  }

  findAll() {
    return this.empleadoRepository.find({ relations: { user: true } });
  }

  async findOne(id: string) {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id} no encontrado`);
    }
    return empleado;
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    const { userId, ...empleadoData } = updateEmpleadoDto;
    const empleado = await this.findOne(id);

    if (userId && userId !== empleado.user.id) {
      const user = await this.getUserOrFail(userId);
      const empleadoConEseUser = await this.empleadoRepository.findOne({
        where: { user: { id: userId } },
        relations: { user: true },
      });

      if (empleadoConEseUser && empleadoConEseUser.id !== id) {
        throw new ConflictException(
          `El user ${userId} ya está asociado a otro empleado`,
        );
      }

      empleado.user = user;
    }

    Object.assign(empleado, empleadoData);
    return this.empleadoRepository.save(empleado);
  }

  async remove(id: string) {
    const empleado = await this.findOne(id);
    await this.empleadoRepository.remove(empleado);
    return { message: 'Empleado eliminado correctamente' };
  }
}

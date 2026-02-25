import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const { userId, ...clienteData } = createClienteDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User con id ${userId} no encontrado`);
    }

    const cliente = this.clienteRepository.create({
      ...clienteData,
      user,
    });
    return this.clienteRepository.save(cliente);
  }

  findAll() {
    return this.clienteRepository.find({
      relations: { user: true, reservas: true },
    });
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { user: true, reservas: true },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { userId, ...clienteData } = updateClienteDto;
    const cliente = await this.findOne(id);

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User con id ${userId} no encontrado`);
      }
      cliente.user = user;
    }

    Object.assign(cliente, clienteData);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
    return { message: 'Cliente eliminado correctamente' };
  }
}

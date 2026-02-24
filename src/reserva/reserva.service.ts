import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const { clienteId, vehiculoId, ...reservaData } = createReservaDto;

    const cliente = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${clienteId} no encontrado`);
    }

    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id: vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(
        `Vehiculo con id ${vehiculoId} no encontrado`,
      );
    }

    const reserva = this.reservaRepository.create({
      ...reservaData,
      cliente,
      vehiculo,
    });
    return this.reservaRepository.save(reserva);
  }

  findAll() {
    return this.reservaRepository.find({
      relations: { cliente: true, vehiculo: true, pagos: true },
    });
  }

  async findOne(id: string) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: { cliente: true, vehiculo: true, pagos: true },
    });
    if (!reserva) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada`);
    }
    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto) {
    const { clienteId, vehiculoId, ...reservaData } = updateReservaDto;
    const reserva = await this.findOne(id);

    if (clienteId) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: clienteId },
      });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente con id ${clienteId} no encontrado`,
        );
      }
      reserva.cliente = cliente;
    }

    if (vehiculoId) {
      const vehiculo = await this.vehiculoRepository.findOne({
        where: { id: vehiculoId },
      });
      if (!vehiculo) {
        throw new NotFoundException(
          `Vehiculo con id ${vehiculoId} no encontrado`,
        );
      }
      reserva.vehiculo = vehiculo;
    }

    Object.assign(reserva, reservaData);
    return this.reservaRepository.save(reserva);
  }

  async remove(id: string) {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
    return { message: 'Reserva eliminada correctamente' };
  }
}

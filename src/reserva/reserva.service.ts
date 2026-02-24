import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { ReservaEstado } from './enums/reserva-estado.enum';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly estadosBloqueantes = [
    ReservaEstado.PENDIENTE,
    ReservaEstado.CONFIRMADA,
  ];

  private validateDateRange(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      throw new BadRequestException('Las fechas de la reserva son inválidas');
    }

    if (inicio > fin) {
      throw new BadRequestException(
        'fechaInicio no puede ser mayor que fechaFin',
      );
    }
  }

  private async validarSolapamiento(
    vehiculoId: string,
    fechaInicio: string,
    fechaFin: string,
    excludeReservaId?: string,
    repository?: Repository<Reserva>,
  ) {
    const repo = repository ?? this.reservaRepository;
    const qb = repo
      .createQueryBuilder('r')
      .where('r.vehiculo_id = :vehiculoId', { vehiculoId })
      .andWhere('r.estado IN (:...estados)', {
        estados: this.estadosBloqueantes,
      })
      .andWhere(':fechaInicio <= r.fecha_fin AND :fechaFin >= r.fecha_inicio', {
        fechaInicio,
        fechaFin,
      });

    if (excludeReservaId) {
      qb.andWhere('r.id != :excludeReservaId', { excludeReservaId });
    }

    const hayConflicto = await qb.getExists();
    if (hayConflicto) {
      throw new ConflictException(
        'El vehículo ya está reservado para ese rango de fechas',
      );
    }
  }

  async create(createReservaDto: CreateReservaDto) {
    this.validateDateRange(
      createReservaDto.fechaInicio,
      createReservaDto.fechaFin,
    );

    const { clienteId, vehiculoId, ...reservaData } = createReservaDto;

    return this.dataSource.transaction(async (manager) => {
      const cliente = await manager
        .getRepository(Cliente)
        .findOne({ where: { id: clienteId } });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente con id ${clienteId} no encontrado`,
        );
      }

      const vehiculo = await manager
        .getRepository(Vehiculo)
        .createQueryBuilder('vehiculo')
        .setLock('pessimistic_write')
        .where('vehiculo.id = :vehiculoId', { vehiculoId })
        .getOne();

      if (!vehiculo) {
        throw new NotFoundException(
          `Vehiculo con id ${vehiculoId} no encontrado`,
        );
      }

      await this.validarSolapamiento(
        vehiculoId,
        createReservaDto.fechaInicio,
        createReservaDto.fechaFin,
        undefined,
        manager.getRepository(Reserva),
      );

      const reserva = manager.getRepository(Reserva).create({
        ...reservaData,
        cliente,
        vehiculo,
      });

      return manager.getRepository(Reserva).save(reserva);
    });
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
    return this.dataSource.transaction(async (manager) => {
      const reserva = await manager.getRepository(Reserva).findOne({
        where: { id },
        relations: { cliente: true, vehiculo: true, pagos: true },
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva con id ${id} no encontrada`);
      }

      const { clienteId, vehiculoId, ...reservaData } = updateReservaDto;

      if (clienteId) {
        const cliente = await manager
          .getRepository(Cliente)
          .findOne({ where: { id: clienteId } });
        if (!cliente) {
          throw new NotFoundException(
            `Cliente con id ${clienteId} no encontrado`,
          );
        }
        reserva.cliente = cliente;
      }

      if (vehiculoId) {
        const vehiculo = await manager
          .getRepository(Vehiculo)
          .createQueryBuilder('vehiculo')
          .setLock('pessimistic_write')
          .where('vehiculo.id = :vehiculoId', { vehiculoId })
          .getOne();

        if (!vehiculo) {
          throw new NotFoundException(
            `Vehiculo con id ${vehiculoId} no encontrado`,
          );
        }
        reserva.vehiculo = vehiculo;
      } else {
        await manager
          .getRepository(Vehiculo)
          .createQueryBuilder('vehiculo')
          .setLock('pessimistic_write')
          .where('vehiculo.id = :vehiculoId', {
            vehiculoId: reserva.vehiculo.id,
          })
          .getOne();
      }

      Object.assign(reserva, reservaData);

      this.validateDateRange(reserva.fechaInicio, reserva.fechaFin);

      if (this.estadosBloqueantes.includes(reserva.estado)) {
        await this.validarSolapamiento(
          reserva.vehiculo.id,
          reserva.fechaInicio,
          reserva.fechaFin,
          reserva.id,
          manager.getRepository(Reserva),
        );
      }

      return manager.getRepository(Reserva).save(reserva);
    });
  }

  async remove(id: string) {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
    return { message: 'Reserva eliminada correctamente' };
  }
}

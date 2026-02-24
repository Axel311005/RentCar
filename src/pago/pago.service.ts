import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const { reservaId, ...pagoData } = createPagoDto;
    const reserva = await this.reservaRepository.findOne({
      where: { id: reservaId },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con id ${reservaId} no encontrada`);
    }

    const pago = this.pagoRepository.create({
      ...pagoData,
      reserva,
    });
    return this.pagoRepository.save(pago);
  }

  findAll() {
    return this.pagoRepository.find({ relations: { reserva: true } });
  }

  async findOne(id: string) {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: { reserva: true },
    });
    if (!pago) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
    return pago;
  }

  async update(id: string, updatePagoDto: UpdatePagoDto) {
    const { reservaId, ...pagoData } = updatePagoDto;
    const pago = await this.findOne(id);

    if (reservaId) {
      const reserva = await this.reservaRepository.findOne({
        where: { id: reservaId },
      });
      if (!reserva) {
        throw new NotFoundException(
          `Reserva con id ${reservaId} no encontrada`,
        );
      }
      pago.reserva = reserva;
    }

    Object.assign(pago, pagoData);
    return this.pagoRepository.save(pago);
  }

  async remove(id: string) {
    const pago = await this.findOne(id);
    await this.pagoRepository.remove(pago);
    return { message: 'Pago eliminado correctamente' };
  }
}

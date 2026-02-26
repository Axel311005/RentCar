import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemporadaPrecioDto } from './dto/create-temporada-precio.dto';
import { UpdateTemporadaPrecioDto } from './dto/update-temporada-precio.dto';
import { TemporadaPrecio } from './entities/temporada-precio.entity';

@Injectable()
export class TemporadaPrecioService {
  constructor(
    @InjectRepository(TemporadaPrecio)
    private readonly temporadaPrecioRepository: Repository<TemporadaPrecio>,
  ) {}

  private validateDateRange(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      throw new BadRequestException('Las fechas de temporada son inválidas');
    }

    if (inicio > fin) {
      throw new BadRequestException(
        'fechaInicio no puede ser mayor que fechaFin',
      );
    }
  }

  create(createTemporadaPrecioDto: CreateTemporadaPrecioDto) {
    this.validateDateRange(
      createTemporadaPrecioDto.fechaInicio,
      createTemporadaPrecioDto.fechaFin,
    );

    const temporada = this.temporadaPrecioRepository.create(
      createTemporadaPrecioDto,
    );
    return this.temporadaPrecioRepository.save(temporada);
  }

  findAll() {
    return this.temporadaPrecioRepository.find({
      relations: { modelosPrecios: true },
    });
  }

  async findOne(id: string) {
    const temporada = await this.temporadaPrecioRepository.findOne({
      where: { id },
      relations: { modelosPrecios: true },
    });

    if (!temporada) {
      throw new NotFoundException(`TemporadaPrecio con id ${id} no encontrada`);
    }

    return temporada;
  }

  async update(id: string, updateTemporadaPrecioDto: UpdateTemporadaPrecioDto) {
    const temporada = await this.findOne(id);
    const fechaInicio =
      updateTemporadaPrecioDto.fechaInicio ?? temporada.fechaInicio;
    const fechaFin = updateTemporadaPrecioDto.fechaFin ?? temporada.fechaFin;

    this.validateDateRange(fechaInicio, fechaFin);

    Object.assign(temporada, updateTemporadaPrecioDto);
    return this.temporadaPrecioRepository.save(temporada);
  }

  async remove(id: string) {
    const temporada = await this.findOne(id);
    await this.temporadaPrecioRepository.remove(temporada);
    return { message: 'Temporada de precio eliminada correctamente' };
  }
}

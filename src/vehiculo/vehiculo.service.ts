import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { Categoria } from '../categoria/entities/categoria.entity';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    const { categoriaId, ...vehiculoData } = createVehiculoDto;
    const categoria = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    const vehiculo = this.vehiculoRepository.create({
      ...vehiculoData,
      categoria,
    });
    return this.vehiculoRepository.save(vehiculo);
  }

  findAll() {
    return this.vehiculoRepository.find({
      relations: { categoria: true, reservas: true },
    });
  }

  async findOne(id: string) {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: { categoria: true, reservas: true },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo con id ${id} no encontrado`);
    }
    return vehiculo;
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    const { categoriaId, ...vehiculoData } = updateVehiculoDto;
    const vehiculo = await this.findOne(id);

    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new NotFoundException(
          `Categoria con id ${categoriaId} no encontrada`,
        );
      }

      vehiculo.categoria = categoria;
    }

    Object.assign(vehiculo, vehiculoData);
    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id: string) {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.remove(vehiculo);
    return { message: 'Vehiculo eliminado correctamente' };
  }
}

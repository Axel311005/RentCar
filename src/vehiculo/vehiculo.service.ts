import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { Modelo } from '../modelo/entities/modelo.entity';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    const { modeloId, ...vehiculoData } = createVehiculoDto;
    const modelo = await this.modeloRepository.findOne({
      where: { id: modeloId },
    });

    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${modeloId} no encontrado`);
    }

    const vehiculo = this.vehiculoRepository.create({
      ...vehiculoData,
      modelo,
    });
    return this.vehiculoRepository.save(vehiculo);
  }

  findAll() {
    return this.vehiculoRepository.find({
      relations: { modelo: true, reservas: true },
    });
  }

  async findOne(id: string) {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: { modelo: true, reservas: true },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo con id ${id} no encontrado`);
    }
    return vehiculo;
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    const { modeloId, ...vehiculoData } = updateVehiculoDto;
    const vehiculo = await this.findOne(id);

    if (modeloId) {
      const modelo = await this.modeloRepository.findOne({
        where: { id: modeloId },
      });

      if (!modelo) {
        throw new NotFoundException(`Modelo con id ${modeloId} no encontrado`);
      }

      vehiculo.modelo = modelo;
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

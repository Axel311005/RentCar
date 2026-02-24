import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehiculoImagen } from '../vehiculo/entities/vehiculo-imagen.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { CreateVehiculoImagenDto } from './dto/create-vehiculo-imagen.dto';
import { UpdateVehiculoImagenDto } from './dto/update-vehiculo-imagen.dto';

@Injectable()
export class VehiculoImagenService {
  constructor(
    @InjectRepository(VehiculoImagen)
    private readonly vehiculoImagenRepository: Repository<VehiculoImagen>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  private async getVehiculoOrFail(vehiculoId: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id: vehiculoId },
    });

    if (!vehiculo) {
      throw new NotFoundException(
        `Vehículo con id ${vehiculoId} no encontrado`,
      );
    }

    return vehiculo;
  }

  async create(createDto: CreateVehiculoImagenDto) {
    const vehiculo = await this.getVehiculoOrFail(createDto.vehiculoId);

    if (createDto.esPrincipal) {
      await this.vehiculoImagenRepository.update(
        { vehiculo: { id: createDto.vehiculoId } },
        { esPrincipal: false },
      );
    }

    const imagen = this.vehiculoImagenRepository.create({
      url: createDto.url,
      altText: createDto.altText,
      esPrincipal: createDto.esPrincipal ?? false,
      vehiculo,
    });

    return this.vehiculoImagenRepository.save(imagen);
  }

  findAll() {
    return this.vehiculoImagenRepository.find({
      relations: { vehiculo: true },
      order: { esPrincipal: 'DESC' },
    });
  }

  findByVehiculo(vehiculoId: string) {
    return this.vehiculoImagenRepository.find({
      where: { vehiculo: { id: vehiculoId } },
      relations: { vehiculo: true },
      order: { esPrincipal: 'DESC' },
    });
  }

  async findOne(id: string) {
    const imagen = await this.vehiculoImagenRepository.findOne({
      where: { id },
      relations: { vehiculo: true },
    });

    if (!imagen) {
      throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    }

    return imagen;
  }

  async update(id: string, updateDto: UpdateVehiculoImagenDto) {
    const imagen = await this.findOne(id);

    let vehiculoIdActual = imagen.vehiculo.id;
    if (updateDto.vehiculoId && updateDto.vehiculoId !== vehiculoIdActual) {
      const nuevoVehiculo = await this.getVehiculoOrFail(updateDto.vehiculoId);
      imagen.vehiculo = nuevoVehiculo;
      vehiculoIdActual = nuevoVehiculo.id;
    }

    if (updateDto.esPrincipal) {
      await this.vehiculoImagenRepository.update(
        { vehiculo: { id: vehiculoIdActual } },
        { esPrincipal: false },
      );
    }

    if (updateDto.url !== undefined) imagen.url = updateDto.url;
    if (updateDto.altText !== undefined) imagen.altText = updateDto.altText;
    if (updateDto.esPrincipal !== undefined) {
      imagen.esPrincipal = updateDto.esPrincipal;
    }

    return this.vehiculoImagenRepository.save(imagen);
  }

  async setPrincipal(id: string) {
    const imagen = await this.findOne(id);

    await this.vehiculoImagenRepository.update(
      { vehiculo: { id: imagen.vehiculo.id } },
      { esPrincipal: false },
    );

    imagen.esPrincipal = true;
    return this.vehiculoImagenRepository.save(imagen);
  }

  async remove(id: string) {
    const imagen = await this.findOne(id);
    await this.vehiculoImagenRepository.remove(imagen);
    return { message: 'Imagen eliminada correctamente' };
  }
}

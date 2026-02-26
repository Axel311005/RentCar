import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModeloPrecioTemporadaDto } from './dto/create-modelo-precio-temporada.dto';
import { UpdateModeloPrecioTemporadaDto } from './dto/update-modelo-precio-temporada.dto';
import { ModeloPrecioTemporada } from './entities/modelo-precio-temporada.entity';
import { Modelo } from '../modelo/entities/modelo.entity';
import { TemporadaPrecio } from '../temporada-precio/entities/temporada-precio.entity';

@Injectable()
export class ModeloPrecioTemporadaService {
  constructor(
    @InjectRepository(ModeloPrecioTemporada)
    private readonly modeloPrecioTemporadaRepository: Repository<ModeloPrecioTemporada>,
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
    @InjectRepository(TemporadaPrecio)
    private readonly temporadaPrecioRepository: Repository<TemporadaPrecio>,
  ) {}

  private async getModeloOrFail(modeloId: string): Promise<Modelo> {
    const modelo = await this.modeloRepository.findOne({
      where: { id: modeloId },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${modeloId} no encontrado`);
    }

    return modelo;
  }

  private async getTemporadaOrFail(
    temporadaId: string,
  ): Promise<TemporadaPrecio> {
    const temporada = await this.temporadaPrecioRepository.findOne({
      where: { id: temporadaId },
    });

    if (!temporada) {
      throw new NotFoundException(
        `TemporadaPrecio con id ${temporadaId} no encontrada`,
      );
    }

    return temporada;
  }

  private async validateUniquePair(
    modeloId: string,
    temporadaId: string,
    excludeId?: string,
  ) {
    const qb = this.modeloPrecioTemporadaRepository
      .createQueryBuilder('mpt')
      .innerJoin('mpt.modelo', 'modelo')
      .innerJoin('mpt.temporada', 'temporada')
      .where('modelo.id = :modeloId', { modeloId })
      .andWhere('temporada.id = :temporadaId', { temporadaId });

    if (excludeId) {
      qb.andWhere('mpt.id != :excludeId', { excludeId });
    }

    const existente = await qb.getOne();
    if (existente) {
      throw new ConflictException(
        'Ya existe un precio de temporada para ese modelo y temporada',
      );
    }
  }

  async create(createDto: CreateModeloPrecioTemporadaDto) {
    await this.validateUniquePair(createDto.modeloId, createDto.temporadaId);

    const [modelo, temporada] = await Promise.all([
      this.getModeloOrFail(createDto.modeloId),
      this.getTemporadaOrFail(createDto.temporadaId),
    ]);

    const entity = this.modeloPrecioTemporadaRepository.create({
      modelo,
      temporada,
      precioDiario: createDto.precioDiario,
    });

    return this.modeloPrecioTemporadaRepository.save(entity);
  }

  findAll() {
    return this.modeloPrecioTemporadaRepository.find({
      relations: { modelo: true, temporada: true },
    });
  }

  async findOne(id: string) {
    const entity = await this.modeloPrecioTemporadaRepository.findOne({
      where: { id },
      relations: { modelo: true, temporada: true },
    });

    if (!entity) {
      throw new NotFoundException(
        `ModeloPrecioTemporada con id ${id} no encontrado`,
      );
    }

    return entity;
  }

  async update(id: string, updateDto: UpdateModeloPrecioTemporadaDto) {
    const entity = await this.findOne(id);

    const modeloId = updateDto.modeloId ?? entity.modelo.id;
    const temporadaId = updateDto.temporadaId ?? entity.temporada.id;

    await this.validateUniquePair(modeloId, temporadaId, id);

    if (updateDto.modeloId && updateDto.modeloId !== entity.modelo.id) {
      entity.modelo = await this.getModeloOrFail(updateDto.modeloId);
    }

    if (
      updateDto.temporadaId &&
      updateDto.temporadaId !== entity.temporada.id
    ) {
      entity.temporada = await this.getTemporadaOrFail(updateDto.temporadaId);
    }

    if (updateDto.precioDiario !== undefined) {
      entity.precioDiario = updateDto.precioDiario;
    }

    return this.modeloPrecioTemporadaRepository.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.modeloPrecioTemporadaRepository.remove(entity);
    return {
      message: 'Precio de temporada para modelo eliminado correctamente',
    };
  }
}

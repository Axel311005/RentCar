import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { Modelo } from './entities/modelo.entity';
import { ModeloPrecioTemporada } from '../modelo-precio-temporada/entities/modelo-precio-temporada.entity';
import { Categoria } from '../categoria/entities/categoria.entity';

@Injectable()
export class ModeloService {
  constructor(
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
    @InjectRepository(ModeloPrecioTemporada)
    private readonly modeloPrecioTemporadaRepository: Repository<ModeloPrecioTemporada>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createModeloDto: CreateModeloDto) {
    const { categoriaId, ...modeloData } = createModeloDto;

    const categoria = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    const modelo = this.modeloRepository.create({
      ...modeloData,
      categoria,
    });

    return this.modeloRepository.save(modelo);
  }

  findAll() {
    return this.modeloRepository.find({
      relations: {
        categoria: true,
        vehiculos: true,
        imagenes: true,
        preciosTemporada: true,
      },
    });
  }

  async findOne(id: string) {
    const modelo = await this.modeloRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
        vehiculos: true,
        imagenes: true,
        preciosTemporada: { temporada: true },
      },
    });

    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${id} no encontrado`);
    }

    return modelo;
  }

  async update(id: string, updateModeloDto: UpdateModeloDto) {
    const { categoriaId, ...modeloData } = updateModeloDto;
    const modelo = await this.findOne(id);

    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new NotFoundException(
          `Categoria con id ${categoriaId} no encontrada`,
        );
      }

      modelo.categoria = categoria;
    }

    Object.assign(modelo, modeloData);
    return this.modeloRepository.save(modelo);
  }

  async remove(id: string) {
    const modelo = await this.findOne(id);
    await this.modeloRepository.remove(modelo);
    return { message: 'Modelo eliminado correctamente' };
  }

  async getPrecioPorFecha(id: string, fecha: string) {
    const modelo = await this.findOne(id);

    const fechaDate = new Date(`${fecha}T00:00:00.000Z`);
    if (Number.isNaN(fechaDate.getTime())) {
      throw new BadRequestException('La fecha enviada es inválida');
    }

    const precioTemporada = await this.modeloPrecioTemporadaRepository
      .createQueryBuilder('mpt')
      .innerJoinAndSelect('mpt.temporada', 'temporada')
      .innerJoin('mpt.modelo', 'modelo')
      .where('modelo.id = :id', { id })
      .andWhere(
        ':fecha::date BETWEEN temporada.fecha_inicio AND temporada.fecha_fin',
        {
          fecha,
        },
      )
      .orderBy('temporada.fecha_inicio', 'DESC')
      .getOne();

    if (precioTemporada) {
      return {
        modeloId: modelo.id,
        fecha,
        precioDiario: Number(precioTemporada.precioDiario),
        fuente: 'temporada',
      };
    }

    return {
      modeloId: modelo.id,
      fecha,
      precioDiario: Number(modelo.precioBaseDiario),
      fuente: 'base',
    };
  }
}

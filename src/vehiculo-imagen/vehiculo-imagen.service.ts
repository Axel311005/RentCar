import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloImagen } from '../vehiculo/entities/vehiculo-imagen.entity';
import { Modelo } from '../modelo/entities/modelo.entity';
import { CreateVehiculoImagenDto } from './dto/create-vehiculo-imagen.dto';
import { UpdateVehiculoImagenDto } from './dto/update-vehiculo-imagen.dto';
import { SupabaseStorageService } from '../storage/supabase-storage.service';

@Injectable()
export class VehiculoImagenService {
  constructor(
    @InjectRepository(ModeloImagen)
    private readonly modeloImagenRepository: Repository<ModeloImagen>,
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
    private readonly supabaseStorageService: SupabaseStorageService,
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

  async create(createDto: CreateVehiculoImagenDto, file?: Express.Multer.File) {
    const modelo = await this.getModeloOrFail(createDto.modeloId);

    let imagenUrl = createDto.url;

    if (file) {
      const uploadResult = await this.supabaseStorageService.uploadModeloImagen(
        file,
        createDto.modeloId,
      );
      imagenUrl = uploadResult.publicUrl;
    }

    if (!imagenUrl) {
      throw new BadRequestException(
        'Debe enviar un archivo (file) o una URL de imagen',
      );
    }

    const imagen = this.modeloImagenRepository.create({
      url: imagenUrl,
      modelo,
    });

    return this.modeloImagenRepository.save(imagen);
  }

  findAll() {
    return this.modeloImagenRepository.find({
      relations: { modelo: true },
    });
  }

  findByModelo(modeloId: string) {
    return this.modeloImagenRepository.find({
      where: { modelo: { id: modeloId } },
      relations: { modelo: true },
    });
  }

  async findOne(id: string) {
    const imagen = await this.modeloImagenRepository.findOne({
      where: { id },
      relations: { modelo: true },
    });

    if (!imagen) {
      throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    }

    return imagen;
  }

  async update(id: string, updateDto: UpdateVehiculoImagenDto) {
    const imagen = await this.findOne(id);

    if (updateDto.modeloId && updateDto.modeloId !== imagen.modelo.id) {
      imagen.modelo = await this.getModeloOrFail(updateDto.modeloId);
    }

    if (updateDto.url !== undefined) imagen.url = updateDto.url;

    return this.modeloImagenRepository.save(imagen);
  }

  async remove(id: string) {
    const imagen = await this.findOne(id);

    await this.modeloImagenRepository.remove(imagen);
    return { message: 'Imagen eliminada correctamente' };
  }
}

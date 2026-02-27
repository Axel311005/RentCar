import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculoImagenController } from './vehiculo-imagen.controller';
import { VehiculoImagenService } from './vehiculo-imagen.service';
import { ModeloImagen } from '../vehiculo/entities/vehiculo-imagen.entity';
import { Modelo } from '../modelo/entities/modelo.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModeloImagen, Modelo]), StorageModule],
  controllers: [VehiculoImagenController],
  providers: [VehiculoImagenService],
})
export class VehiculoImagenModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculoImagenController } from './vehiculo-imagen.controller';
import { VehiculoImagenService } from './vehiculo-imagen.service';
import { VehiculoImagen } from '../vehiculo/entities/vehiculo-imagen.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehiculoImagen, Vehiculo]),
    StorageModule,
  ],
  controllers: [VehiculoImagenController],
  providers: [VehiculoImagenService],
})
export class VehiculoImagenModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculoImagenController } from './vehiculo-imagen.controller';
import { VehiculoImagenService } from './vehiculo-imagen.service';
import { ModeloImagen } from '../vehiculo/entities/vehiculo-imagen.entity';
import { Modelo } from '../modelo/entities/modelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModeloImagen, Modelo])],
  controllers: [VehiculoImagenController],
  providers: [VehiculoImagenService],
})
export class VehiculoImagenModule {}

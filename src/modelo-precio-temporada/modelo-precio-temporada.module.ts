import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeloPrecioTemporadaService } from './modelo-precio-temporada.service';
import { ModeloPrecioTemporadaController } from './modelo-precio-temporada.controller';
import { ModeloPrecioTemporada } from './entities/modelo-precio-temporada.entity';
import { Modelo } from '../modelo/entities/modelo.entity';
import { TemporadaPrecio } from '../temporada-precio/entities/temporada-precio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModeloPrecioTemporada, Modelo, TemporadaPrecio]),
  ],
  controllers: [ModeloPrecioTemporadaController],
  providers: [ModeloPrecioTemporadaService],
})
export class ModeloPrecioTemporadaModule {}

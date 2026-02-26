import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeloService } from './modelo.service';
import { ModeloController } from './modelo.controller';
import { Modelo } from './entities/modelo.entity';
import { ModeloPrecioTemporada } from '../modelo-precio-temporada/entities/modelo-precio-temporada.entity';
import { Categoria } from '../categoria/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Modelo, ModeloPrecioTemporada, Categoria]),
  ],
  controllers: [ModeloController],
  providers: [ModeloService],
  exports: [ModeloService],
})
export class ModeloModule {}

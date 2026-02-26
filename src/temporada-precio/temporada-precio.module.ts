import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporadaPrecioService } from './temporada-precio.service';
import { TemporadaPrecioController } from './temporada-precio.controller';
import { TemporadaPrecio } from './entities/temporada-precio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemporadaPrecio])],
  controllers: [TemporadaPrecioController],
  providers: [TemporadaPrecioService],
})
export class TemporadaPrecioModule {}

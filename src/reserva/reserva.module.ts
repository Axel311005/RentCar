import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Cliente, Vehiculo])],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}

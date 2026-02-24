import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Empleado } from '../empleado/entities/empleado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, Vehiculo, Reserva, Pago, Empleado]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class AdminModule {}

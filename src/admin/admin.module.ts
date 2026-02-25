import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Empleado } from '../empleado/entities/empleado.entity';
import { User } from 'src/auth/entities/user.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { VehiculoImagen } from 'src/vehiculo/entities/vehiculo-imagen.entity';
import { EncryptionService } from 'src/auth/services/encryption.service';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente,
      Vehiculo,
      Reserva,
      Pago,
      Empleado,
      User,
      Categoria,
      VehiculoImagen,
    ]),
  ],
  controllers: [DashboardController, SeedController],
  providers: [DashboardService, SeedService, EncryptionService],
})
export class AdminModule {}

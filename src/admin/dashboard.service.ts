import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Empleado } from '../empleado/entities/empleado.entity';
import { ReservaEstado } from '../reserva/enums/reserva-estado.enum';
import { VehiculoEstado } from '../vehiculo/enums/vehiculo-estado.enum';
import { PagoEstado } from '../pago/enums/pago-estado.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async getResumen() {
    const [clientes, vehiculos, reservas, pagos, empleados] = await Promise.all(
      [
        this.clienteRepository.count(),
        this.vehiculoRepository.count(),
        this.reservaRepository.count(),
        this.pagoRepository.count(),
        this.empleadoRepository.count(),
      ],
    );

    const [
      reservasPendientes,
      reservasConfirmadas,
      reservasCanceladas,
      reservasFinalizadas,
    ] = await Promise.all([
      this.reservaRepository.countBy({ estado: ReservaEstado.PENDIENTE }),
      this.reservaRepository.countBy({ estado: ReservaEstado.CONFIRMADA }),
      this.reservaRepository.countBy({ estado: ReservaEstado.CANCELADA }),
      this.reservaRepository.countBy({ estado: ReservaEstado.FINALIZADA }),
    ]);

    const [vehiculosDisponibles, vehiculosRentados, vehiculosMantenimiento] =
      await Promise.all([
        this.vehiculoRepository.countBy({ estado: VehiculoEstado.DISPONIBLE }),
        this.vehiculoRepository.countBy({ estado: VehiculoEstado.RENTADO }),
        this.vehiculoRepository.countBy({
          estado: VehiculoEstado.MANTENIMIENTO,
        }),
      ]);

    const [
      pagosPendientes,
      pagosAprobados,
      pagosRechazados,
      pagosReembolsados,
    ] = await Promise.all([
      this.pagoRepository.countBy({ estado: PagoEstado.PENDIENTE }),
      this.pagoRepository.countBy({ estado: PagoEstado.APROBADO }),
      this.pagoRepository.countBy({ estado: PagoEstado.RECHAZADO }),
      this.pagoRepository.countBy({ estado: PagoEstado.REEMBOLSADO }),
    ]);

    const totalIngresosRaw = await this.pagoRepository
      .createQueryBuilder('pago')
      .select('COALESCE(SUM(pago.monto), 0)', 'total')
      .where('pago.estado = :estado', { estado: PagoEstado.APROBADO })
      .getRawOne<{ total: string }>();

    return {
      totales: {
        clientes,
        vehiculos,
        reservas,
        pagos,
        empleados,
        ingresos: Number(totalIngresosRaw?.total ?? 0),
      },
      reservasPorEstado: {
        pendientes: reservasPendientes,
        confirmadas: reservasConfirmadas,
        canceladas: reservasCanceladas,
        finalizadas: reservasFinalizadas,
      },
      vehiculosPorEstado: {
        disponibles: vehiculosDisponibles,
        rentados: vehiculosRentados,
        mantenimiento: vehiculosMantenimiento,
      },
      pagosPorEstado: {
        pendientes: pagosPendientes,
        aprobados: pagosAprobados,
        rechazados: pagosRechazados,
        reembolsados: pagosReembolsados,
      },
    };
  }
}

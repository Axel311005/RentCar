import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDateString, IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Pago } from '../../pago/entities/pago.entity';
import { ReservaEstado } from '../enums/reserva-estado.enum';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'fecha_inicio' })
  @IsDateString()
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_fin' })
  @IsDateString()
  fechaFin: string;

  @Column({ type: 'int', name: 'cantidad_dias' })
  @IsInt()
  @Min(1)
  cantidadDias: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_total' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioTotal: number;

  @Column({
    type: 'enum',
    enum: ReservaEstado,
    default: ReservaEstado.PENDIENTE,
    name: 'estado',
  })
  @IsEnum(ReservaEstado)
  estado: ReservaEstado;

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  cliente: Cliente;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.reservas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  vehiculo: Vehiculo;

  @OneToMany(() => Pago, (pago) => pago.reserva)
  pagos: Pago[];
}

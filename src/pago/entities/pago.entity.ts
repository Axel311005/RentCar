import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { MetodoPago } from '../enums/metodo-pago.enum';
import { PagoEstado } from '../enums/pago-estado.enum';

@Entity({ name: 'pagos' })
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'monto' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto: number;

  @Column({ type: 'enum', enum: MetodoPago, name: 'metodo_pago' })
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @Column({
    type: 'timestamp',
    name: 'fecha_pago',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaPago: Date;

  @Column({
    type: 'enum',
    enum: PagoEstado,
    default: PagoEstado.PENDIENTE,
    name: 'estado',
  })
  @IsEnum(PagoEstado)
  estado: PagoEstado;

  @Column({ type: 'varchar', length: 120, nullable: true, name: 'referencia' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  referencia?: string;

  @ManyToOne(() => Reserva, (reserva) => reserva.pagos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  reserva: Reserva;
}

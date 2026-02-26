import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Modelo } from '../../modelo/entities/modelo.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { VehiculoEstado } from '../enums/vehiculo-estado.enum';

@Entity({ name: 'vehiculos' })
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'placa' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  placa: string;

  @Column({ type: 'varchar', length: 40, nullable: true, name: 'color' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  color?: string;

  @Column({
    type: 'enum',
    enum: VehiculoEstado,
    default: VehiculoEstado.DISPONIBLE,
    name: 'estado',
  })
  @IsEnum(VehiculoEstado)
  estado: VehiculoEstado;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'kilometraje',
  })
  kilometraje?: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Modelo, (modelo) => modelo.vehiculos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @OneToMany(() => Reserva, (reserva) => reserva.vehiculo)
  reservas: Reserva[];
}

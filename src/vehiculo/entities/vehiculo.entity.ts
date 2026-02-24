import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { VehiculoEstado } from '../enums/vehiculo-estado.enum';
import { VehiculoImagen } from './vehiculo-imagen.entity';

@Entity({ name: 'vehiculos' })
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, name: 'marca' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  marca: string;

  @Column({ type: 'varchar', length: 80, name: 'modelo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  modelo: string;

  @Column({ type: 'int', name: 'anio' })
  @IsInt()
  @Min(1900)
  anio: number;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'placa' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  placa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_por_dia' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPorDia: number;

  @Column({
    type: 'enum',
    enum: VehiculoEstado,
    default: VehiculoEstado.DISPONIBLE,
    name: 'estado',
  })
  @IsEnum(VehiculoEstado)
  estado: VehiculoEstado;

  @Column({ type: 'boolean', default: true, name: 'activo' })
  @IsBoolean()
  activo: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.vehiculos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  categoria: Categoria;

  @OneToMany(() => Reserva, (reserva) => reserva.vehiculo)
  reservas: Reserva[];

  @OneToMany(() => VehiculoImagen, (imagen) => imagen.vehiculo)
  imagenes: VehiculoImagen[];
}

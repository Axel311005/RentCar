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
import { IsEnum } from 'class-validator';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { ModeloImagen } from '../../vehiculo/entities/vehiculo-imagen.entity';
import { ModeloPrecioTemporada } from '../../modelo-precio-temporada/entities/modelo-precio-temporada.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { EstadoGeneral } from 'src/enum/estado-general.enum';

@Entity({ name: 'modelos' })
export class Modelo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, name: 'marca' })
  marca: string;

  @Column({ type: 'varchar', length: 120, name: 'nombre' })
  nombre: string;

  @Column({ type: 'int', name: 'anio' })
  anio: number;

  @Column({
    type: 'varchar',
    length: 40,
    name: 'tipo_combustible',
    nullable: true,
  })
  tipoCombustible?: string;

  @Column({ type: 'int', name: 'capacidad_pasajeros', nullable: true })
  capacidadPasajeros?: number;

  @Column({
    type: 'enum',
    enum: EstadoGeneral,
    default: EstadoGeneral.ACTIVO,
    name: 'estado',
  })
  @IsEnum(EstadoGeneral)
  estado: EstadoGeneral;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'precio_base_diario',
  })
  precioBaseDiario: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.modelos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.modelo)
  vehiculos: Vehiculo[];

  @OneToMany(() => ModeloImagen, (modeloImagen) => modeloImagen.modelo)
  imagenes: ModeloImagen[];

  @OneToMany(
    () => ModeloPrecioTemporada,
    (modeloPrecioTemporada) => modeloPrecioTemporada.modelo,
  )
  preciosTemporada: ModeloPrecioTemporada[];
}

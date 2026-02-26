import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModeloPrecioTemporada } from '../../modelo-precio-temporada/entities/modelo-precio-temporada.entity';

@Entity({ name: 'temporadas_precios' })
export class TemporadaPrecio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120, name: 'descripcion' })
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(
    () => ModeloPrecioTemporada,
    (modeloPrecioTemporada) => modeloPrecioTemporada.temporada,
  )
  modelosPrecios: ModeloPrecioTemporada[];
}

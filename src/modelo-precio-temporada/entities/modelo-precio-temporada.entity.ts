import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Modelo } from '../../modelo/entities/modelo.entity';
import { TemporadaPrecio } from '../../temporada-precio/entities/temporada-precio.entity';

@Entity({ name: 'modelos_precios_temporadas' })
@Unique('UQ_modelo_temporada', ['modelo', 'temporada'])
export class ModeloPrecioTemporada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Modelo, (modelo) => modelo.preciosTemporada, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @ManyToOne(() => TemporadaPrecio, (temporada) => temporada.modelosPrecios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'temporada_id' })
  temporada: TemporadaPrecio;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_diario' })
  precioDiario: number;
}

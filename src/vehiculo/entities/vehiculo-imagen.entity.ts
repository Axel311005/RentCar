import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { Modelo } from '../../modelo/entities/modelo.entity';

@Entity({ name: 'modelo_imagenes' })
export class ModeloImagen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'url' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Modelo, (modelo) => modelo.imagenes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;
}

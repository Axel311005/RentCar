import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Vehiculo } from './vehiculo.entity';

@Entity({ name: 'vehiculo_imagenes' })
export class VehiculoImagen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500, name: 'url' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'alt_text' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  altText?: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'storage_path',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  storagePath?: string;

  @Column({ type: 'boolean', default: false, name: 'es_principal' })
  @IsBoolean()
  esPrincipal: boolean;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.imagenes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;
}

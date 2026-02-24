import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'nombre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.categoria)
  vehiculos: Vehiculo[];
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Modelo } from '../../modelo/entities/modelo.entity';
import { EstadoGeneral } from 'src/enum/estado-general.enum';

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

  @Column({
    type: 'enum',
    enum: EstadoGeneral,
    default: EstadoGeneral.ACTIVO,
    name: 'estado',
  })
  @IsEnum(EstadoGeneral)
  estado: EstadoGeneral;

  @OneToMany(() => Modelo, (modelo) => modelo.categoria)
  modelos: Modelo[];
}

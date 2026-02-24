import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'empleados' })
export class Empleado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120, name: 'nombres' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombres: string;

  @Column({ type: 'varchar', length: 120, name: 'apellidos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  apellidos: string;

  @Column({ type: 'varchar', length: 180, unique: true, name: 'email' })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'telefono' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @Column({ type: 'varchar', length: 80, name: 'cargo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  cargo: string;

  @Column({ type: 'boolean', default: true, name: 'activo' })
  @IsBoolean()
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_ingreso' })
  fechaIngreso: Date;

  @OneToOne(() => User, (user) => user.empleado, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

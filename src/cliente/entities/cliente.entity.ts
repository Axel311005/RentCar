import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { EstadoGeneral } from 'src/enum/estado-general.enum';

@Entity({ name: 'clientes' })
export class Cliente {
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

  @Column({ type: 'varchar', length: 30, name: 'telefono' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  @Column({
    type: 'enum',
    enum: EstadoGeneral,
    default: EstadoGeneral.ACTIVO,
    name: 'estado',
  })
  @IsEnum(EstadoGeneral)
  estado: EstadoGeneral;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_registro' })
  fechaRegistro: Date;

  @OneToOne(() => User, (user) => user.cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Reserva[];
}

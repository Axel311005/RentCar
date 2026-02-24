import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Empleado } from '../../empleado/entities/empleado.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Cliente, (cliente) => cliente.user)
  cliente: Cliente;

  @OneToOne(() => Empleado, (empleado) => empleado.user)
  empleado: Empleado;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clientes' })
export class ClienteOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  numeroDocumento!: string;

  @Column({ type: 'varchar', length: 254,unique: true })
  correo!: string;

  @Column({ type: 'text' })
  domicilio!: string;

  @Column({ type: 'varchar', length: 30 })
  telefono!: string;
}
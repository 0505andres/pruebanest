import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClienteOrmEntity } from '../../../../clientes/infraestructure/persistence/entities/cliente.orm-entity';
import { ItemOrmEntity } from './item.orm-entity';

@Entity({ name: 'compras' })
export class CompraOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ClienteOrmEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: ClienteOrmEntity;

  @Column({ type: 'varchar', length: 50 })
  estado!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  codigo!: string;

  @Column({ type: 'timestamp without time zone' })
  fecha!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  impuesto!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total!: string;

  @OneToMany(() => ItemOrmEntity, (item) => item.compra, { cascade: true })
  items!: ItemOrmEntity[];
}
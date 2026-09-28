import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClienteOrmEntity } from '../../../../clientes/infraestructure/persistence/entities/cliente.orm-entity';
import { ItemOrmEntity } from './item.orm-entity';

@Entity({ name: 'compras' })
@Check('CHK_compras_codigo_siete_digitos', '"codigo" ~ \'^[0-9]{7}$\'')
export class CompraOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ClienteOrmEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: ClienteOrmEntity;

  @Column({ type: 'varchar', length: 50, default: 'PENDIENTE' })
  estado!: string;

  @Column({ type: 'varchar', length: 7, unique: true })
  codigo!: string;

  @Column({ type: 'timestamp without time zone' })
  fecha!: Date | string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  impuesto!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total!: string;

  @Column({ type: 'boolean', default: false })
  inventarioRestituido!: boolean;

  @OneToMany(() => ItemOrmEntity, (item) => item.compra, { cascade: true })
  items!: ItemOrmEntity[];
}
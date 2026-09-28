import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ProductoOrmEntity } from '../../../../stock/infraestructure/persistence/entities/producto.orm-entity';
import { CompraOrmEntity } from './compra.orm-entity';

@Entity({ name: 'items' })
export class ItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CompraOrmEntity, (compra) => compra.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra!: CompraOrmEntity;

  @RelationId((item: ItemOrmEntity) => item.compra)
  compraId!: string;

  @ManyToOne(() => ProductoOrmEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'producto_id' })
  producto!: ProductoOrmEntity;

  @RelationId((item: ItemOrmEntity) => item.producto)
  productoId!: string;

  @Column({ type: 'integer' })
  cantidad!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorUnitario!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorTotal!: string;
}
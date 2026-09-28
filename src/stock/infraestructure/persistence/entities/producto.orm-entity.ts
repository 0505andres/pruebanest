import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productos' })
export class ProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'integer' })
  cantidad!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  codigo!: string;

  @Column({ type: 'text' })
  foto!: string;

  @Column({ type: 'varchar', length: 100 })
  categoria!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
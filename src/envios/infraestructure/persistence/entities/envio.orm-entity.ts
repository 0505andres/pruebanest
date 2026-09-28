import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompraOrmEntity } from '../../../../compras/infraestructure/persistence/entities/compra.orm-entity';

@Entity({ name: 'envios' })
export class EnvioOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CompraOrmEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra!: CompraOrmEntity;

  @Column({ type: 'date' })
  fechaEnvio!: string;

  @Column({ type: 'varchar', length: 50 })
  estado!: string;

  @Column({ type: 'text' })
  domicilio!: string;
}
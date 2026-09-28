import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CompraOrmEntity } from '../../../../compras/infraestructure/persistence/entities/compra.orm-entity';

@Entity({ name: 'envios' })
@Unique('UQ_envios_compra_id', ['compra'])
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
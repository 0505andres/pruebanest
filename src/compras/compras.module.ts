import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from '../stock/stock.module';
import { ActualizarEstadoCompraUseCase } from './application/use-cases/actualizar-estado-compra.use-case';
import { ConsultarCompraPorCodigoUseCase } from './application/use-cases/consultar-compra-por-codigo.use-case';
import { RegistrarCompraUseCase } from './application/use-cases/registrar-compra.use-case';
import { COMPRA_REPOSITORY_PORT } from './domain/ports/compra.repository-port';
import { ITEM_REPOSITORY_PORT } from './domain/ports/item.repository-port';
import { CompraController } from './infraestructure/http/compra.controller';
import { CompraOrmEntity } from './infraestructure/persistence/entities/compra.orm-entity';
import { ItemOrmEntity } from './infraestructure/persistence/entities/item.orm-entity';
import { SqlCompraRepository } from './infraestructure/persistence/repository/sql-compra.repository';
import { SqlItemRepository } from './infraestructure/persistence/repository/sql-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompraOrmEntity, ItemOrmEntity]), StockModule],
  providers: [
    { provide: COMPRA_REPOSITORY_PORT, useClass: SqlCompraRepository },
    { provide: ITEM_REPOSITORY_PORT, useClass: SqlItemRepository },
    RegistrarCompraUseCase,
    ConsultarCompraPorCodigoUseCase,
    ActualizarEstadoCompraUseCase,
  ],
  controllers: [CompraController],
  exports: [RegistrarCompraUseCase, ConsultarCompraPorCodigoUseCase, ActualizarEstadoCompraUseCase],
})
export class ComprasModule {}
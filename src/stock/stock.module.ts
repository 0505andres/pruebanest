import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProductosUseCase } from './application/use-cases/get-productos.use-case';
import { PRODUCTO_REPOSITORY_PORT } from './domain/ports/producto.repository-port';
import { ProductoController } from './infraestructure/http/producto.controller';
import { ProductoOrmEntity } from './infraestructure/persistence/entities/producto.orm-entity';
import { SqlProductoRepository } from './infraestructure/persistence/repository/sql-producto.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoOrmEntity])],
  providers: [
    {
      provide: PRODUCTO_REPOSITORY_PORT,
      useClass: SqlProductoRepository,
    },
    GetProductosUseCase,
  ],
  controllers: [ProductoController],
  exports: [GetProductosUseCase, PRODUCTO_REPOSITORY_PORT],
})
export class StockModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuscarClientePorDocumentoUseCase } from './application/use-cases/buscar-cliente-por-documento.use-case';
import { RegistrarClienteUseCase } from './application/use-cases/registrar-cliente.use-case';
import { CLIENTE_REPOSITORY_PORT } from './domain/ports/cliente.repository-port';
import { ClienteController } from './infraestructure/http/cliente.controller';
import { ClienteOrmEntity } from './infraestructure/persistence/entities/cliente.orm-entity';
import { SqlClienteRepository } from './infraestructure/persistence/repository/sql-cliente.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrmEntity])],
  providers: [
    {
      provide: CLIENTE_REPOSITORY_PORT,
      useClass: SqlClienteRepository,
    },
    RegistrarClienteUseCase,
    BuscarClientePorDocumentoUseCase,
  ],
  controllers: [ClienteController],
  exports: [RegistrarClienteUseCase, BuscarClientePorDocumentoUseCase, CLIENTE_REPOSITORY_PORT],
})
export class ClientesModule {}
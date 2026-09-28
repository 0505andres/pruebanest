import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoEnvioPorCompraUseCase } from './application/use-cases/estado-envio-por-compra.use-case';
import { RegistrarEnvioUseCase } from './application/use-cases/registrar-envio.use-case';
import { ENVIO_REPOSITORY_PORT } from './domain/ports/envio.repository-port';
import { EnvioController } from './infraestructure/http/envio.controller';
import { EnvioOrmEntity } from './infraestructure/persistence/entities/envio.orm-entity';
import { SqlEnvioRepository } from './infraestructure/persistence/repository/sql-envio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnvioOrmEntity])],
  providers: [
    { provide: ENVIO_REPOSITORY_PORT, useClass: SqlEnvioRepository },
    RegistrarEnvioUseCase,
    EstadoEnvioPorCompraUseCase,
  ],
  controllers: [EnvioController],
  exports: [RegistrarEnvioUseCase, EstadoEnvioPorCompraUseCase],
})
export class EnviosModule {}
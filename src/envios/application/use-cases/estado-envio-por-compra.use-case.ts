import { Inject, Injectable } from '@nestjs/common';
import { Envio } from '../../domain/entities/envio.entity';
import { ENVIO_REPOSITORY_PORT, type EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { failure, success, type EnvioError, type Result } from '../result';

@Injectable()
export class EstadoEnvioPorCompraUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repository: EnvioRepositoryPort,
  ) {}

  async execute(codigoCompra: string): Promise<Result<Envio, EnvioError>> {
    if (!/^\d{7}$/.test(codigoCompra)) {
      return failure({ code: 'VALIDATION_ERROR', message: 'El código de compra debe tener 7 dígitos.' });
    }

    try {
      const envio = await this.repository.estadoEnvioPorCompra(codigoCompra);
      return envio
        ? success(envio)
        : failure({ code: 'ENVIO_NOT_FOUND', message: `No se encontró un envío para la compra ${codigoCompra}.` });
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible consultar el estado del envío.' });
    }
  }
}
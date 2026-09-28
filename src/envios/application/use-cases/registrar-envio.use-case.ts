import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Envio } from '../../domain/entities/envio.entity';
import { ENVIO_REPOSITORY_PORT, type EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { failure, success, type EnvioError, type Result } from '../result';

export interface RegistrarEnvioCommand {
  compraId: string;
  fechaCompra: string;
  domicilio: string;
}

@Injectable()
export class RegistrarEnvioUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repository: EnvioRepositoryPort,
  ) {}

  async execute(command: RegistrarEnvioCommand): Promise<Result<Envio, EnvioError>> {
    try {
      const existing = await this.repository.estadoEnvioPorCompra(command.compraId);
      if (existing) return success(existing);
    } catch {
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible consultar el envío existente.' });
    }

    let envio: Envio;

    try {
      envio = new Envio(
        randomUUID(),
        command.compraId,
        this.calcularFechaEntrega(command.fechaCompra),
        'PROCESO',
        command.domicilio,
      );
    } catch (error) {
      if (error instanceof Error) {
        return failure({ code: 'VALIDATION_ERROR', message: error.message });
      }
      return failure({ code: 'VALIDATION_ERROR', message: 'Los datos del envío no son válidos.' });
    }

    try {
      return success(await this.repository.guardarEnvio(envio));
    } catch {
      try {
        const existing = await this.repository.estadoEnvioPorCompra(command.compraId);
        if (existing) return success(existing);
      } catch {
        return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible confirmar el envío registrado.' });
      }
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible registrar el envío.' });
    }
  }

  private calcularFechaEntrega(fechaCompra: string): string {
    const fecha = new Date(`${fechaCompra.replace(' ', 'T')}Z`);
    if (Number.isNaN(fecha.getTime())) {
      throw new Error('La fecha de creación de la compra no es válida.');
    }
    fecha.setUTCDate(fecha.getUTCDate() + 3);
    return fecha.toISOString().slice(0, 10);
  }
}
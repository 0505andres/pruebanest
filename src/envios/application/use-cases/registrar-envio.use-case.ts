import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Envio } from '../../domain/entities/envio.entity';
import { ENVIO_REPOSITORY_PORT, type EnvioRepositoryPort } from '../../domain/ports/envio.repository-port';
import { failure, success, type EnvioError, type Result } from '../result';

export interface RegistrarEnvioCommand {
  compraId: string;
  fechaEnvio: string;
  estado: string;
  domicilio: string;
}

@Injectable()
export class RegistrarEnvioUseCase {
  constructor(
    @Inject(ENVIO_REPOSITORY_PORT)
    private readonly repository: EnvioRepositoryPort,
  ) {}

  async execute(command: RegistrarEnvioCommand): Promise<Result<Envio, EnvioError>> {
    let envio: Envio;

    try {
      envio = new Envio(
        randomUUID(),
        command.compraId,
        command.fechaEnvio,
        command.estado,
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
      return failure({ code: 'PERSISTENCE_ERROR', message: 'No fue posible registrar el envío.' });
    }
  }
}
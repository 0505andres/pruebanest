import { Envio } from '../entities/envio.entity';

export interface EnvioRepositoryPort {
  guardarEnvio(envio: Envio): Promise<Envio>;
  estadoEnvioPorCompra(codigoCompra: string): Promise<Envio | null>;
}

export const ENVIO_REPOSITORY_PORT = Symbol('ENVIO_REPOSITORY_PORT');
import { Cliente } from '../entities/cliente.entity';

export interface ClienteRepositoryPort {
  guardar(cliente: Cliente): Promise<Cliente>;
  buscarPorDocumento(numeroDocumento: string): Promise<Cliente | null>;
}

export const CLIENTE_REPOSITORY_PORT = Symbol('CLIENTE_REPOSITORY_PORT');
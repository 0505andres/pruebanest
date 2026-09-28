import { Compra } from '../entities/compra.entity';

export interface CompraRepositoryPort {
  guardarCompra(compra: Compra): Promise<Compra>;
  buscarCompraPorCodigo(codigo: string): Promise<Compra | null>;
  actualizarEstadoCompra(
    codigo: string,
    estado: string,
    inventarioRestituido: boolean,
  ): Promise<Compra | null>;
}

export const COMPRA_REPOSITORY_PORT = Symbol('COMPRA_REPOSITORY_PORT');
import { Item } from '../entities/item.entity';

export interface ItemRepositoryPort {
  buscarItemsPorCompra(compraId: string): Promise<Item[]>;
}

export const ITEM_REPOSITORY_PORT = Symbol('ITEM_REPOSITORY_PORT');
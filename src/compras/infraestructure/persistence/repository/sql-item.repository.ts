import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../../domain/entities/item.entity';
import { ItemRepositoryPort } from '../../../domain/ports/item.repository-port';
import { ItemOrmEntity } from '../entities/item.orm-entity';
import { ItemMapper } from '../mapper/item.mapper';

@Injectable()
export class SqlItemRepository implements ItemRepositoryPort {
  constructor(
    @InjectRepository(ItemOrmEntity)
    private readonly repository: Repository<ItemOrmEntity>,
  ) {}

  async buscarItemsPorCompra(compraId: string): Promise<Item[]> {
    const entities = await this.repository.find({
      where: { compra: { id: compraId } },
      relations: { compra: true, producto: true },
    });
    return entities.map((entity) => ItemMapper.toDomain(entity));
  }
}
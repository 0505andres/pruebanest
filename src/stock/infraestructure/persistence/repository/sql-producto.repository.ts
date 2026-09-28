import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoRepositoryPort } from '../../../domain/ports/producto.repository-port';
import { ProductoMapper } from '../mapper/producto.mapper';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';

@Injectable()
export class SqlProductoRepository implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repository: Repository<ProductoOrmEntity>,
  ) {}

  async getProductos(activos: boolean): Promise<Producto[]> {
    const entities = await this.repository.find({ where: { activo: activos } });
    return entities.map((entity) => ProductoMapper.toDomain(entity));
  }
}
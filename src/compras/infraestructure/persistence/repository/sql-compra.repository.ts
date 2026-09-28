import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from '../../../domain/entities/compra.entity';
import { CompraRepositoryPort } from '../../../domain/ports/compra.repository-port';
import { CompraMapper } from '../mapper/compra.mapper';
import { CompraOrmEntity } from '../entities/compra.orm-entity';

@Injectable()
export class SqlCompraRepository implements CompraRepositoryPort {
  constructor(
    @InjectRepository(CompraOrmEntity)
    private readonly repository: Repository<CompraOrmEntity>,
  ) {}

  async guardarCompra(compra: Compra): Promise<Compra> {
    const saved = await this.repository.save(CompraMapper.toPersistence(compra));
    const complete = await this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: { cliente: true, items: { producto: true } },
    });
    return CompraMapper.toDomain(complete);
  }

  async buscarCompraPorCodigo(codigo: string): Promise<Compra | null> {
    const entity = await this.repository.findOne({
      where: { codigo },
      relations: { cliente: true, items: { producto: true } },
    });
    return entity ? CompraMapper.toDomain(entity) : null;
  }

  async actualizarEstadoCompra(codigo: string, estado: string): Promise<Compra | null> {
    const entity = await this.repository.findOne({
      where: { codigo },
      relations: { cliente: true, items: { producto: true } },
    });
    if (!entity) return null;
    entity.estado = estado;
    const updated = await this.repository.save(entity);
    return CompraMapper.toDomain(updated);
  }
}
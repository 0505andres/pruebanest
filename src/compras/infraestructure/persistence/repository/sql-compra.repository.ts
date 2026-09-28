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
    return this.repository.manager.transaction(async (manager) => {
      const saved = await manager.save(CompraOrmEntity, CompraMapper.toPersistence(compra));
      const complete = await manager.findOne(CompraOrmEntity, {
        where: { id: saved.id },
        relations: { cliente: true, items: { producto: true } },
      });
      if (!complete) throw new Error('No se pudo recuperar la compra guardada.');
      return CompraMapper.toDomain(complete);
    });
  }

  async buscarCompraPorCodigo(codigo: string): Promise<Compra | null> {
    const entity = await this.repository.findOne({
      where: { codigo },
      relations: { cliente: true, items: { producto: true } },
    });
    return entity ? CompraMapper.toDomain(entity) : null;
  }

  async actualizarEstadoCompra(
    codigo: string,
    estado: string,
    inventarioRestituido: boolean,
  ): Promise<Compra | null> {
    const result = await this.repository.update({ codigo }, { estado, inventarioRestituido });
    if (!result.affected) return null;

    const updated = await this.repository.findOne({
      where: { codigo },
      relations: { cliente: true, items: { producto: true } },
    });
    return updated ? CompraMapper.toDomain(updated) : null;
  }
}
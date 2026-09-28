import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from '../../../domain/entities/envio.entity';
import { EnvioRepositoryPort } from '../../../domain/ports/envio.repository-port';
import { EnvioMapper } from '../mapper/envio.mapper';
import { EnvioOrmEntity } from '../entities/envio.orm-entity';

@Injectable()
export class SqlEnvioRepository implements EnvioRepositoryPort {
  constructor(
    @InjectRepository(EnvioOrmEntity)
    private readonly repository: Repository<EnvioOrmEntity>,
  ) {}

  async guardarEnvio(envio: Envio): Promise<Envio> {
    const saved = await this.repository.save(EnvioMapper.toPersistence(envio));
    const complete = await this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: { compra: true },
    });
    return EnvioMapper.toDomain(complete);
  }

  async estadoEnvioPorCompra(compraId: string): Promise<Envio | null> {
    const entity = await this.repository.findOne({
      where: { compra: { id: compraId } },
      relations: { compra: true },
    });
    return entity ? EnvioMapper.toDomain(entity) : null;
  }
}
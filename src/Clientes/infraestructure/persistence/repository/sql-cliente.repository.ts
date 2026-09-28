import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { ClienteRepositoryPort } from '../../../domain/ports/cliente.repository-port';
import { Cliente } from '../../../domain/entities/cliente.entity';
import { ClienteOrmEntity } from '../entities/cliente.orm-entity'; 
import { ClienteMapper } from '../mapper/cliente.mapper'; 

@Injectable() export class SqlClienteRepository implements ClienteRepositoryPort {
     constructor( 
     @InjectRepository(ClienteOrmEntity) 
     private readonly repository: Repository<ClienteOrmEntity>,
  ) {}

  async guardar(cliente: Cliente): Promise<Cliente> {
    // 1. Transformamos la entidad de Dominio a la entidad de ORM
    const ormEntity = ClienteMapper.toPersistence(cliente);
    // 2\. Persistimos físicamente en la base de datos 
    const guardado = await this.repository.save(ormEntity);

    // 3\. Devolvemos la entidad reconvertida a Dominio 
    return ClienteMapper.toDomain(guardado);
  }

  async buscarPorDocumento(numeroDocumento: string): Promise<Cliente | null> {
    const entity = await this.repository.findOne({
      where: { numeroDocumento },
    });
    return entity ? ClienteMapper.toDomain(entity) : null;
  }

}
// infrastructure/persistence/cliente.mapper.ts 
import { Cliente } from '../../../domain/entities/cliente.entity'; 
import { ClienteEmail } from '../../../domain/value-objects/cliente-email.vo';
import { NumeroDocumento } from '../../../domain/value-objects/numero-documento.vo'; 
import { ClienteOrmEntity } from '../entities/cliente.orm-entity';

export class ClienteMapper { 
    
    /** Pasa de la fila/objeto de la BD (Infraestructura) a la Entidad pura de Dominio */
    static toDomain(raw: ClienteOrmEntity): Cliente { 
        return new Cliente(
            raw.id, 
            raw.nombre, 
            new NumeroDocumento(raw.numeroDocumento), // Reconstruye el Value Object
            new ClienteEmail(raw.correo), // Reconstruye el Value Object
            raw.domicilio,
            raw.telefono,
        ); 
    } 
    
    /** Pasa de la Entidad pura de Dominio al objeto de persistencia relacional */
    
    static toPersistence(cliente: Cliente): ClienteOrmEntity { 
        
        const entity = new ClienteOrmEntity(); 
        entity.id = cliente.id; 
        entity.nombre = cliente.nombre; 
        entity.numeroDocumento = cliente.numeroDocumento.value; // Extrae el valor primitivo
        entity.correo = cliente.correo.value; // Extrae el valor primitivo
        entity.domicilio = cliente.domicilio;
        entity.telefono = cliente.telefono;
        return entity;
    }

}
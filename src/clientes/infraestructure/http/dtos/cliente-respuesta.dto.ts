import type { Cliente } from "../../../domain/entities/cliente.entity";
export class ClienteRespuestaDto {
  id: string;
  nombre: string;
  numeroDocumento: string;
  correo: string;
  domicilio: string;
  telefono: string;
  
  static fromDomain(cliente: Cliente): ClienteRespuestaDto {
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      numeroDocumento: cliente.numeroDocumento.value,
      correo: cliente.correo.value,
      domicilio: cliente.domicilio,
      telefono: cliente.telefono,
    };
  }
}

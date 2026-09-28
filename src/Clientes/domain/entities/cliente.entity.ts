import { ClienteEmail } from './../value-objects/cliente-email.vo';
import { NumeroDocumento } from './../value-objects/numero-documento.vo';

export class Cliente {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly numeroDocumento: NumeroDocumento,
    public readonly correo: ClienteEmail,
    public readonly domicilio: string,
    public readonly telefono: string,
  ) {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre del cliente es obligatorio.');
    }
  }
}
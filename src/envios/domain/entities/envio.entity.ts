export class Envio {
  constructor(
    public readonly id: string,
    public readonly compraId: string,
    public readonly fechaEnvio: string,
    public readonly estado: string,
    public readonly domicilio: string,
  ) {
    if (!compraId || compraId.trim().length === 0) {
      throw new Error('La compra del envío es obligatoria.');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaEnvio)) {
      throw new Error('La fecha de envío debe tener el formato yyyy-mm-dd.');
    }
    if (!estado || estado.trim().length === 0) {
      throw new Error('El estado del envío es obligatorio.');
    }
    if (!domicilio || domicilio.trim().length === 0) {
      throw new Error('El domicilio del envío es obligatorio.');
    }
  }
}
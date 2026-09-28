import type { Envio } from '../../../domain/entities/envio.entity';

export class EnvioRespuestaDto {
  id!: string;
  compraId!: string;
  fechaEnvio!: string;
  estado!: string;
  domicilio!: string;

  static fromDomain(envio: Envio): EnvioRespuestaDto {
    return {
      id: envio.id,
      compraId: envio.compraId,
      fechaEnvio: envio.fechaEnvio,
      estado: envio.estado,
      domicilio: envio.domicilio,
    };
  }
}
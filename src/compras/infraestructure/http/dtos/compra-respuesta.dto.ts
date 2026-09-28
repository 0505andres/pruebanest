import type { Compra } from '../../../domain/entities/compra.entity';

export class CompraRespuestaDto {
  id!: string;
  clienteId!: string;
  estado!: string;
  codigo!: string;
  fecha!: string;
  subtotal!: number;
  impuesto!: number;
  total!: number;
  items!: object[];

  static fromDomain(compra: Compra): CompraRespuestaDto {
    return {
      id: compra.id,
      clienteId: compra.clienteId,
      estado: compra.estado,
      codigo: compra.codigo,
      fecha: compra.fecha,
      subtotal: compra.subtotal,
      impuesto: compra.impuesto,
      total: compra.total,
      items: compra.items.map((item) => ({
        id: item.id,
        compraId: item.compraId,
        productoId: item.productoId,
        cantidad: item.cantidad,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
      })),
    };
  }
}
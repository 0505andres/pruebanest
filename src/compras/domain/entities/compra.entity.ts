import { Item } from './item.entity';

export const TASA_IMPUESTO_COMPRA = 0.19;

export class Compra {
  constructor(
    public readonly id: string,
    public readonly clienteId: string,
    public readonly estado: string,
    public readonly codigo: string,
    public readonly fecha: string,
    public readonly subtotal: number,
    public readonly impuesto: number,
    public readonly total: number,
    public readonly items: Item[],
  ) {
    if (!clienteId || clienteId.trim().length === 0) {
      throw new Error('El cliente de la compra es obligatorio.');
    }
    if (!estado || estado.trim().length === 0) {
      throw new Error('El estado de la compra es obligatorio.');
    }
    if (!/^\d{7}$/.test(codigo)) {
      throw new Error('El código de la compra debe tener 7 dígitos.');
    }
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fecha)) {
      throw new Error('La fecha debe tener el formato yyyy-mm-dd hh:mm:ss.');
    }
    if (![subtotal, impuesto, total].every((value) => Number.isFinite(value) && value >= 0)) {
      throw new Error('Los valores de la compra deben ser decimales no negativos.');
    }
    if (!items.length) {
      throw new Error('La compra debe tener al menos un item.');
    }
    const impuestoCalculado = Number((subtotal * TASA_IMPUESTO_COMPRA).toFixed(2));
    const totalCalculado = Number((subtotal + impuestoCalculado).toFixed(2));
    if (impuesto !== impuestoCalculado || total !== totalCalculado) {
      throw new Error('El impuesto y total de la compra no coinciden con el subtotal.');
    }
  }
}
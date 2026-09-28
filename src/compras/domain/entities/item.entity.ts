export class Item {
  constructor(
    public readonly id: string,
    public readonly compraId: string,
    public readonly productoId: string,
    public readonly cantidad: number,
    public readonly valorUnitario: number,
    public readonly valorTotal: number,
  ) {
    if (!compraId || compraId.trim().length === 0) {
      throw new Error('La compra del item es obligatoria.');
    }
    if (!productoId || productoId.trim().length === 0) {
      throw new Error('El producto del item es obligatorio.');
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad del item debe ser un entero mayor que cero.');
    }
    if (![valorUnitario, valorTotal].every((value) => Number.isFinite(value) && value >= 0)) {
      throw new Error('Los valores del item deben ser decimales no negativos.');
    }
  }
}
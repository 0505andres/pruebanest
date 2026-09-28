export class Item {
  public readonly valorTotal: number;

  constructor(
    public readonly id: string,
    public readonly compraId: string,
    public readonly productoId: string,
    public readonly cantidad: number,
    public readonly valorUnitario: number,
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
    if (!Number.isFinite(valorUnitario) || valorUnitario < 0) {
      throw new Error('El valor unitario del item debe ser un decimal no negativo.');
    }
    this.valorTotal = Number((cantidad * valorUnitario).toFixed(2));
  }
}
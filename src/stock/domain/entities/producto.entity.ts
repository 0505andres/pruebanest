export class Producto {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly cantidad: number,
    public readonly codigo: string,
    public readonly foto: string,
    public readonly categoria: string,
    public readonly precio: number,
    public readonly activo: boolean,
  ) {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre del producto es obligatorio.');
    }
    if (!codigo || codigo.trim().length === 0) {
      throw new Error('El código del producto es obligatorio.');
    }
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      throw new Error('La cantidad del producto debe ser un entero no negativo.');
    }
    if (!Number.isFinite(precio) || precio < 0) {
      throw new Error('El precio del producto debe ser un número no negativo.');
    }
  }
}
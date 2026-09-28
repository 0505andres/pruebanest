export class NumeroDocumento {
    private readonly _value: string;
    constructor(value: string) {
        this.validar(value);
        this._value = value.trim();
    }

    private validar(value: string): void {
        if (!value || value.trim().length === 0) { throw new Error('El número de documento no puede estar vacío.'); } const valorLimpio = value.trim(); if (valorLimpio.length < 5 || valorLimpio.length > 20) { throw new Error(`El número de documento '${value}' debe tener entre 5 y 20 caracteres.`); }
    }

    get value(): string {
        return this._value;
    }
    equals(other: NumeroDocumento): boolean {
        return this._value === other.value;
    }
}
export class ClienteEmail {
    private readonly _value: string;

    constructor(value: string) {
        this.validar(value); this._value = value.toLowerCase().trim();
    } private validar(value: string): void {
        if (!value || value.trim().length === 0) { throw new Error('El correo electrónico es obligatorio.'); } // RegEx corregida para formato de email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailRegex.test(value.trim())) { throw new Error(`El formato del correo '${value}' no es válido.`); }
    }

    get value(): string { return this._value; }

    equals(other: ClienteEmail): boolean {
        return this._value === other.value;
    }
}
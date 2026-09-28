export type CompraErrorCode =
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_CODE'
  | 'COMPRA_NOT_FOUND'
  | 'PERSISTENCE_ERROR';

export interface CompraError {
  code: CompraErrorCode;
  message: string;
}

export type Result<T, E> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Failure<E> {
  readonly ok: false;
  readonly error: E;
}

export const success = <T>(value: T): Success<T> => ({ ok: true, value });

export const failure = <E>(error: E): Failure<E> => ({ ok: false, error });
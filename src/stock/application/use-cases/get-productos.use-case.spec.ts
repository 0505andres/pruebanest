import { Producto } from '../../domain/entities/producto.entity';
import { PRODUCTO_REPOSITORY_PORT, ProductoRepositoryPort } from '../../domain/ports/producto.repository-port';
import { GetProductosUseCase } from './get-productos.use-case';

describe('GetProductosUseCase', () => {
  let repository: jest.Mocked<ProductoRepositoryPort>;
  let useCase: GetProductosUseCase;

  const productos = [
    new Producto(
      'producto-1',
      'Teclado',
      10,
      'TEC-001',
      'data:image/png;base64,Zm90bw==',
      'Periféricos',
      25.5,
      true,
    ),
  ];

  beforeEach(() => {
    repository = {
      getProductos: jest.fn(),
      descontarStock: jest.fn(),
      reponerStock: jest.fn(),
    };
    useCase = new GetProductosUseCase(repository);
  });

  it('devuelve los productos activos y delega el filtro al repositorio', async () => {
    repository.getProductos.mockResolvedValue(productos);

    await expect(useCase.execute(true)).resolves.toEqual({
      ok: true,
      value: productos,
    });
    expect(repository.getProductos).toHaveBeenCalledWith(true);
  });

  it('devuelve los productos inactivos y delega el filtro al repositorio', async () => {
    repository.getProductos.mockResolvedValue([]);

    await expect(useCase.execute(false)).resolves.toEqual({
      ok: true,
      value: [],
    });
    expect(repository.getProductos).toHaveBeenCalledWith(false);
  });

  it('devuelve un error de validación si activos no es booleano', async () => {
    await expect(useCase.execute('true' as never)).resolves.toEqual({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'La variable activos debe ser booleana.',
      },
    });
    expect(repository.getProductos).not.toHaveBeenCalled();
  });

  it('devuelve un error de persistencia si falla el repositorio', async () => {
    repository.getProductos.mockRejectedValue(new Error('database unavailable'));

    await expect(useCase.execute(true)).resolves.toEqual({
      ok: false,
      error: {
        code: 'PERSISTENCE_ERROR',
        message: 'No fue posible consultar los productos.',
      },
    });
  });

  it('expone el token del repositorio para la inyección hexagonal', () => {
    expect(PRODUCTO_REPOSITORY_PORT).toBeDefined();
  });
});
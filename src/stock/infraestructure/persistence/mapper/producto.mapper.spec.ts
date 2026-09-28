import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';
import { ProductoMapper } from './producto.mapper';

describe('ProductoMapper', () => {
  it('convierte el decimal de PostgreSQL a number y conserva la foto Base64', () => {
    const raw = Object.assign(new ProductoOrmEntity(), {
      id: 'producto-1',
      nombre: 'Teclado',
      cantidad: 10,
      codigo: 'TEC-001',
      foto: 'data:image/png;base64,Zm90bw==',
      categoria: 'Periféricos',
      precio: '25.50',
      activo: true,
    });

    const producto = ProductoMapper.toDomain(raw);

    expect(producto.precio).toBe(25.5);
    expect(producto.foto).toBe(raw.foto);
    expect(producto.activo).toBe(true);
  });

  it('convierte el producto de dominio a persistencia con precio a dos decimales', () => {
    const producto = new Producto(
      'producto-1',
      'Teclado',
      10,
      'TEC-001',
      'data:image/png;base64,Zm90bw==',
      'Periféricos',
      25.5,
      false,
    );

    const raw = ProductoMapper.toPersistence(producto);

    expect(raw.precio).toBe('25.50');
    expect(raw.codigo).toBe(producto.codigo);
    expect(raw.activo).toBe(false);
  });
});
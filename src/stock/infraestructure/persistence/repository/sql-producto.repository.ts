import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoCantidad, ProductoRepositoryPort, ResultadoMovimientoStock } from '../../../domain/ports/producto.repository-port';
import { ProductoMapper } from '../mapper/producto.mapper';
import { ProductoOrmEntity } from '../entities/producto.orm-entity';

@Injectable()
export class SqlProductoRepository implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repository: Repository<ProductoOrmEntity>,
  ) {}

  async getProductos(activos: boolean): Promise<Producto[]> {
    const entities = await this.repository.find({ where: { activo: activos } });
    return entities.map((entity) => ProductoMapper.toDomain(entity));
  }

  async descontarStock(items: ProductoCantidad[]): Promise<ResultadoMovimientoStock> {
    try {
      return await this.repository.manager.transaction(async (manager) => {
        const productos = await this.cargarProductosBloqueados(manager, items);
        if (!productos.ok) return productos;

        for (const { producto, cantidad } of productos.value) {
          if (!producto.activo || producto.cantidad < cantidad) {
            return {
              ok: false,
              error: {
                code: 'STOCK_INSUFICIENTE',
                message: `Stock insuficiente para el producto ${producto.codigo}.`,
              },
            };
          }
        }

        for (const { producto, cantidad } of productos.value) {
          producto.cantidad -= cantidad;
          if (producto.cantidad === 0) producto.activo = false;
          await manager.save(producto);
        }
        return { ok: true };
      });
    } catch {
      return {
        ok: false,
        error: { code: 'PERSISTENCE_ERROR', message: 'No fue posible descontar el stock.' },
      };
    }
  }

  async reponerStock(items: ProductoCantidad[]): Promise<ResultadoMovimientoStock> {
    try {
      return await this.repository.manager.transaction(async (manager) => {
        const productos = await this.cargarProductosBloqueados(manager, items);
        if (!productos.ok) return productos;

        for (const { producto, cantidad } of productos.value) {
          producto.cantidad += cantidad;
          if (producto.cantidad > 0) producto.activo = true;
          await manager.save(producto);
        }
        return { ok: true };
      });
    } catch {
      return {
        ok: false,
        error: { code: 'PERSISTENCE_ERROR', message: 'No fue posible reponer el stock.' },
      };
    }
  }

  private async cargarProductosBloqueados(
    manager: EntityManager,
    items: ProductoCantidad[],
  ) {
    const cantidades = new Map<string, number>();
    for (const item of items) {
      cantidades.set(item.productoId, (cantidades.get(item.productoId) ?? 0) + item.cantidad);
    }

    const productos: { producto: ProductoOrmEntity; cantidad: number }[] = [];
    for (const [productoId, cantidad] of cantidades) {
      const producto = await manager.findOne(ProductoOrmEntity, {
        where: { id: productoId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!producto) {
        return {
          ok: false as const,
          error: {
            code: 'PRODUCTO_NOT_FOUND' as const,
            message: `No se encontró el producto ${productoId}.`,
          },
        };
      }
      productos.push({ producto, cantidad });
    }
    return { ok: true as const, value: productos };
  }
}
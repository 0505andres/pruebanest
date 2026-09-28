import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RegistrarClienteUseCase } from '../../application/use-cases/registrar-cliente.use-case';
import { BuscarClientePorDocumentoUseCase } from '../../application/use-cases/buscar-cliente-por-documento.use-case';
import { CrearClienteDto } from './dtos/crear-cliente.dto';

@Controller('clientes')
export class ClienteController {
    constructor(private readonly registrarClienteUseCase: RegistrarClienteUseCase,
        private readonly buscarClientePorDocumentoUseCase: BuscarClientePorDocumentoUseCase,
    ) { }


    /** 
     *POST /clientes 
     * Registra un nuevo cliente en el sistema */
    @Post() async registrar(@Body() dto: CrearClienteDto) {
        const cliente = await this.registrarClienteUseCase.execute({
            nombre: dto.nombre, numeroDocumento: dto.numeroDocumento, telefono: dto.telefono, correo: dto.correo, domicilio: dto.domicilio,
        });

        return { mensaje: 'Cliente registrado exitosamente', data: { id: cliente.id, nombre: cliente.nombre, numeroDocumento: cliente.numeroDocumento.value, correo: cliente.correo.value, telefono: cliente.telefono, domicilio: cliente.domicilio, }, };
    }

    /** 
     *GET /clientes/documento/:numeroDocumento 
     * Obtiene un cliente por su número de documento */ 
    @Get('documento/:numeroDocumento') async buscarPorDocumento(@Param('numeroDocumento') numeroDocumento: string) {
         const cliente = await this.buscarClientePorDocumentoUseCase.execute(numeroDocumento); 
         
         return { 
            data: { 
                id: cliente.id, 
                nombre: cliente.nombre, 
                numeroDocumento: cliente.numeroDocumento.value, 
                correo: cliente.correo.value, 
                telefono: cliente.telefono, 
                domicilio : cliente.domicilio, 
            }, 
        }; 
    }
}
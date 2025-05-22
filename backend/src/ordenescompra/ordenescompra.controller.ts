import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { OrdenescompraService } from './ordenescompra.service';
import { CreateOrdenescompraDto } from './dto/create-ordenescompra.dto';
import { UpdateOrdenescompraDto } from './dto/update-ordenescompra.dto';

@Controller('ordenescompra')
export class OrdenescompraController {
  constructor(private readonly ordenescompraService: OrdenescompraService) {}

  @Post()
  async create(@Body() createOrdenescompraDto: CreateOrdenescompraDto) {
    try {
      // Generar número de orden automático
      const lastOrder = await this.ordenescompraService.findAll();
      const nextNumber = lastOrder.length + 1;
      createOrdenescompraDto.numeroOrden = `ORD-${nextNumber.toString().padStart(3, '0')}`;
      
      return await this.ordenescompraService.create(createOrdenescompraDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear la orden: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.ordenescompraService.findAll();
    } catch (error) {
      throw new HttpException(
        `Error al obtener órdenes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('por-vendedor')
  async getOrdenesPorVendedor() {
    try {
      return await this.ordenescompraService.getOrdenesPorVendedor();
    } catch (error) {
      throw new HttpException(
        `Error al obtener órdenes por vendedor: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('vendedor/:vendedorId')
  async findByVendedor(@Param('vendedorId') vendedorId: string) {
    try {
      return await this.ordenescompraService.findByVendedor(vendedorId);
    } catch (error) {
      throw new HttpException(
        `Error al obtener órdenes del vendedor: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.ordenescompraService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener la orden: ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrdenescompraDto: UpdateOrdenescompraDto) {
    try {
      return await this.ordenescompraService.update(id, updateOrdenescompraDto);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la orden: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.ordenescompraService.remove(id);
      return { message: 'Orden eliminada correctamente' };
    } catch (error) {
      throw new HttpException(
        `Error al eliminar la orden: ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post('init-data')
  async initData() {
    try {
      await this.ordenescompraService.createSampleData();
      return { message: 'Datos de muestra creados correctamente' };
    } catch (error) {
      throw new HttpException(
        `Error al crear datos de muestra: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
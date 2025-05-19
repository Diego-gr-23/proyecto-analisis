import {   Controller, 
  Get, 
  Query, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Delete } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createVendedoreDto: CreateVendedoreDto) {
    try {
      const createdVendedore = await this.vendedoresService.create(createVendedoreDto);
      return {
        status: 'success',
        data: createdVendedore,
        message: 'Vendedor creado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al crear el vendedor: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.vendedoresService.findAll();
  }

  @Get(':dpi')
  findOne(@Param('dpi') dpi: string) {
    return this.vendedoresService.findOne(+dpi);
  }

  @Patch(':dpi')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('dpi') dpi: string, @Body() updateVendedoreDto: UpdateVendedoreDto) {
    try {
      const updatedVendedore = await this.vendedoresService.update(+dpi, updateVendedoreDto);
      return {
        status: 'success',
        data: updatedVendedore,
        message: 'Vendedor actualizado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al actualizar el vendedor: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':dpi')
  async remove(@Param('dpi') dpi: string) {
    try {
      const deletedVendedore = await this.vendedoresService.remove(+dpi);
      return {
        status: 'success',
        data: deletedVendedore,
        message: 'Vendedor eliminado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al eliminar el vendedor: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}

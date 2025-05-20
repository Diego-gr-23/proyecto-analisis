import {   
  Controller, 
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
  Delete 
} from '@nestjs/common';
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
  async findAll(@Query('dpi') dpi?: string) {
    try {
      // Si se proporciona un DPI, buscar por ese DPI
      if (dpi) {
        const vendedor = await this.vendedoresService.findOne(dpi);
        return {
          status: 'success',
          data: [vendedor], // Devolver como array para mantener consistencia
          message: 'Vendedor encontrado'
        };
      }
      
      // Si no hay DPI, devolver todos
      const vendedores = await this.vendedoresService.findAll();
      return {
        status: 'success',
        data: vendedores,
        message: 'Vendedores recuperados exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: 'error',
        message: 'Error al recuperar vendedores: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':dpi')
  async findOne(@Param('dpi') dpi: string) {
    try {
      const vendedor = await this.vendedoresService.findOne(dpi);
      return {
        status: 'success',
        data: vendedor,
        message: 'Vendedor encontrado'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: 'error',
        message: 'Error al recuperar el vendedor: ' + error.message,
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':dpi')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('dpi') dpi: string, @Body() updateVendedoreDto: UpdateVendedoreDto) {
    try {
      const updatedVendedore = await this.vendedoresService.update(dpi, updateVendedoreDto);
      return {
        status: 'success',
        data: updatedVendedore,
        message: 'Vendedor actualizado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: 'error',
        message: 'Error al actualizar el vendedor: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':dpi')
  async remove(@Param('dpi') dpi: string) {
    try {
      const deletedVendedore = await this.vendedoresService.remove(dpi);
      return {
        status: 'success',
        data: deletedVendedore,
        message: 'Vendedor eliminado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: 'error',
        message: 'Error al eliminar el vendedor: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
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
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/Create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() medicineData: CreateMedicineDto) {
    try {
      const createdMedicine = await this.medicineService.create(medicineData);
      return {
        status: 'success',
        data: createdMedicine,
        message: 'Medicamento creado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al crear el medicamento: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.medicineService.findAll();
  }

  @Get('search')
  async search(@Query('name') name: string) {
    if (!name) {
      throw new HttpException({
        status: 'error',
        message: 'El parámetro de búsqueda "name" es requerido',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      const results = await this.medicineService.findByName(name);
      return {
        status: 'success',
        data: results,
        count: results.length
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error en la búsqueda: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('provider')
  async findByProvider(@Query('name') provider: string) {
    if (!provider) {
      throw new HttpException({
        status: 'error',
        message: 'El parámetro "name" (proveedor) es requerido',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      const results = await this.medicineService.findByProvider(provider);
      return {
        status: 'success',
        data: results,
        count: results.length
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al buscar por proveedor: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateMedicineDto
  ) {
    try {
      const updatedMedicine = await this.medicineService.update(id, updateData);
      return {
        status: 'success',
        data: updatedMedicine,
        message: 'Medicamento actualizado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al actualizar el medicamento: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.medicineService.remove(id);
      return {
        status: 'success',
        message: 'Medicamento eliminado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al eliminar el medicamento: ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
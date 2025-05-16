import { Controller, Get, Query } from '@nestjs/common';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  async findAll() {
    return this.medicineService.findAll();
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return this.medicineService.findByName(name);
  }

  @Get('provider')
  async findByProvider(@Query('name') provider: string) {
    return this.medicineService.findByProvider(provider);
  }
}
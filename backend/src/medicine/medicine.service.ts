import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './schemas/medicine.schema';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
  ) {}

  // Obtener todos los medicamentos (paginados)
  async findAll(): Promise<Medicine[]> {
    return this.medicineModel.find().exec();
  }

  // Buscar medicamentos por nombre (devuelve un array)
  async findByName(name: string): Promise<Medicine[]> {
    return this.medicineModel.find({ name }).exec();
  }

  // Obtener medicamentos por proveedor
  async findByProvider(provider: string): Promise<Medicine[]> {
    return this.medicineModel.find({ provider }).exec();
  }
}
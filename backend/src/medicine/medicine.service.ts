import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './schemas/medicine.schema';
import { CreateMedicineDto } from './dto/Create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const createdMedicine = new this.medicineModel(createMedicineDto);
    return createdMedicine.save();
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineModel.find();
  }

  async findByName(name: string): Promise<Medicine[]> {
    return this.medicineModel.find({ 
      name: { $regex: name, $options: 'i' } 
    }).exec();
  }

  async findByProvider(provider: string): Promise<Medicine[]> {
    return this.medicineModel.find({ 
      provider: { $regex: provider, $options: 'i' } 
    }).exec();
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    const updatedMedicine = await this.medicineModel.findByIdAndUpdate(id, updateMedicineDto, { new: true }).exec();
    if (!updatedMedicine) {
      throw new Error('Medicine not found');
    }
    return updatedMedicine;
  }

  async remove(id: string): Promise<Medicine> {
    const deletedMedicine = await this.medicineModel.findByIdAndDelete(id).exec();
    if (!deletedMedicine) {
      throw new Error('Medicine not found');
    }
    return deletedMedicine;
  }
}
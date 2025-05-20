
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendedores } from './schemas/vendedore.schema';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectModel(Vendedores.name) private vendedoreModel: Model<Vendedores>,
  ) {}

  async create(createVendedoreDto: CreateVendedoreDto): Promise<Vendedores> {
    // Verificar si ya existe un vendedor con ese DPI
    const existingVendedor = await this.vendedoreModel.findOne({ dpi: createVendedoreDto.dpi }).exec();
    if (existingVendedor) {
      throw new Error('Ya existe un vendedor con ese DPI');
    }
    
    const createdVendedore = new this.vendedoreModel(createVendedoreDto);
    return createdVendedore.save();
  }

  async findAll(): Promise<Vendedores[]> {
    return this.vendedoreModel.find().exec();
  }

  async findOne(dpi: string): Promise<Vendedores> {
    const vendedor = await this.vendedoreModel.findOne({ dpi }).exec();
    if (!vendedor) {
      throw new NotFoundException(`Vendedor con DPI ${dpi} no encontrado`);
    }
    return vendedor;
  }

  async update(dpi: string, updateVendedoreDto: UpdateVendedoreDto): Promise<Vendedores> {
    const updatedVendedor = await this.vendedoreModel.findOneAndUpdate(
      { dpi },
      { $set: updateVendedoreDto },
      { new: true }
    ).exec();
    
    if (!updatedVendedor) {
      throw new NotFoundException(`Vendedor con DPI ${dpi} no encontrado`);
    }
    
    return updatedVendedor;
  }

  async remove(dpi: string): Promise<Vendedores> {
    const deletedVendedor = await this.vendedoreModel.findOneAndDelete({ dpi }).exec();
    
    if (!deletedVendedor) {
      throw new NotFoundException(`Vendedor con DPI ${dpi} no encontrado`);
    }
    
    return deletedVendedor;
  }
}
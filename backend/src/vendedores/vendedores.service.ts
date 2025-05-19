import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendedores} from './schemas/vendedore.schema';
import { CreateVendedoreDto } from './dto/create-vendedore.dto';
import { UpdateVendedoreDto } from './dto/update-vendedore.dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectModel(Vendedores.name) private vendedoreModel: Model<Vendedores>,
  ) {}
  async create(createVendedoreDto: CreateVendedoreDto): Promise<Vendedores> {
    const createdVendedore = new this.vendedoreModel(createVendedoreDto);
    return createdVendedore.save();
  }

  async findAll(): Promise<Vendedores[]> {
    return this.vendedoreModel.find();
  }

  async findOne(dpi: number) {
    return this.vendedoreModel.find({
      dpi: {$regex: dpi, $options: 'i'}
    }).exec();
  }

  async update(id: number, updateVendedoreDto: UpdateVendedoreDto) {
    const updatedVendedores = await this.vendedoreModel.findOneAndUpdate()
  }

  remove(id: number) {
    return `This action removes a #${id} vendedore`;
  }
}

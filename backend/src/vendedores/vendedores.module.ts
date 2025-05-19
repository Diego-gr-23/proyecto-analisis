import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendedores, VendedoresSchema } from './schemas/vendedore.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vendedores.name, schema: VendedoresSchema, collection: 'Vendedores' }, // Nombre exacto de tu colección
    ]),
  ],
  controllers: [VendedoresController],
  providers: [VendedoresService],
})
export class VendedoresModule {}

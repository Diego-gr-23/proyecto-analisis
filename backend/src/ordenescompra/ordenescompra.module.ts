import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenescompraService } from './ordenescompra.service';
import { OrdenescompraController } from './ordenescompra.controller';
import { Ordenescompra, OrdenescompraSchema } from './schemas/ordenescompra.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Ordenescompra.name, 
        schema: OrdenescompraSchema,
        collection: 'ordenescompra'
      }
    ])
  ],
  controllers: [OrdenescompraController],
  providers: [OrdenescompraService],
  exports: [OrdenescompraService]
})
export class OrdenescompraModule {}
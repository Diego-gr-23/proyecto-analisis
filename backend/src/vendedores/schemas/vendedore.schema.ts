import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VendedoresDocument = HydratedDocument<Vendedores>;

@Schema()
export class Vendedores {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  numeroCelular: number;

  @Prop({ required: true, unique: true })
  dpi: string;

  @Prop()
  descripcion: string;
}

export const VendedoresSchema = SchemaFactory.createForClass(Vendedores);

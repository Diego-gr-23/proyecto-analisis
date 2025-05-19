import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vendedores extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  celular: number;

  @Prop({ required: true })
  dpi: number;

  @Prop({ required: true })
  direccion: string;

  @Prop()
  imagen: string;
}
export const VendedoresSchema = SchemaFactory.createForClass(Vendedores);

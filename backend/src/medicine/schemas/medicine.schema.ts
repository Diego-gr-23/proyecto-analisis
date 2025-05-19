import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Medicine extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  type: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  provider: string;

  @Prop()
  descripcion: string;

  @Prop()
  expiryDate: string;

  @Prop()
  brand: string;

  @Prop()
  laboratory: string;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
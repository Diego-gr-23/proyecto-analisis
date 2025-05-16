import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Medicine' }) // Nombre EXACTO de tu colección
export class Medicine extends Document {
    @Prop({ type: Types.ObjectId })
    declare _id: Types.ObjectId; // Coincide con el ObjectId de MongoDB

  @Prop({ required: true })
  name: string;

  @Prop()
  type?: string; // El signo ? indica que es opcional (como en tus documentos)

  @Prop({ required: true })
  price: number;

  @Prop()
  provider?: string; // No todos tus documentos lo tienen
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
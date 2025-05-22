import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrdenescompraDocument = Ordenescompra & Document;

@Schema({ 
  collection: 'ordenescompra',
  timestamps: true 
})
export class Ordenescompra {
  @Prop({ required: true, unique: true })
  numeroOrden: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendedores' })
  vendedorId: Types.ObjectId;

  @Prop({ required: true })
  fechaCreacion: Date;

  @Prop({ required: true })
  fechaEntrega: Date;

  @Prop({ required: true })
  total: number;

  @Prop({ 
    required: true, 
    enum: ['pendiente', 'aprobada', 'procesando', 'enviada', 'entregada', 'cancelada'],
    default: 'pendiente'
  })
  estado: string;

  @Prop([{
    medicineId: { type: Types.ObjectId, ref: 'Medicine', required: true },
    nombreMedicina: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }])
  medicinas: {
    medicineId: Types.ObjectId;
    nombreMedicina: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];

  @Prop()
  observaciones?: string;

  @Prop({ default: false })
  urgente: boolean;
}

export const OrdenescompraSchema = SchemaFactory.createForClass(Ordenescompra);
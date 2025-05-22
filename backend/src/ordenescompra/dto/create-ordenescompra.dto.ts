import { IsString, IsNumber, IsDate, IsEnum, IsArray, IsBoolean, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Types } from 'mongoose';

class MedicinaDto {
  @IsMongoId()
  medicineId: Types.ObjectId;

  @IsString()
  nombreMedicina: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsNumber()
  subtotal: number;
}

export class CreateOrdenescompraDto {
  @IsString()
  numeroOrden: string;

  @IsString()
  descripcion: string;

  @IsMongoId()
  vendedorId: Types.ObjectId;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  fechaCreacion: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  fechaEntrega: Date;

  @IsNumber()
  total: number;

  @IsEnum(['pendiente', 'aprobada', 'procesando', 'enviada', 'entregada', 'cancelada'])
  @IsOptional()
  estado?: string = 'pendiente';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicinaDto)
  medicinas: MedicinaDto[];

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsBoolean()
  @IsOptional()
  urgente?: boolean = false;
}
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVendedoreDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  
  @IsNotEmpty()
  @IsNumber()
  numeroCelular: number;
  
  @IsNotEmpty()
  @IsNumber()
  dpi: number;
  
  @IsOptional()
  @IsString()
  descripcion?: string;
}
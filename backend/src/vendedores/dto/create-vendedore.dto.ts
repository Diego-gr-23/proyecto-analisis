import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVendedoreDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  
  @IsNotEmpty()
  @IsNumber()
  numeroCelular: number;
  
  @IsNotEmpty()
  @IsString()
  dpi: string;
  
  @IsOptional()
  @IsString()
  descripcion?: string;
}
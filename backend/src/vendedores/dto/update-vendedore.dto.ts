import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateVendedoreDto {
    @IsString()
    @IsOptional()
    nombre: string;
    
    @IsString()
    @IsOptional()
    apellido: string;
    
    @IsNumber()
    @IsOptional()
    celular: number;
    
    @IsNumber()
    @IsOptional()
    dpi: number;
    
    @IsString()
    @IsOptional()
    direccion: string;
    
    @IsOptional()
    @IsString()
    imagen?: string;
    
}

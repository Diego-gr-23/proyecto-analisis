import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateVendedoreDto {
    @IsString()
    nombre: string;
    
    @IsString()
    apellido: string;
    
    @IsNumber()
    celular: number;
    
    @IsNumber()
    dpi: number;
    
    @IsString()
    direccion: string;
    
    @IsOptional()
    @IsString()
    imagen?: string;
    
}

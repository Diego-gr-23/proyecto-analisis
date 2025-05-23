import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMedicineDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    provider?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    expiryDate?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    laboratory?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {    
    @IsString()
    @Length(1, 100)
    brand: string;

    @IsString()
    @Length(1, 100)
    model: string;
 
    @IsString()
    @Length(17, 17)
    @Transform((vin) => String(vin.value).toUpperCase())
    vin: string;

    @IsString()
    @Length(8, 9)
    licensePlate: string;    
}
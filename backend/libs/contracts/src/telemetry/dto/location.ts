import { IsDateString, IsNumber, IsString } from "class-validator";

export class SaveLocationDto {
    @IsString()
    vehicleId: string; 
    
    @IsNumber()
    lat: number; 
    
    @IsNumber()
    lng: number; 
    
    @IsNumber()
    speed: number; 

    @IsDateString()
    timestamp: string
}
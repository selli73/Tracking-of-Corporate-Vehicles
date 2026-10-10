import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString, Max, Min } from "class-validator";

export class SaveLocationDto {
    @IsString()
    @ApiProperty({ description: 'Vehicle identifier' })
    vehicleId: string; 
    
    @IsNumber()
    @ApiProperty({ description: 'Latitude', example: '55.7506' })
    lat: number; 
    
    @IsNumber()
    @ApiProperty({ description: 'User email address', example: '37.6175' })
    lng: number; 
    
    @IsNumber()
    @Min(0)
    @Max(500)
    @ApiProperty({ description: 'Vehicle speed', example: '60' })
    speed: number; 

    @IsDateString()
    @ApiProperty({ description: 'Location transmission time', example: 'jonJones@gmail.com' })
    timestamp: string
}
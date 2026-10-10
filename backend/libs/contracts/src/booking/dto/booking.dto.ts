import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";

export class CreateBookingDto {        
    
    @IsString()
    @ApiProperty({ description: 'Vehicle identifier'})
    vehicleId: string;

    @IsString()
    @ApiProperty({ description: 'Driver ID'})
    driverId: string;

    @IsString()
    @IsDateString()
    @ApiProperty({ description: 'booking start date'})
    startDate: string;

    @IsString()
    @IsDateString()
    @ApiProperty({ description: 'booking end date'})
    endDate: string;
}

export class StartOrFinishBookingDto {        
    @IsString()
    bookingId: string;
}
import { IsDateString, IsString } from "class-validator";

export class CreateBookingDto {        
    @IsString()
    vehicleId: string;

    @IsString()
    @IsDateString()
    startDate: string;

    @IsString()
    @IsDateString()
    endDate: string;
}

export class StartOrFinishBookingDto {        
    @IsString()
    bookingId: string;
}
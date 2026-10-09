import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetRatesDto {
    @IsString()
    @ApiProperty({ description: 'Company identifier'})
    companyId: string;
}
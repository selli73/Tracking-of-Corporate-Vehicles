import { IsString } from "class-validator";

export class GetRatesDto {
    @IsString()
    companyId: string;
}
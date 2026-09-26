import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length, MaxLength, ValidateNested } from "class-validator";

class CompanyDto {
    @IsString()
    @Length(1, 150)
    officialName: string;

    @IsString()
    @Length(1, 30)
    shortName: string;

    @IsString()
    @Length(10, 10)
    tin: string;

    @IsString()
    @Length(1, 150)
    registeredAddress: string;

    @IsOptional()
    @IsString()
    @Length(1, 150)
    actualAddress: string;

    @IsString()
    @Length(2, 15)
    phone: string;

    @IsEmail()
    @MaxLength(120)
    companyEmail: string;
}

class OwnerDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 72)
    password: string;

    @IsString()
    @Length(1, 25)
    name: string;

    @Length(1, 35)
    surname: string;
}

export class RegisterCompanyDto {
    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;

    @ValidateNested()
    @Type(() => OwnerDto)
    owner: OwnerDto;
}
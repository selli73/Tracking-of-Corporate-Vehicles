import { IsDecimal, IsOptional, IsString, Length, Matches } from "class-validator";
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

export class CreateTariffDto {
    @IsString()
    @Length(1, 40)
    name: string;
  
    @IsDecimal({ decimal_digits: '0,2' })
    @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
    minuteRate: string;
  
    @IsDecimal({ decimal_digits: '0,2' })
    @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
    kmRate: string;
  
    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' }) 
    @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
    dayRate?: string;

    @IsString()
    companyId: string;
}

export class UpdateTariffDto extends IntersectionType(
  PickType(CreateTariffDto, ['name', 'companyId'] as const),
  PartialType(OmitType(CreateTariffDto, ['name', 'companyId'] as const)),
) {}

export class DeleteTariffDto extends PickType(CreateTariffDto, ['name', 'companyId'] as const) {}
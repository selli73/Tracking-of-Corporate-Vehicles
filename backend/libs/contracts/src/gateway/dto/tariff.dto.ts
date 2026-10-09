import { IsDecimal, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

export class CreateTariffDto {
  @IsString()
  @Length(1, 40)
  @ApiProperty({ description: 'Tariff name'})
  name: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
  @ApiProperty({ description: 'rate per minute' })
  minuteRate: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
  @ApiProperty({ description: 'rate per km' })
  kmRate: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' }) 
  @Matches(/^\d{1,8}(\.\d{0,2})?$/, { message: 'The rate must be a positive number' })
  @ApiProperty({ description: 'daily rate' })
  dayRate: string;
}

export class UpdateTariffDto extends IntersectionType(
  PickType(CreateTariffDto, ['name'] as const),
  PartialType(OmitType(CreateTariffDto, ['name'] as const)),
) {}

export class DeleteTariffDto extends PickType(CreateTariffDto, ['name'] as const) {}
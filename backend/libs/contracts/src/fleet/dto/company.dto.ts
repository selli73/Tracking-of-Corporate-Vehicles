import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength, ValidateNested } from 'class-validator';
import { RegisterUserDto } from '../../gateway/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

class CompanyDto {
  @IsString()
  @Length(1, 150)
  @ApiProperty({ description: 'Official company name', example: 'ООО БНАЛ' })
  officialName: string;

  @IsString()
  @Length(1, 30)
  @ApiProperty({ description: 'Short company name' })
  shortName: string;

  @IsString()
  @ApiProperty({ description: 'Taxpayer Identification Number (TIN)', example: '1234567891' })
  @Matches(/^(\d{10}|\d{12})$/, { message: 'tin must contain exactly 10 digits' })
  tin: string;

  @IsString()
  @Length(1, 150)
  @ApiProperty({ description: 'Company registered addresss', example: 'США, г. Вашингтон, ул. Ленина д. 21' })
  registeredAddress: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiProperty({ description: 'Company actual address', example: 'США, г. Вашингтон, ул. Ленина д. 21' })
  actualAddress: string;

  @IsString()
  @ApiProperty({ description: 'Company phone number', example: '+79771723243' })
  @Matches(/^\+?\d{10,14}$/, { message: 'phone must contain 10-14 digits, optionally starting with +' })
  phone: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(120)
  @ApiProperty({ description: 'Company email', example: 'jonJones@gmail.com' })
  companyEmail: string;
}

export class RegisterCompanyDto {
  @ValidateNested()
  @Type(() => CompanyDto)
  @ApiProperty({ type: () => CompanyDto, description: 'Данные компании' })
  company: CompanyDto;

  @ValidateNested()
  @Type(() => RegisterUserDto)  
  @ApiProperty({ type: () => RegisterUserDto, description: 'Данные владельца' })
  owner: RegisterUserDto;
}

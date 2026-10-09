import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, MaxLength, ValidateNested } from 'class-validator';
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
  @Length(10, 10)
  @ApiProperty({ description: 'Taxpayer Identification Number (TIN)', example: '1234567891' })
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
  @Length(2, 15)
  @ApiProperty({ description: 'Company phone number', example: '+79771723243' })
  phone: string;

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

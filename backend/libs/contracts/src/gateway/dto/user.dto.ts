import { IsDate, IsDateString, IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;
}

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;

  @IsString()
  @Length(1, 25)
  name: string;

  @IsString()
  @Length(1, 35)
  surname: string;
}

export class RegisterDriverDto extends RegisterUserDto {
  @IsString()
  @Length(6, 6)
  driverLicenseNumber: string;

  @IsDateString()
  driverLicenseExpiresAt: Date;
}

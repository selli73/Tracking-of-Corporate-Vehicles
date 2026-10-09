import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ description: 'User email', example: 'jonJones@gmail.com' })
  email: string;

  @IsString()
  @Length(8, 72)
  @ApiProperty({ description: 'user password' })
  password: string;
}

export class RegisterUserDto extends LoginDto {
  @IsString()
  @Length(1, 25)
  @ApiProperty({ description: 'username', example: 'Bob' })
  name: string;

  @IsString()
  @Length(1, 35)
  @ApiProperty({ description: 'user surname', example: 'Ronaldo' })
  surname: string;
}

export class RegisterDriverDto extends RegisterUserDto {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ description: 'driver license number', example: '123456' })
  driverLicenseNumber: string;

  @IsDateString()
  @ApiProperty({ description: 'The driver license expires on' })
  driverLicenseExpiresAt: Date;
}

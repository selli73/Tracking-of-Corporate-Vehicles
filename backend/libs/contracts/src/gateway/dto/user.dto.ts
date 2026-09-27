import { IsEmail, IsString, Length } from "class-validator";

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

    @Length(1, 35)
    surname: string;
}
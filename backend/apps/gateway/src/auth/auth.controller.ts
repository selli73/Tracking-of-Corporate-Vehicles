import { LoginDto } from '@app/contracts';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this._authService.login(dto);
    }
}

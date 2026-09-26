import { LoginDto } from '@app/contracts';
import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) {}

    login(@Body() dto: LoginDto) {
        
    }
}

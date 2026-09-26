import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FLEET_PATTERNS, LoginDto } from '@app/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(FLEET_PATTERNS.USER_LOGIN)
  login(@Payload() data: LoginDto) {
    
  }
}

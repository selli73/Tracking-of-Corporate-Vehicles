import { Controller } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MessagePattern } from '@nestjs/microservices';
import { FLEET_PATTERNS } from '@app/contracts';
import { RegisterUserDto } from './dto/user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(FLEET_PATTERNS.RIGISTER_COMPANY_ADMIN)
  registerAdmin(dto: RegisterUserDto) {
    return this.userService.registerAdmin(dto);
  }
}

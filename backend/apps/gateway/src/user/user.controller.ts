import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Roles } from '../roles/roles.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';
import { RegisterUserDto, RegisterDriverDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register-admin')
  @Roles('OWNER')
  registerAdmin(@Request() req: IJwtUserRequest, @Body() dto: RegisterUserDto) {
    return this.userService.registerAdmin(dto, req.user.companyId);
  }

  @Post('register-manager')
  @Roles('OWNER', 'COMPANY_ADMIN')
  registerManager(@Request() req: IJwtUserRequest, @Body() dto: RegisterUserDto) {
    return this.userService.registerManager(dto, req.user.companyId);
  }

  @Post('register-driver')
  @Roles('OWNER', 'COMPANY_ADMIN', 'MANAGER')
  registerDriver(@Request() req: IJwtUserRequest, @Body() dto: RegisterDriverDto) {
    return this.userService.registerDriver(dto, req.user.companyId);
  }
}

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Roles } from '../roles/roles.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';
import { RegisterUserDto, RegisterDriverDto, Role } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register-admin')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Register admin' }) @ApiResponse({ status: 201, description: 'The admin is registered' })
  registerAdmin(@Request() req: IJwtUserRequest, @Body() dto: RegisterUserDto) {
    return this.userService.registerAdmin(dto, req.user.companyId);
  }

  @Post('register-manager')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Register manager' }) @ApiResponse({ status: 201, description: 'The manager is registered' })
  registerManager(@Request() req: IJwtUserRequest, @Body() dto: RegisterUserDto) {
    return this.userService.registerManager(dto, req.user.companyId);
  }

  @Post('register-driver')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Register driver' }) @ApiResponse({ status: 201, description: 'The driver is registered' })
  registerDriver(@Request() req: IJwtUserRequest, @Body() dto: RegisterDriverDto) {
    return this.userService.registerDriver(dto, req.user.companyId);
  }
}

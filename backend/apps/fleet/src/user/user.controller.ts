import { Controller } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FLEET_PATTERNS, UserContext } from '@app/contracts';
import { RegisterDriverDto, RegisterUserDto } from './dto/user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}  

  @MessagePattern(FLEET_PATTERNS.REGISTER_COMPANY_ADMIN)
  registerAdmin(dto: RegisterUserDto) {
    return this._userService.registerAdmin(dto);
  }

  @MessagePattern(FLEET_PATTERNS.REGISTER_COMPANY_MANAGER)
  registerManager(dto: RegisterUserDto) {
    return this._userService.registerManager(dto);
  }

  @MessagePattern(FLEET_PATTERNS.REGISTER_COMPANY_DRIVER)
  registerDriver(dto: RegisterDriverDto) {
    return this._userService.registerDriver(dto);
  }

  @MessagePattern(FLEET_PATTERNS.GET_ALL_USERS) 
  getAllUser(@Payload() dto: UserContext) {
    return this._userService.getAllUser(dto);
  }

  @MessagePattern(FLEET_PATTERNS.GET_ME)
  me(@Payload() dto: UserContext) {
    return this._userService.me(dto);
  }

  @MessagePattern(FLEET_PATTERNS.GET_DRIVER_EMAIL)
  getUserDate(@Payload() dto: { driverId: string }) {
    return this._userService.getUserEmail(dto);
  }
}

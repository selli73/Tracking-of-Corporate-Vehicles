import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateVehicleDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private _vehicleService: VehiclesService) {}

  @Post('create-vehicle')
  @Roles('OWNER', 'COMPANY_ADMIN')
  createVehicleGateway(@Req() req: IJwtUserRequest, @Body() dto: CreateVehicleDto) {
    return this._vehicleService.createVehicle(dto, { userId: req.user.userId, role: req.user.role, companyId: req.user.companyId });
  }

  @Get('get-all-vehicle')
  @UseGuards(JwtAuthGuard)
  getAllVehicle() {
    return this._vehicleService.getAllVehicle();
  }
}

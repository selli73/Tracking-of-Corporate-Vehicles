import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateVehicleDto, Role } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { VehiclesService } from './vehicles.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private _vehicleService: VehiclesService) {}

  @Post('create-vehicle')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Create vehicle'}) @ApiResponse({ status: 201, description: 'The car has been created' })
  createVehicleGateway(@Req() req: IJwtUserRequest, @Body() dto: CreateVehicleDto) {
    return this._vehicleService.createVehicle(dto, { userId: req.user.userId, role: req.user.role, companyId: req.user.companyId });
  }

  @Get('get-all-vehicle')
  @ApiOperation({ summary: 'Get a list of cars'}) @ApiResponse({ status: 201, description: 'List of cars received' })
  getAllVehicle(@Req() req: IJwtUserRequest) {
    return this._vehicleService.getAllVehicle(req.user.companyId);
  }
}

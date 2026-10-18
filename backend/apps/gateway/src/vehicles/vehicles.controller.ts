import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateVehicleDto, Role, LinkTariffToVehicleDto } from '@app/contracts';
import type { IJwtUserRequest, VehicleStatus } from '@app/contracts';
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
  createVehicle(@Req() req: IJwtUserRequest, @Body() dto: CreateVehicleDto) {
    return this._vehicleService.createVehicle(dto, { userId: req.user.userId, role: req.user.role, companyId: req.user.companyId });
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Get a list of cars'}) @ApiResponse({ status: 201, description: 'List of cars received' })
  getAllVehicle(@Req() req: IJwtUserRequest) {
    return this._vehicleService.getAllVehicle(req.user.companyId);
  }

  @Patch(':id/update-status')
  updateStatus(@Req() req: IJwtUserRequest, @Param('id') vehicleId: string, @Body() dto: { status: VehicleStatus }) {
    return this._vehicleService.updateStatus({ vehicleId, status: dto.status }, req.user);
  }

  @Patch('link-tariff-to-vehicle')
  @ApiOperation({ summary: 'Linking the tariff to the vehicle' }) @ApiResponse({ status: 200, description: 'The tariff has been successfully linked to the vehicle' })
  linkTariffToVehicle(@Req() req: IJwtUserRequest, @Body() dto: LinkTariffToVehicleDto) {
    return this._vehicleService.linkTariffToVehicle(dto, req.user);
  }
}
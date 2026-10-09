import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { Role, SaveLocationDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { CreateGeofenceDto } from '@app/contracts';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator.js';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';

@Controller('telemetry')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TelemetryController {
  constructor(private readonly _telemetryService: TelemetryService) {}

  @Post('createGeofence')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN)
  createGeofenceForCompany(@Req() req: IJwtUserRequest, @Body() dto: CreateGeofenceDto) {
    console.log('asda')
    return this._telemetryService.createGeofenceForCompany(req.user, dto);
  }

  @Post('saveLocation')
  @ApiOperation({ summary: 'Save the vehicle current location'}) @ApiResponse({ status: 201, description: 'Current vehicle location saved' })
  saveLocation(@Body() dto: SaveLocationDto) {
    return this._telemetryService.saveLocation(dto);
  }

  
}

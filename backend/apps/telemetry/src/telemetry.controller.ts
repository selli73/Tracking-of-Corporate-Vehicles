import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {  SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';
import type { RpcRequest, CreateGeofenceDto } from '@app/contracts';

@Controller()
export class TelemetryController {
  constructor(private readonly _telemetryService: TelemetryService) {}

  @MessagePattern(TELEMETRY_PATTERNS.CREATE_GEOFENCE)
  createGeofenceForCompany(@Payload() dto: RpcRequest<CreateGeofenceDto>) {
    console.log('hello')
    return this._telemetryService.createGeofenceForCompany(dto);
  }

  @EventPattern(TELEMETRY_PATTERNS.SAVE_LOCATION)
  handleSaveLocation(@Payload() dto: SaveLocationDto) {
    return this._telemetryService.handleSaveLocation(dto);
  }

  @MessagePattern('calculate_distance')
  calculateDistance(@Payload() dto: { vehicleId: string, startTime: string, endTime: string }) {
    return this._telemetryService.calculateDistance(dto);
  }
}

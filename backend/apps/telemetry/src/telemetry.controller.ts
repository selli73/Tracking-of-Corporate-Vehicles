import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {  SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';
import type { RpcRequest, CreateGeofenceDto, VehicleReleasedEvent } from '@app/contracts';

@Controller()
export class TelemetryController {
  constructor(private readonly _telemetryService: TelemetryService) {}

  @MessagePattern(TELEMETRY_PATTERNS.CREATE_GEOFENCE)
  createGeofenceForCompany(@Payload() dto: RpcRequest<CreateGeofenceDto>) {
    return this._telemetryService.createGeofenceForCompany(dto);
  }

  @EventPattern(TELEMETRY_PATTERNS.SAVE_LOCATION)
  handleSaveLocation(@Payload() dto: RpcRequest<SaveLocationDto>) {
    return this._telemetryService.handleSaveLocation(dto);
  }

  @MessagePattern(TELEMETRY_PATTERNS.CALCULATE_DISTANCE)
  calculateDistance(@Payload() dto: VehicleReleasedEvent) {
    console.log('это telemetry!');
    return this._telemetryService.calculateDistance(dto);
  }
}

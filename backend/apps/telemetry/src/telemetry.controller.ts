import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {  SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';
import type { RpcRequest, CreateGeofenceDto, VehicleReleasedEvent, UserContext } from '@app/contracts';

@Controller()
export class TelemetryController {
  constructor(private readonly _telemetryService: TelemetryService) {}

  @MessagePattern(TELEMETRY_PATTERNS.CREATE_GEOFENCE)
  createGeofenceForCompany(@Payload() dto: RpcRequest<CreateGeofenceDto>) {
    return this._telemetryService.createGeofenceForCompany(dto);
  }

  @MessagePattern(TELEMETRY_PATTERNS.GET_GEOFENCES)
  getGeofences(@Payload() dto: UserContext) {
    return this._telemetryService.getGeofences(dto);
  }

  @MessagePattern(TELEMETRY_PATTERNS.GET_CURRENT_LOCATIONS)
  getCurrentvehiclesLocations(@Payload() dto: UserContext) {
    return this._telemetryService.getCurrentvehiclesLocations(dto);
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

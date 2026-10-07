import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';

@Controller()
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @EventPattern(TELEMETRY_PATTERNS.SAVE_LOCATION)
  handleSaveLocation(@Payload() dto: SaveLocationDto) {
    return this.telemetryService.handleSaveLocation(dto);
  }
}

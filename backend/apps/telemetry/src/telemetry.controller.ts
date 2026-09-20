import { Controller } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { MessagePattern } from '@nestjs/microservices';
import { TELEMETRY_PATTERNS } from '@app/contracts/telemetry.patterns.js'

@Controller()
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @MessagePattern(TELEMETRY_PATTERNS.PING)
  ping() {
    return { service: 'telemetry', status: 'ok' }
  }
}

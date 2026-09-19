import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';

@Controller()
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  getHello() {
    return this.telemetryService.getHello();
  }
}

import { Controller, Post } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { SaveLocationDto } from '@app/contracts';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly _telemetryService: TelemetryService) {}

  @Post('saveLocation')
  saveLocation(dto: SaveLocationDto) {
    return this._telemetryService.saveLocation(dto);
  }
}

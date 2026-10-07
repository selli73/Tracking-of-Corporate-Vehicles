import { TELEMETRY_SERVICE, TELEMETRY_PATTERNS, SaveLocationDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TelemetryService {
    constructor(@Inject(TELEMETRY_SERVICE) private _clientTelemetry: ClientProxy) {}

    saveLocation(data: SaveLocationDto) {
        this._clientTelemetry.emit(TELEMETRY_PATTERNS.SAVE_LOCATION, data);

        return {
        status: 'accepted'
        };
    }
}

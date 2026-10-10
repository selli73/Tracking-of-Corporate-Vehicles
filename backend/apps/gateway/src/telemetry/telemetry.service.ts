import { TELEMETRY_SERVICE, TELEMETRY_PATTERNS, SaveLocationDto, CreateGeofenceDto, RpcRequest, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class TelemetryService {
    constructor(@Inject(TELEMETRY_SERVICE) private _clientTelemetry: ClientProxy) {}

    async createGeofenceForCompany(user: UserContext, data: CreateGeofenceDto) {
        const response = await firstValueFrom(
            this._clientTelemetry.send<any, RpcRequest<CreateGeofenceDto>>(TELEMETRY_PATTERNS.CREATE_GEOFENCE, { user, data })
            .pipe(timeout(4000))
        );

        return response;
    }

    async saveLocation(user: UserContext, data: SaveLocationDto) {
        this._clientTelemetry.emit<any, RpcRequest<SaveLocationDto>>(TELEMETRY_PATTERNS.SAVE_LOCATION, { user, data });

        return {
            status: 'accepted'
        };
    }   
}

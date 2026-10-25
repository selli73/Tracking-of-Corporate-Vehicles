import { TELEMETRY_SERVICE, TELEMETRY_PATTERNS, SaveLocationDto, CreateGeofenceDto, RpcRequest, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { FleetMapGateway } from '../fleet-map/fleet-map.gateway';

@Injectable()
export class TelemetryService {
    constructor(@Inject(TELEMETRY_SERVICE) private _clientTelemetry: ClientProxy, private _fleetMapGateway: FleetMapGateway) {}

    async createGeofenceForCompany(user: UserContext, data: CreateGeofenceDto) {
        const response = await firstValueFrom(
            this._clientTelemetry.send<any, RpcRequest<CreateGeofenceDto>>(TELEMETRY_PATTERNS.CREATE_GEOFENCE, { user, data })
            .pipe(timeout(4000))
        );

        return response;
    }

    async getGeofences(user: UserContext) {
        const response = await firstValueFrom(
            this._clientTelemetry.send<any, UserContext>(TELEMETRY_PATTERNS.GET_GEOFENCES, user)
            .pipe(timeout(4000))
        );

        return response;
    }

    async saveLocation(user: UserContext, data: SaveLocationDto) {
        this._clientTelemetry.emit<any, RpcRequest<SaveLocationDto>>(TELEMETRY_PATTERNS.SAVE_LOCATION, { user, data });
        
        this._fleetMapGateway.broadcastLocation('location', {
            companyId: user.companyId,
            vehicleId: data.vehicleId,
            lat: data.lat,
            lng: data.lng,
            speed: data.speed,            
            timestamp: data.timestamp
        });
        
        return {
            status: 'accepted'
        };
    }   

   async getCurrentvehiclesLocations(user: UserContext) {
        const response = await firstValueFrom(this._clientTelemetry.send<any, UserContext>(TELEMETRY_PATTERNS.GET_CURRENT_LOCATIONS, { ...user })
            .pipe(timeout(4000)));

        return response;
    }
}

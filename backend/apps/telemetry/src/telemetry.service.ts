import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ERROR_CODES, SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { GeofenceViolation } from './events/geofenceViolation';

@Injectable()
export class TelemetryService {

  private _logger = new Logger(TelemetryService.name);
  
  constructor(private _prismaService: PrismaService, @Inject('ALERTS_CLIENT') private _clientAlerts: ClientProxy) {}

  async handleSaveLocation(data: SaveLocationDto) {

    if (data.speed < 0) {
      this._logger.log({
        code: ERROR_CODES.TELEMETRY_SPEED_INCORRECT,
        message: 'The vehicle speed is incorrect'
      });
      return;
    }    


    await this._prismaService.$executeRaw`
      INSERT INTO "VehicleLocation" ("id", "vehicleId", "speed", "timestamp", "location", "createdAt")
      VALUES (
        gen_random_uuid(),
        ${data.vehicleId},
        ${data.speed},
        ${new Date(data.timestamp)},
        ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326),
        NOW()
      )
    `;

    const zones: { id: string, name: string }[] = await this._prismaService.$queryRaw`SELECT id, name FROM "Geofence"
      WHERE ST_Contains(polygon, ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)) 
    `;

    const isInsideZone = zones.length > 0;

    if (!isInsideZone) {
      this._clientAlerts.emit(TELEMETRY_PATTERNS.GEOFENCE_VIOLATION, new GeofenceViolation(data.vehicleId, data.timestamp))
    }

    
  }
}

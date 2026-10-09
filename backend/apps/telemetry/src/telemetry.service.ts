import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateGeofenceDto, ERROR_CODES, RpcRequest, SaveLocationDto, TELEMETRY_PATTERNS } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { GeofenceViolation } from './events/geofenceViolation';

@Injectable()
export class TelemetryService {

  private _logger = new Logger(TelemetryService.name);
  
  constructor(private _prismaService: PrismaService, @Inject('ALERTS_CLIENT') private _clientAlerts: ClientProxy) {}

  async createGeofenceForCompany(dto: RpcRequest<CreateGeofenceDto>) {
    // Логика сохранения polygon в postgres    

    const ring = dto.data.polygon.map(({ lat, lng }) => `${lng} ${lat}`);
    console.log(ring);

    // await this._prismaService.$executeRaw`
    //   INSERT INTO "Geofence" ("id", "name", "polygon", "companyId")
    //   VALUES (
    //     gen_random_uuid(),
    //     ${data.data.name},
    //     ST_MakePolygon( ST_GeomFromText('POLYGON(' + ${data.data.polygon} +')', 4326)),
    //     ${data.user.companyId}
    //   )
    // `;
  }

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

    return {
      success: true
    };
  }

  async calculateDistance(data: { vehicleId: string, startTime: string, endTime: string }) {
    const result: { distance_meters?: number }[] = await this._prismaService.$queryRaw`
      SELECT
        ST_Length(ST_MakeLine(location)::geography) as distance_meters
      FROM (
        SELECT location 
        FROM "VehicleLocation"
        WHERE "vehicleId" = ${data.vehicleId}
          AND timestamp >= ${new Date(data.startTime)}
          AND timestamp <= ${new Date(data.endTime)}
        ORDER BY timestamp ASC
      ) as ordered_points;
    `;

    const metres = result[0]?.distance_meters || 0;

    return {
      distanceKm: metres / 1000
    };
  }
}

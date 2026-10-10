import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateGeofenceDto, ERROR_CODES, RpcRequest, SaveLocationDto, TELEMETRY_PATTERNS, VehicleReleasedEvent } from '@app/contracts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GeofenceViolation } from './events/geofenceViolation';

@Injectable()
export class TelemetryService {

  private _logger = new Logger(TelemetryService.name);
  
  constructor(private _prismaService: PrismaService, @Inject('ALERTS_CLIENT') private _clientAlerts: ClientProxy) {}

  async createGeofenceForCompany({ user, data }: RpcRequest<CreateGeofenceDto>) {
    
    const existPolygon = await this._prismaService.geofence.findUnique({
      where: {
        companyId_name: {
          companyId: user.companyId,
          name: data.name
        }
      }
    });

    if (existPolygon) {
      throw new RpcException({
        code: ERROR_CODES.GEOFENCE_UNIQUENESS_VIOLATION,
        message: 'A geofence has already been created for your company'
      });
    }

    const first = data.polygon[0];
    const last = data.polygon[data.polygon.length - 1];
    const points = first.lat === last.lat && first.lng === last.lng ? data.polygon : [...data.polygon, first];

    const ring = points.map(({ lat, lng }) => `${lng} ${lat}`).join(', ');
    const wkt = `POLYGON((${ring}))`;
    
    const geofence = await this._prismaService.$executeRaw`
      INSERT INTO "Geofence" ("id", "name", "polygon", "companyId")
      SELECT gen_random_uuid(), ${data.name}, t.g, ${user.companyId}
      FROM (SELECT ST_GeomFromText(${wkt}, 4326) AS g) t
      WHERE ST_IsValid(t.g)
    `;

    if (geofence === 0) {
      throw new RpcException({
        code: ERROR_CODES.POLYGON_INVALID,
        message: 'Polygon is incorrect'
      });
    }

    return {
      success: true
    }
  }

  async handleSaveLocation({user, data}: RpcRequest<SaveLocationDto>) {
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

    const [row] = await this._prismaService.$queryRaw<{ total: bigint; inside: bigint }[]>`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (
          WHERE ST_Contains(
            polygon,
            ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)
          )
        ) AS inside
      FROM "Geofence"
      WHERE "companyId" = ${user.companyId}
    `;

    if (row.total > 0n && row.inside === 0n) {
      this._clientAlerts.emit(
        TELEMETRY_PATTERNS.GEOFENCE_VIOLATION,
        new GeofenceViolation(data.vehicleId, data.timestamp),
      );
    }
  }

  async calculateDistance(data: VehicleReleasedEvent) {
    console.log(data);
    const result: { distance_meters?: number }[] = await this._prismaService.$queryRaw`
      SELECT
        ST_Length(ST_MakeLine(location)::geography) as distance_meters
      FROM (
        SELECT location 
        FROM "VehicleLocation"
        WHERE "vehicleId" = ${data.vehicleId}
          AND timestamp >= ${new Date(data.startTime)}
          AND timestamp <= ${new Date(data.finishedAt)}
        ORDER BY timestamp ASC
      ) as ordered_points;
    `;

    console.log(result);
    const metres = result[0]?.distance_meters || 0;

    return {
      distanceKm: metres / 1000
    };
  }
}

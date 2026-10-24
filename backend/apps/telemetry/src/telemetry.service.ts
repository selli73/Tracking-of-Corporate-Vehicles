import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { BOOKING_PATTERNS, BOOKING_SERVICE, CreateGeofenceDto, ERROR_CODES, FLEET_PATTERNS, FLEET_SERVICE, NOTIFICATION_SERVICE, RpcRequest, SaveLocationDto, TELEMETRY_PATTERNS, UserContext, VehicleReleasedEvent } from '@app/contracts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GeofenceViolation } from '@app/contracts';
import { firstValueFrom } from 'rxjs';

interface GeofenceRow {
  id: string;
  name: string;
  geometry: { type: string, coordinates: number[][][] }
}
@Injectable()
export class TelemetryService {

  private _logger = new Logger(TelemetryService.name);
  
  constructor(private _prismaService: PrismaService, @Inject(NOTIFICATION_SERVICE) private _clientNotification: ClientProxy,
    @Inject(FLEET_SERVICE) private _clientFleet: ClientProxy, @Inject(BOOKING_SERVICE) private _clientBooking: ClientProxy) {}

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
        message: 'Use a unique name for the company geofence.'
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
    };
  }

  async getGeofences(data: UserContext) {
    const rows = await this._prismaService.$queryRaw<GeofenceRow[]>`
      SELECT id, name, ST_AsGeoJSON(polygon)::json AS geometry
      FROM "Geofence"
      WHERE "companyId" = ${data.companyId}
      ORDER BY name
    `;

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        points: row.geometry.coordinates[0]
          .slice(0, -1)
          .map(([lng, lat]) => ({ lat, lng }))
      })
    );
  }

  async getCurrentvehiclesLocations(user: UserContext) {
    const vehiclesId = await firstValueFrom(this._clientFleet.send<string[]>(FLEET_PATTERNS.GET_COMPANY_VEHICLE_IDS, { ...user }));

    if (vehiclesId.length === 0) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'The company has no vehicles'
      });
    }

    return this._prismaService.$queryRaw`
      SELECT DISTINCT ON ("vehicleId")
        "vehicleId",
        speed,
        "timestamp",
        ST_Y(location) AS lat,
        ST_X(location) AS lng
      FROM "VehicleLocation"
      WHERE "vehicleId" = ANY(${vehiclesId}::text[])
      ORDER BY "vehicleId", "timestamp" DESC      
    `
  }

  async handleSaveLocation({user, data}: RpcRequest<SaveLocationDto>) {
    await firstValueFrom(this._clientBooking.send(BOOKING_PATTERNS.CHECK_DRIVER_STATUS, { vehicleId: data.vehicleId, driverId: user.userId }));
    this._logger.log(`Автомобиль ${data.vehicleId} передвинулся по lat ${data.lat} по lng ${data.lng}`);
    const now = new Date();

    await this._prismaService.$executeRaw`
      INSERT INTO "VehicleLocation" ("id", "vehicleId", "speed", "timestamp", "location", "createdAt")
      VALUES (
        gen_random_uuid(),
        ${data.vehicleId},
        ${data.speed},
        ${now},
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
      this._clientNotification.emit(
        TELEMETRY_PATTERNS.GEOFENCE_VIOLATION,
        new GeofenceViolation(data.vehicleId, now.toDateString()),
      );
    }
  }

  async calculateDistance(data: VehicleReleasedEvent) {
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

    const metres = result[0]?.distance_meters || 0;

    return {
      distanceKm: metres / 1000
    };
  }
}

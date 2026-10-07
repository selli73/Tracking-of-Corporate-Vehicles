import { TELEMETRY_PATTERNS } from '@app/contracts';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GeofenceViolation } from '../events/geofenceViolation';

@Controller('alerts')
export class AlertsController {
    
    private _logger = new Logger(AlertsController.name);

    @EventPattern(TELEMETRY_PATTERNS.GEOFENCE_VIOLATION)
    eventGeofenceViolation(@Payload() dto: GeofenceViolation) {
        this._logger.warn(`Транспортное средство ${dto.vehicleId} выехало за границу!!!`);
    }
}

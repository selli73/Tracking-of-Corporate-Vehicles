import { Controller } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FLEET_PATTERNS } from '@app/contracts';

@Controller('vehicle')
export class VehicleController {
    
    constructor(private _vehicleService: VehicleService) {}

    @MessagePattern(FLEET_PATTERNS.CREATE_VEHICLE)
    create(@Payload() data: any) {
        return this._vehicleService.create(data);
    }

    @MessagePattern(FLEET_PATTERNS.GET_ALL_VEHICLE)
    getAll() {
        return this._vehicleService.getAll();
    }
}

import { Controller, Logger } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BOOKING_PATTERNS, CreateVehicleDto, FLEET_PATTERNS } from '@app/contracts';
import type { RpcRequest } from '@app/contracts';
import { VehicleReleasedEvent } from '../events/vehicleReleased';

@Controller('vehicle')
export class VehicleController {

  logger = new Logger(VehicleController.name)

  constructor(private _vehicleService: VehicleService) {}

  @MessagePattern(FLEET_PATTERNS.CREATE_VEHICLE)
  create(@Payload() dto: RpcRequest<CreateVehicleDto>) {
    return this._vehicleService.create(dto.data, { ...dto.user });
  }

  @MessagePattern(FLEET_PATTERNS.GET_ALL_VEHICLE)
  getAll() {
    return this._vehicleService.getAll();
  }

  @MessagePattern(FLEET_PATTERNS.CHECH_VEHICLE_STATUS)
  checkVehicleStatus(dto: { vehicleId: string }) {
    return this._vehicleService.checkVehicleStatus(dto);
  }

  @EventPattern<{ }>(BOOKING_PATTERNS.BOOKING_CREATED)
  vehicleBooked(@Payload() dto: { vehicleId: string, bookingId: string }) {
    this.logger.log(`Автомобиль с id ${dto.vehicleId} забронировано. Id бронирования ${dto.bookingId}`);
  }

  @EventPattern<{  }>(FLEET_PATTERNS.BOOKING_STARTED)
  async vehicleStarted(@Payload() dto: VehicleReleasedEvent) {
    await this._vehicleService.vehicleStarted(dto);
  }

  @EventPattern<{  }>(FLEET_PATTERNS.BOOKING_FINISHED)
  async vehicleReleased(@Payload() dto: VehicleReleasedEvent) {
    await this._vehicleService.vehicleReleased(dto);
  }
}

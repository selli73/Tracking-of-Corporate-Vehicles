import { Controller, Logger, Patch } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BOOKING_PATTERNS, CreateVehicleDto, FLEET_PATTERNS } from '@app/contracts';
import type { LinkTariffToVehicleDto, RpcRequest } from '@app/contracts';
import { VehicleReleasedEvent } from '../events/vehicleReleased';
import { VehicleStartedEvent } from '../events/vehicleStarted';
import { BookingCreatedEvent } from '../events/bookingCreated';

@Controller()
export class VehicleController {

  logger = new Logger(VehicleController.name)

  constructor(private _vehicleService: VehicleService) {}

  @MessagePattern(FLEET_PATTERNS.CREATE_VEHICLE)
  create(@Payload() dto: RpcRequest<CreateVehicleDto>) {
    return this._vehicleService.create(dto.data, { ...dto.user });
  }

  @MessagePattern(FLEET_PATTERNS.LINK_TARIFF_TO_VEHICLE)
  linkTariffToVehicle(@Payload() dto: RpcRequest<LinkTariffToVehicleDto>) {
    return this._vehicleService.linkTariffToVehicle(dto.data, dto.user);
  }

  @MessagePattern(FLEET_PATTERNS.GET_ALL_VEHICLE)
  getAll(@Payload() data: { companyId: string }) {
    return this._vehicleService.getAll(data.companyId);
  }

  @MessagePattern(FLEET_PATTERNS.CHECH_VEHICLE_STATUS)
  checkVehicleStatus(@Payload() dto: { companyId: string, vehicleId: string }) {
    return this._vehicleService.checkVehicleStatus(dto);
  }

  @EventPattern(BOOKING_PATTERNS.CREATED_BOOKING)
  vehicleBooked(@Payload() dto: BookingCreatedEvent) {
    this.logger.log(`Автомобиль с id ${dto.vehicleId} забронировано. Id бронирования ${dto.bookingId}`);
  }

  @EventPattern(BOOKING_PATTERNS.BOOKING_STARTED)
  async vehicleStarted(@Payload() dto: VehicleStartedEvent) {
    await this._vehicleService.vehicleStarted(dto);
  }

  @EventPattern(BOOKING_PATTERNS.BOOKING_FINISHED)
  async vehicleReleased(@Payload() dto: VehicleReleasedEvent) {
    await this._vehicleService.vehicleReleased(dto);
  }
}

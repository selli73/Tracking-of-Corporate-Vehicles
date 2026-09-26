import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateVehicleDto, FLEET_PATTERNS, FLEET_SERVICE } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Controller('vehicles')
export class VehiclesController {
  constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}
  
  @Post('create-vehicle')
  createVehicleGateway(@Body() data: CreateVehicleDto) {
    return this._clientFleet.send(FLEET_PATTERNS.CREATE_VEHICLE, data).pipe(timeout(10000));
  }

  @Get('get-all-vehicle')
  getAllVehicle() {
    return this._clientFleet.send(FLEET_PATTERNS.GET_ALL_VEHICLE, {});
  }
}

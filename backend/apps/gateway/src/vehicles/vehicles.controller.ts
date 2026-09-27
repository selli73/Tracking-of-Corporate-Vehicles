import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateVehicleDto, FLEET_PATTERNS, FLEET_SERVICE } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}
  
  @Post('create-vehicle')
  createVehicleGateway(@Body() data: CreateVehicleDto) {
    return this._clientFleet.send(FLEET_PATTERNS.CREATE_VEHICLE, data).pipe(timeout(10000));
  }

  @Get('get-all-vehicle')
  @UseGuards(JwtAuthGuard)
  getAllVehicle() {
    return this._clientFleet.send(FLEET_PATTERNS.GET_ALL_VEHICLE, {});
  }
}

import { Controller, Get } from '@nestjs/common';
import { FleetService } from './fleet.service.js';

@Controller()
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get()
  async getHello() {
    return this.fleetService.getHello(); 
  }
}

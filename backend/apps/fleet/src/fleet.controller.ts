import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FLEET_PATTERNS } from '@app/contracts/fleet.patterns.js';

@Controller()
export class FleetController {
  constructor() {}
  
  @MessagePattern(FLEET_PATTERNS.PING)
  async ping() {
    return { service: 'fleet', status: 'ok' };
  }
}

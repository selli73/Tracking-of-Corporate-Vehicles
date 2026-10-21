import { Module } from '@nestjs/common';
import { FleetMapGateway } from './fleet-map.gateway';

@Module({
    providers: [FleetMapGateway],
    exports: [FleetMapGateway]
})
export class FleetMapModule {}

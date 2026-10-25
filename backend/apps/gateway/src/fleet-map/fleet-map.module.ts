import { Module } from '@nestjs/common';
import { FleetMapGateway } from './fleet-map.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({

    })],
    providers: [FleetMapGateway],
    exports: [FleetMapGateway]
})
export class FleetMapModule {}

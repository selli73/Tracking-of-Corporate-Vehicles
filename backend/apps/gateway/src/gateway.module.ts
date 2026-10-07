import { Module } from '@nestjs/common';
import 'dotenv/config';
import { ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { CompanyModule } from './company/company.module.js';
import { VehiclesController } from './vehicles/vehicles.controller';
import { UserModule } from './user/user.module.js';
import { TariffModule } from './tariff/tariff.module.js';
import { BookingModule } from './booking/booking.module.js';
import { VehiclesService } from './vehicles/vehicles.service';
import { TelemetryModule } from './telemetry/telemetry.module.js';
import { AlertsController } from './alerts/alerts.controller.js';

@Module({
  imports: [    
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompanyModule,
    UserModule,
    TariffModule,
    BookingModule,
    TelemetryModule,
  ],
  controllers: [VehiclesController, AlertsController],
  providers: [VehiclesService],
})
export class GatewayModule {}

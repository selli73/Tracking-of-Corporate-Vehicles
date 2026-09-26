import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { VehicleModule } from './vehicle/vehicle.module.js';
import { CompanyModule } from './company/company.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), VehicleModule, CompanyModule, AuthModule],
})
export class FleetModule {}

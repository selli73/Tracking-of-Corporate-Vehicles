import { Module } from '@nestjs/common';
import { FleetController } from './fleet.controller.js';
import { FleetService } from './fleet.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [FleetController],
  providers: [FleetService],
})
export class FleetModule {}

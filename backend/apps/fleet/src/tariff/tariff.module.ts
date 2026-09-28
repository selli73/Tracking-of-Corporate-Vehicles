import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service.js';
import { TariffController } from './tariff.controller.js';
import { CompanyModule } from '../company/company.module.js';

@Module({
  imports: [CompanyModule],
  controllers: [TariffController],
  providers: [TariffService],
})
export class TariffModule {}

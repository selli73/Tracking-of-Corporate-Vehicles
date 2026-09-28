import { Controller } from '@nestjs/common';
import { TariffService } from './tariff.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FLEET_PATTERNS, GetRatesDto } from '@app/contracts';
import { CreateTariffDto, DeleteTariffDto, UpdateTariffDto } from './dto/tariff.dto.js';

@Controller('tariff')
export class TariffController {
  constructor(private _tariffService: TariffService) {}

  @MessagePattern(FLEET_PATTERNS.CREATE_TARIFF)
  create(@Payload() dto: CreateTariffDto) {
    return this._tariffService.create(dto);
  }

  @MessagePattern(FLEET_PATTERNS.GET_RATES)
  getCompanyRates(@Payload() dto: GetRatesDto) {
    return this._tariffService.getCompanyRates(dto.companyId);
  }

  @MessagePattern(FLEET_PATTERNS.UPDATE_TARIFF)
  update(dto: UpdateTariffDto) {
    return this._tariffService.update(dto);
  }

  @MessagePattern(FLEET_PATTERNS.DELETE_TARIFF)
  delete(dto: DeleteTariffDto) {
    return this._tariffService.delete(dto);
  }
}

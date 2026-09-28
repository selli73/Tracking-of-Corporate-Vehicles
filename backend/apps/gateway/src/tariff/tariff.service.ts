import { CreateTariffDto, DeleteTariffDto, FLEET_PATTERNS, FLEET_SERVICE, UpdateTariffDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TariffService {
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}

    async create(data: CreateTariffDto, companyId: string) {
        const tariff = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.CREATE_TARIFF, { ...data, companyId }));

        return tariff;
    }

    async getCompanyRates(companyId: string) {
        const rates = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.GET_RATES, { companyId }));

        return rates;
    }

    async update(dto: UpdateTariffDto, companyId: string) {
        const tariff = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.UPDATE_TARIFF, { ...dto, companyId }));

        return tariff;
    }

    async delete(dto: DeleteTariffDto, companyId: string) {
        const tariff = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.DELETE_TARIFF, { ...dto, companyId }));
        
        return tariff;
    }
}

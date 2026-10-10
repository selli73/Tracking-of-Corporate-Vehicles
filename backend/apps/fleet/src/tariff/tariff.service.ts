import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto, DeleteTariffDto, UpdateTariffDto } from './dto/tariff.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class TariffService {
    constructor(private _prismaService: PrismaService, private _companyService: CompanyService) {}

    async create(data: CreateTariffDto) {   
        const tariff = await this._prismaService.tariff.create({
            data: {                
                name: data.name,
                minuteRate: data.minuteRate,
                kmRate: data.kmRate,
                dayRate: data.dayRate,
                companyId: data.companyId
            }
        });

        return tariff;
    };

    async getCompanyRates(companyId: string) {

        const company = await this._companyService.getCompanyById(companyId);

        return this._prismaService.tariff.findMany({
            where: {
                companyId: company.id
            }
        });
    }

    async getVehicleTariff(data: { vehicleId: string }) {
        const vehicleTariff = await this._prismaService.vehicle.findFirst({
            where: {
                id: data.vehicleId
            },
            select: {
                tariff: {
                    select: {
                        minuteRate: true,
                        kmRate: true
                    }
                }
            }
        });

        return {
            minuteRate: vehicleTariff?.tariff?.minuteRate ?? 0,
            kmRate: vehicleTariff?.tariff?.kmRate ?? 0
        };
    }

    async update(data: UpdateTariffDto) {
        const company = await this._companyService.getCompanyById(data.companyId);        

        return this._prismaService.tariff.update({
            where: {
                companyId_name: {
                    companyId: company.id,
                    name: data.name
                }
            },
            data: {
                minuteRate: data.minuteRate,
                kmRate: data.kmRate,
                dayRate: data.dayRate
            }
        });
    }

    async delete(data: DeleteTariffDto) {
        await this._companyService.getCompanyById(data.companyId);

        return this._prismaService.tariff.update({
            where: {
                companyId_name: {
                    name: data.name,
                    companyId: data.companyId
                }
            },
            data: {
                isActive: false
            }
        });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto, DeleteTariffDto, UpdateTariffDto } from './dto/tariff.dto';
import { RpcException } from '@nestjs/microservices';
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

        return this._prismaService.tariff.delete({
            where: {
                companyId_name: {
                    name: data.name,
                    companyId: data.companyId
                }
            }
        });
    }
}

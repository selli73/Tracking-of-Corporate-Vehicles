import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from '@app/contracts';

@Injectable()
export class VehicleService {
    constructor(private _prismaService: PrismaService) {}

    async create(data: CreateVehicleDto) {
        const vehicle = await this._prismaService.db.orm.public.Vehicle.where({ vin: data.vin }).first();
        
        if (vehicle) {
            throw new BadRequestException('A vehicle with this VIN exists')
        }

        return this._prismaService.db.orm.public.Vehicle.create({
            brand: data.brand,
            model: data.model,
            vin: data.vin,
            licensePlate: data.licensePlate
        });
    }

    getAll() {
        return this._prismaService.db.orm.public.Vehicle.all();
    }
}

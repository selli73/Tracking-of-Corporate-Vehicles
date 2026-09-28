import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VehicleService {
  constructor(private _prismaService: PrismaService) {}

  async create(data: CreateVehicleDto) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        vin: data.vin,
      },
    });

    if (vehicle) {
      throw new RpcException('A vehicle with this VIN exists');
    }

    return this._prismaService.vehicle.create({
      data: {
        brand: data.brand,
        model: data.model,
        vin: data.vin,
        licensePlate: data.licensePlate,
      },
    });
  }

  getAll() {
    return this._prismaService.vehicle.findMany();
  }
}

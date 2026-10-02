import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto, ERROR_CODES, UserContext } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import { StatusVehicle } from '@prisma/client-fleet';
import { VehicleReleasedEvent } from '../events/vehicleReleased';

@Injectable()
export class VehicleService {
  constructor(private _prismaService: PrismaService) {}

  async create(data: CreateVehicleDto, userContext: UserContext) {
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
        companyId: userContext.companyId   
      },
    });
  }

  getAll() {
    return this._prismaService.vehicle.findMany();
  }

  async checkVehicleStatus(data: { vehicleId: string }) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId,
        status: StatusVehicle.ACTIVE
      }
    });
    if (!vehicle) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'The vehicle does not exist'
      });
    }
    return {
      success: true
    };
  }

  async vehicleStarted(data: VehicleReleasedEvent) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId
      }
    });

    if (!vehicle) {
      throw new RpcException({        
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'Vehicle not found'
      });
    }

    await this._prismaService.vehicle.update({
      where: {
        id: data.vehicleId        
      },
      data: {
        currentBookingId: data.bookingId
      }
    });
  }

  async vehicleReleased(data: VehicleReleasedEvent) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId
      }
    });

    if (!vehicle) {
      throw new RpcException({        
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'Vehicle not found'
      });
    }

    await this._prismaService.vehicle.update({
      where: {
        id: data.vehicleId        
      },
      data: {
        currentBookingId: null
      }
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto, ERROR_CODES, LinkTariffToVehicleDto, RpcRequest, UpdateStatusVehicleDto, UserContext } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import { StatusVehicle } from '@prisma/client-fleet';
import { VehicleReleasedEvent } from '../events/vehicleReleased';
import { VehicleStartedEvent } from '../events/vehicleStarted';

@Injectable()
export class VehicleService {

  private _logger = new Logger(VehicleService.name);

  constructor(private _prismaService: PrismaService) {}

  async create(data: CreateVehicleDto, userContext: UserContext) {
    const vehicle = await this._prismaService.vehicle.findFirst({
      where: {
        OR: [
          {
            vin: data.vin
          },
          {
            licensePlate: data.licensePlate
          }
        ]
      },
      select: {
        vin: true,
        licensePlate: true
      }
    });

    if (vehicle) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_UNIQUENESS_ERROR,
        message: vehicle.vin === data.vin
          ? 'A vehicle with this VIN exists' 
          : 'A vehicle with this license plate already exists'
      });
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

  async linkTariffToVehicle(data: LinkTariffToVehicleDto, user: UserContext) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId
      }
    });

    if (!vehicle) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'The vehicle does not exist'
      });
    }

    if (vehicle.companyId !== user.companyId) {
      throw new RpcException({
        code: ERROR_CODES.FORBIDDEN,
        message: 'The vehicle does not belong to your company'
      })
    }

    return this._prismaService.vehicle.update({
      where: {
        id: data.vehicleId
      },
      data: {
        tariffId: data.tariffId
      }
    });    
  }

  async updateStatusVehicle(data: UpdateStatusVehicleDto, user: UserContext) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId
      }
    });

    if (!vehicle) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'The vehicle does not exist'
      });
    }

    if (vehicle.companyId !== user.companyId) {
      throw new RpcException({
        code: ERROR_CODES.FORBIDDEN,
        message: 'The vehicle does not belong to your company'
      });
    }

    if (vehicle.currentBookingId) {
      throw new RpcException({
        code: ERROR_CODES.VEHICLE_IS_IN_USE,
        message: 'The vehicle is currently in use; please try again later'
      });
    }

    return this._prismaService.vehicle.update({
      where: {
        id: data.vehicleId        
      },
      data: {
        status: data.status
      }
    });
  }

  getAll(companyId: string) {
    return this._prismaService.vehicle.findMany({
      where: {
        companyId
      }
    });
  }

  async checkVehicleStatus(data: { companyId: string, vehicleId: string }) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId,
        companyId: data.companyId,
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

  async vehicleStarted(data: VehicleStartedEvent) {
    const vehicle = await this._prismaService.vehicle.findUnique({
      where: {
        id: data.vehicleId
      }
    });

    if (!vehicle) {
      this._logger.warn({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'Vehicle not found'
      });
      return;
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
      this._logger.warn({
        code: ERROR_CODES.VEHICLE_NOT_FOUND,
        message: 'Vehicle not found'
      });
    }

    await this._prismaService.vehicle.updateMany({
      where: {
        id: data.vehicleId,
        currentBookingId: data.bookingId      
      },
      data: {
        currentBookingId: null
      }
    });
  }
}

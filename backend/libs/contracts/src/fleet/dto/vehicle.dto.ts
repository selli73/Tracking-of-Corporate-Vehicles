import { IsEnum, IsNotEmpty, IsString, IsUUID, Length, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsString()
  @Length(1, 100)
  @ApiProperty({ description: 'Vehicle brand', example: 'BMW' })
  brand: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty({ description: 'Vehicle model', example: 'm3 G80' })
  model: string;

  @IsString()
  @Length(17, 17)
  @Transform((vin) => String(vin.value).toUpperCase())
  @ApiProperty({ description: 'VIN', example: '12345678910123242' })
  vin: string;

  @IsString()
  @Length(8, 9)
  @Transform((licensePlate) => String(licensePlate.value).toUpperCase())
  @ApiProperty({ description: 'Vehicle registration number', example: 'А001АА77' })
  licensePlate: string;
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED'
}
export class UpdateStatusVehicleDto {
  @IsUUID()
  @ApiProperty({ description: 'Vehicle id'})
  vehicleId: string;

  @IsNotEmpty()
  @IsEnum(VehicleStatus, { message: `status должен быть одним из: ${Object.values(VehicleStatus).join(', ')}` })
  @ApiProperty({ description: 'Vehicle status'})
  status: VehicleStatus;
}


export class LinkTariffToVehicleDto {
  @IsUUID()
  @ApiProperty({ description: 'Vehicle id'})
  vehicleId: string;
  
  @ValidateIf((dto: LinkTariffToVehicleDto) => dto.tariffId !== null)
  @IsUUID()
  @ApiProperty({ description: 'TariffId id'})
  tariffId: string;
}

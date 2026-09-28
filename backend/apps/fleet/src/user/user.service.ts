import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { RegisterDriverDto, RegisterUserDto } from './dto/user.dto';
import { Role } from '@prisma/client-fleet';

@Injectable()
export class UserService {
  constructor(private _prismaService: PrismaService) {}

  async registerAdmin(data: RegisterUserDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this._prismaService.user.create({
      data: {
        email: data.email,
        passwordHash: hashPassword,
        name: data.name,
        surname: data.surname,
        role: Role.COMPANY_ADMIN,
        companyId: data.companyId,
      },
    });

    const { passwordHash, ...objectWithoutPassword } = user;

    return objectWithoutPassword;
  }

 async registerManager(data: RegisterUserDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this._prismaService.user.create({
      data: {
        email: data.email,
        passwordHash: hashPassword,
        name: data.name,
        surname: data.surname,
        role: Role.MANAGER,
        companyId: data.companyId
      }
    });

    const { passwordHash,...objectWithoutPassword } = user;

    return objectWithoutPassword;
  }

  async registerDriver(data: RegisterDriverDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);
    const expiryDate = new Date(data.driverLicenseExpiresAt);
    
    const user = await this._prismaService.user.create({
      data: {
        email: data.email,
        passwordHash: hashPassword,
        name: data.name,
        surname: data.surname,
        role: Role.DRIVER,
        driverLicenseNumber: data.driverLicenseNumber,
        driverLicenseExpiresAt: expiryDate,
        companyId: data.companyId
      }
    });

    const { passwordHash,...objectWithoutPassword } = user;

    return objectWithoutPassword;
  }
}

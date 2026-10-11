import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { RegisterDriverDto, RegisterUserDto } from './dto/user.dto';
import { Role } from '@prisma/client-fleet';
import { ERROR_CODES, UserContext, VISIBLE_ROLES } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';

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

  async getAllUser(data: UserContext) {
    const visibleRoles = VISIBLE_ROLES[data.role];

    if (visibleRoles.length == 0) {
      throw new RpcException({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Insufficient permissions',
      })
    }

    return this._prismaService.user.findMany({
      where: {
        companyId: data.companyId,
        role: { in: visibleRoles },        
      },
      omit: {
        passwordHash: true,
        companyId: true,
        updatedAt: true
      }      
    })    
  }
}

import { FLEET_PATTERNS, FLEET_SERVICE, RegisterDriverDto, RegisterUserDto, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}

  async registerAdmin(data: RegisterUserDto, companyId: string) {
    const adminCompany = await firstValueFrom(
      this._clientFleet.send(FLEET_PATTERNS.REGISTER_COMPANY_ADMIN, {
        ...data,
        companyId,
      }),
    );

    return {
      status: 201,
      data: adminCompany,
    };
  }

  async registerManager(data: RegisterUserDto, companyId: string) {
    const managerCompany = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.REGISTER_COMPANY_MANAGER, {
      ...data,
      companyId
    }));

    return {
      status: 201,
      data: managerCompany
    };
  }

  async registerDriver(data: RegisterDriverDto, companyId: string) {
    const driverCompany = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.REGISTER_COMPANY_DRIVER, {
      ...data,
      companyId
    }));

    return {
      status: 201,
      data: driverCompany
    };
  }

  async getAllUsers(user: UserContext) {
    const users = await firstValueFrom(this._clientFleet.send<unknown, UserContext>(FLEET_PATTERNS.GET_ALL_USERS, user));

    return users;
  }

  async me(user: UserContext) {
    const me = await firstValueFrom(this._clientFleet.send<unknown, UserContext>(FLEET_PATTERNS.GET_ME, user));

    return me;
  }
}

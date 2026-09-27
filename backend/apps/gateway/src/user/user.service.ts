import { FLEET_PATTERNS, FLEET_SERVICE, RegisterUserDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
    
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}

    async registerAdmin(data: RegisterUserDto, companyId: string) {
        const adminCompany = await lastValueFrom(this._clientFleet.send(FLEET_PATTERNS.RIGISTER_COMPANY_ADMIN, { ...data, companyId }));

        return {
            status: 201,
            data: adminCompany
        };
    }
}

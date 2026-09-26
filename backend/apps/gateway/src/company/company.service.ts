import { CompanyResponseCreate, FLEET_PATTERNS, FLEET_SERVICE, RegisterCompanyDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompanyService {
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy, private _jwtService: JwtService) {}

    async register(dto: RegisterCompanyDto) {
        const response: CompanyResponseCreate = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.REGISTER_COMPANY, dto));
        
        const payload = {
            sub: response.user.id,
            email: response.user.email,
            role: response.user.role,
            companyId: response.user.companyId
        };

        return {
            access_token: this._jwtService.sign(payload)
        };
    }
}

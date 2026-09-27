import { FLEET_PATTERNS, FLEET_SERVICE, LoginDto, LoginResponse } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy, private _jwtService: JwtService) {}

    async login(data: LoginDto) {
        const response: LoginResponse = await lastValueFrom(this._clientFleet.send(FLEET_PATTERNS.USER_LOGIN, data));

        const payload = {
            sub: response.userId,
            email: response.email,
            role: response.role,
            companyId: response.companyId
        };

        return {
            access_token: this._jwtService.sign(payload)
        }
    }
}

import { FLEET_PATTERNS, FLEET_SERVICE, LoginDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}

    login(data: LoginDto) {
        this._clientFleet.send(FLEET_PATTERNS.USER_LOGIN, data);
    }
}

import { CreateVehicleDto, FLEET_PATTERNS, FLEET_SERVICE, RpcRequest, UserContext } from "@app/contracts";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

@Injectable()
export class VehiclesService {
    constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy) {}

    createVehicle(data: CreateVehicleDto, userContext: UserContext) {
        return this._clientFleet
            .send<unknown, RpcRequest<CreateVehicleDto>>(FLEET_PATTERNS.CREATE_VEHICLE, 
                { user: { userId: userContext.userId, role: userContext.role, companyId: userContext.companyId }, data})
                .pipe(timeout(4000));
    }

    getAllVehicle(companyId: string) {
        return firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.GET_ALL_VEHICLE, { companyId }).pipe(timeout(4000)));
    }
}
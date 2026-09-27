import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../roles.decorator";
import { Role } from "@app/contracts";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private _reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredRoles = this._reflector.get<Role[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => user.role.includes(role));
    }
}
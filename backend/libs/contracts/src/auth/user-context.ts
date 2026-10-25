import { Role } from "../gateway/role.enum";

export class UserContext {
    userId: string;

    companyId: string;
    
    role: Role;
}

export class PayloadJwt {
    sub: string;
    role: string;
    companyId: string;
    iat: number;
    exp: number;
}
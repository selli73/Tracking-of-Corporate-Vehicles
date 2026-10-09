import { Role } from "../gateway/role.enum";

export class UserContext {
    userId: string;

    companyId: string;
    
    role: Role;
}
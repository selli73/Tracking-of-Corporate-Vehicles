import { Role } from "../gateway/role.enum";

export interface UserContext {
    userId: string;

    companyId: string;
    
    role: Role;
}
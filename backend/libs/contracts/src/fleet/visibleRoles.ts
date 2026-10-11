import { Role } from "../gateway/role.enum";

export const VISIBLE_ROLES: Record<Role, Role[]> = {
    [Role.OWNER]: [Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER, Role.DRIVER],
    [Role.COMPANY_ADMIN]: [Role.MANAGER, Role.DRIVER],
    [Role.MANAGER]: [Role.DRIVER],
    [Role.DRIVER]: []
}
import { AccessDenied } from "@/shared/ui/AccessDenied";
import { authStore } from "../store";
import type { Role } from "../types"
import { Outlet } from "react-router";

interface RequireRoleProps {
    roles: Role[];
} 

export const RequireRole = ({ roles }: RequireRoleProps) => {
    
    if (!authStore.hasAnyRole(roles)) {
        return <AccessDenied />;
    }

    return <Outlet />;
}
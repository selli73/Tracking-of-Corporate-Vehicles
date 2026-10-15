import { Navigate, Outlet, useLocation } from "react-router"
import { authStore } from "../store";
import { PageLoader } from "@/shared/ui/PageLoader";
import { observer } from "mobx-react-lite";

export const RequireAuth = observer(() => {
    
    const location = useLocation();

    if (authStore.status === 'unknown') {
        return <PageLoader />;
    }

    if (!authStore.isAuth) {
        return <Navigate to='/login' replace state={{ from: location }} />
    }

    return <Outlet />
});
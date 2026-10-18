import { Navigate, Outlet, useLocation } from "react-router"
import { authStore } from "../store";
import { PageLoader } from "@/shared/ui/PageLoader";
import { observer } from "mobx-react-lite";
import { ServerUnavailable } from "@/shared/ui/ServerUnavailable";

export const RequireAuth = observer(() => {
    
    const location = useLocation();

    if (authStore.status === 'unknown') {
        return <PageLoader />;
    }

    if (authStore.status === 'unavailable') {
        return <ServerUnavailable onRetry={() => void authStore.init()} />;
    }

    if (!authStore.isAuth) {
        return <Navigate to='/login' replace state={{ from: location }} />
    }

    return <Outlet />
});
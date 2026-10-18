import { PageLoader } from "@/shared/ui/PageLoader"
import { authStore } from "../store"
import { Navigate, Outlet, useLocation, type Location } from "react-router"
import { observer } from "mobx-react-lite"
import { ServerUnavailable } from "@/shared/ui/ServerUnavailable";

export const GuestOnly = observer(() => {
    const location = useLocation();

    if (authStore.status === 'unknown') {
        return <PageLoader />
    }

    if (authStore.status === 'unavailable') {
        return <ServerUnavailable onRetry={() => void authStore.init()} />;
    }

    if (authStore.isAuth) {        
        const from = (location.state as { from: Location } | null)?.from;
        const target = from ? from.pathname + from.search : '/';
        return <Navigate to={target} replace />
    }

    return <Outlet />;
});
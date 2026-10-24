import { ACCESS, authStore } from "@/features/auth";
import { tariffStore } from "@/features/tariffs";
import { vehiclesStore, VehicleTable } from "@/features/vehicles";
import { LoadState } from "@/shared/ui/LoadState";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router";

export const VehiclesPage = observer(() => {
    
    const canManage = authStore.hasAnyRole(ACCESS.vehiclesManage);

    useEffect(() => {
        vehiclesStore.load();
        if (canManage) {
            tariffStore.load();
        }
    }, [canManage]);
    
    return (
        <>
            <h1>Машины</h1>
            {canManage && <Link to="/vehicles/new">Добавить машину</Link>}
            <LoadState
                status={vehiclesStore.status}
                error={vehiclesStore.error}
                isEmpty={vehiclesStore.items.length === 0}
                emptyText="В компании пока нет машин"
                onRetry={() => vehiclesStore.load()}
            >
                <VehicleTable 
                    vehicles={vehiclesStore.items}
                    tariffs={tariffStore.items}
                    canManage={authStore.hasAnyRole(ACCESS.vehiclesManage)}
                />
            </LoadState>
        </>
    );
});
import { ACCESS, authStore } from "@/features/auth";
import { tariffStore } from "@/features/tariffs";
import { vehicleStore, VehicleTable } from "@/features/vehicles";
import { LoadState } from "@/shared/ui/LoadState";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router";

export const VehiclesPage = observer(() => {
    
    const canManage = authStore.hasAnyRole(ACCESS.vehiclesManage);

    useEffect(() => {
        vehicleStore.load();
        if (canManage) {
            tariffStore.load();
        }
    }, [canManage]);
    
    return (
        <>
            <h1>Машины</h1>
            {canManage && <Link to="/vehicles/new">Добавить машину</Link>}
            <LoadState
                status={vehicleStore.status}
                error={vehicleStore.error}
                isEmpty={vehicleStore.items.length === 0}
                emptyText="В компании пока нет машин"
                onRetry={() => vehicleStore.load()}
            >
                <VehicleTable 
                    vehicles={vehicleStore.items}
                    tariffs={tariffStore.items}
                    canManage={authStore.hasAnyRole(ACCESS.vehiclesManage)}
                />
            </LoadState>
        </>
    );
});
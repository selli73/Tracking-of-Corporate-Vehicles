import { GeofencePolygon, geofenceStore } from "@/features/geofences";
import { vehicleLocationStore, VehicleMarkers } from "@/features/vehicle-locations";
import { vehicleStore } from "@/features/vehicles";
import type { LoadStatus } from "@/shared/lib/loadStatus";
import { BaseMap } from "@/shared/ui/map/BaseMap"
import { FitBounds } from "@/shared/ui/map/FitBounds";
import type { LatLngTuple } from "leaflet";
import { observer } from "mobx-react-lite"
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 10_000;

const isSettled = (status: LoadStatus) => status === 'success' || status === 'error';

export const MapPage = observer(() => {    
    useEffect(() => {
        vehicleLocationStore.load();
        vehicleStore.load();
        geofenceStore.load();

        const intervalId = window.setInterval(() => {
            vehicleLocationStore.refresh();
        }, REFRESH_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, []);

    const vehicleById = new Map(vehicleStore.items.map((v) => [v.id, v]));
    const locations = vehicleLocationStore.items;
    const geofences = geofenceStore.items;
    
    const isReady = isSettled(vehicleLocationStore.status) && isSettled(geofenceStore.status);

    const points: LatLngTuple[] = isReady
    ? [
        ...locations.map((l): LatLngTuple => [l.lat, l.lng]),
        ...geofences.flatMap((g) => g.points.map((p): LatLngTuple => [p.lat, p.lng])),
      ]
    : [];

    return (
        <div>
            <h1>Карта</h1>

            {vehicleLocationStore.status === 'loading' && <p>Загружаем машины…</p>}
            
            {vehicleLocationStore.status === 'error' && (
                <p role="alert" style={{ color: 'crimson' }}>
                    {vehicleLocationStore.error}{' '}
                    <button onClick={() => void vehicleLocationStore.load()}>Повторить</button>
                </p>
            )}

            {geofenceStore.status === 'error' && (
                <p role="alert" style={{ color: 'crimson' }}>
                {geofenceStore.error}{' '}
                <button onClick={() => void geofenceStore.load()}>Повторить</button>
                </p>
            )}           

            <BaseMap height="calc(100vh - 180px)">
                <GeofencePolygon geofences={geofences} />
                <VehicleMarkers locations={locations} vehicleById={vehicleById} />
                <FitBounds points={points} />
            </BaseMap>
        </div>
    )
})
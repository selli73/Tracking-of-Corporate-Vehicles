import { socket } from "@/shared/api";
import { useEffect } from "react";
import type { VehicleLocation } from "../types";
import { vehicleLocationStore } from "../store";

export function useLiveVehicleLocations() {
    useEffect(() => {
        function onLocation(location: VehicleLocation) {
            vehicleLocationStore.upsert(location);
        }

        // при каждом (пере)подключении подтягиваем актуальное состояние
        function onConnect() {
            vehicleLocationStore.refresh();
        }

        socket.on('location', onLocation);
        socket.on('connect', onConnect);
        socket.connect();

        return () => {
            socket.off('location', onLocation);
            socket.off('connect', onConnect);
            socket.disconnect();
        }
    }, []) 
}
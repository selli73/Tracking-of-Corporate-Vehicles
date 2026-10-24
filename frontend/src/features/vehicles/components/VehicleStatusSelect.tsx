import { useState, type ChangeEvent } from "react";
import { VEHICLE_STATUS_LABEL, type Vehicle, type VehicleStatus } from "../types";
import { vehiclesStore } from "../store";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

const STATUSES = Object.keys(VEHICLE_STATUS_LABEL) as VehicleStatus[];

interface VehicleStatusSelectProps {
  vehicle: Vehicle;
}

export const VehicleStatusSelect = ({ vehicle }: VehicleStatusSelectProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOnTrip = vehicle.currentBookingId !== null;
    
    const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const next = event.target.value as VehicleStatus;

        if (
            next === 'DECOMMISSIONED' &&
            !window.confirm(`Списать машину ${vehicle.licensePlate}? Её нельзя будет бронировать.`)
        ) {
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            await vehiclesStore.updateStatus(vehicle.id, next);
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось изменить статус'));
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <select
                value={vehicle.status}
                onChange={handleChange}
                disabled={isSaving || isOnTrip}
                title={isOnTrip ? 'Машина сейчас в поездке' : undefined}
            >
                {STATUSES.map((status) => (
                    <option key={status} value={status}>
                        {VEHICLE_STATUS_LABEL[status]}
                    </option>
                ))}
            </select>
            {error && <span role="alert" style={{ color: 'crimson' }}> {error}</span>}
        </>
    )
}
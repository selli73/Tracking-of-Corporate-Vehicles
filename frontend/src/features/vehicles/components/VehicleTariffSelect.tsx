import { useState, type ChangeEvent } from "react";
import type { TariffOption, Vehicle } from "../types";
import { vehicleStore } from "../store";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

interface VehicleTariffSelectProps {
  vehicle: Vehicle;
  tariffs: TariffOption[];
}

export const VehicleTariffSelect = ({ vehicle, tariffs }: VehicleTariffSelectProps) => {
    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const options = tariffs.filter((t) => t.isActive || t.id === vehicle.tariffId)

    const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setError(null);
        setIsSaving(true);

        try {
            await vehicleStore.linkTariffToVehicle(vehicle.id, value === '' ? null : value);
        } catch (error) {
            setError(getErrorMessage(error, 'Не удалось сменить тариф'));
        } finally {
            setIsSaving(false);
        }
    }
    
    return (
        <>
            <select value={vehicle.tariffId ?? ''} onChange={handleChange} disabled={isSaving}>
                <option value=''>Без тарифа</option>
                {options.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}{t.isActive ? '' : ' (неактивен)'}
                    </option>
                ))}
            </select>
            {error && <span role="alert" style={{ color: 'crimson' }}> {error}</span>}
        </>
    )
}

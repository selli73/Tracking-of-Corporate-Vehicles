import { useState, type ChangeEvent, type FormEvent } from "react";
import type { CreateBookingDto, DriverInfo, VehicleInfo } from "../types";
import { toDateTimeLocal } from "@/shared/lib/datetime";
import { bookingStore } from "../store";
import { getBookingErrorMessage } from "../errors";


interface FormValues {
  vehicleId: string;
  driverId: string;
  start: string;
  end: string;
}

const EMPTY: FormValues = { vehicleId: '', driverId: '', start: '', end: '' };

interface CreateBookingFormProps {
  vehicles: VehicleInfo[];
  drivers: DriverInfo[];
  onSuccess: () => void;
}

export const CreateBookingForm = ({ vehicles, drivers, onSuccess }: CreateBookingFormProps) => {

    const [values, setValues] = useState<FormValues>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minStart = toDateTimeLocal(new Date());

    function update(field: keyof FormValues) {
        return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const start = new Date(values.start);
        const end = new Date(values.end);

        if (end <= start) {
            setError('Окончание брони должно быть позже начала');
            return;
        }

        setIsSubmitting(true);
        try {
            await bookingStore.create({
                vehicleId: values.vehicleId,
                driverId: values.driverId,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
            });
            onSuccess();
        } catch (err) {
            setError(getBookingErrorMessage(err));
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="booking-vehicle">Машина</label>
                <select id="booking-vehicle" required value={values.vehicleId} onChange={update('vehicleId')}>
                <option value="" disabled>Выберите машину</option>
                {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                    {v.licensePlate} · {v.brand} {v.model}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label htmlFor="booking-driver">Водитель</label>
                <select id="booking-driver" required value={values.driverId} onChange={update('driverId')}>
                <option value="" disabled>Выберите водителя</option>
                {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                    {d.surname} {d.name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label htmlFor="booking-start">Начало</label>
                <input
                id="booking-start"
                type="datetime-local"
                required
                min={minStart}
                value={values.start}
                onChange={update('start')}
                />
            </div>

            <div>
                <label htmlFor="booking-end">Окончание</label>
                <input
                id="booking-end"
                type="datetime-local"
                required
                min={values.start || minStart}
                value={values.end}
                onChange={update('end')}
                />
            </div>

            {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Бронируем…' : 'Забронировать'}
            </button>
        </form>
    );
}
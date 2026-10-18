import { useState, type ChangeEvent, type FormEvent } from 'react';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { vehicleStore } from '../store';
import type { TariffOption } from '../types'; // НОВОЕ


interface FormValues {
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  tariffId: string;
}

const EMPTY: FormValues = { brand: '', model: '', vin: '', licensePlate: '', tariffId: '' };

interface CreateVehicleFormProps {
  tariffs: TariffOption[]; // НОВОЕ
  onSuccess: () => void;
}

export function CreateVehicleForm({ tariffs, onSuccess }: CreateVehicleFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // НОВОЕ: принимает и <input>, и <select>
  function update(field: keyof FormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await vehicleStore.create({
        brand: values.brand.trim(),
        model: values.model.trim(),
        vin: values.vin.trim().toUpperCase(),
        licensePlate: values.licensePlate.trim().toUpperCase(),
        tariffId: values.tariffId || undefined, // НОВОЕ
      });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось добавить машину'));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="brand">Марка</label>
        <input id="brand" required value={values.brand} onChange={update('brand')} />
      </div>

      <div>
        <label htmlFor="model">Модель</label>
        <input id="model" required value={values.model} onChange={update('model')} />
      </div>

      <div>
        <label htmlFor="vin">VIN</label>
        <input
          id="vin"
          required
          maxLength={17}
          pattern="[A-HJ-NPR-Za-hj-npr-z0-9]{17}"
          title="17 символов: латинские буквы (кроме I, O, Q) и цифры"
          value={values.vin}
          onChange={update('vin')}
        />
      </div>

      <div>
        <label htmlFor="licensePlate">Госномер</label>
        <input id="licensePlate" required value={values.licensePlate} onChange={update('licensePlate')} />
      </div>

      {/* НОВОЕ: выбор тарифа */}
      <div>
        <label htmlFor="tariffId">Тариф</label>
        <select id="tariffId" value={values.tariffId} onChange={update('tariffId')}>
          <option value="">Без тарифа</option>
          {tariffs
            .filter((t) => t.isActive)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>

      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Сохраняем…' : 'Добавить'}
      </button>
    </form>
  );
}
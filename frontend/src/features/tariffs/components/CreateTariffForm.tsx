import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { tariffStore } from "../store";

interface FormValues {
  name: string;
  minuteRate: string;
  kmRate: string;
  dayRate: string;
}

const EMPTY: FormValues = { name: '', minuteRate: '', kmRate: '', dayRate: '' };

interface CreateTariffFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const CreateTariffForm = ({ onSuccess, onCancel }: CreateTariffFormProps) => {
    const [values, setValues] = useState<FormValues>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (field: keyof FormValues) => {
        return (event: ChangeEvent<HTMLInputElement>) => 
            setValues((prev) => ({ ...prev, [field]: event.target.value }));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await tariffStore.create({
                name: values.name.trim(),
                minuteRate: values.minuteRate,
                kmRate: values.kmRate,
                dayRate: values.dayRate === '' ? undefined : values.dayRate,
            });
            setValues(EMPTY);
            onSuccess();
        } catch(error) {
            setError(getErrorMessage(error, 'Не удалось создать тариф'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="tariff-name">Название</label>
                <input id="tariff-name" required value={values.name} onChange={update('name')} />
            </div>

            <div>
                <label htmlFor="minuteRate">За минуту, ₽</label>
                <input
                id="minuteRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                value={values.minuteRate}
                onChange={update('minuteRate')}
                />
            </div>

            <div>
                <label htmlFor="kmRate">За км, ₽</label>
                <input
                id="kmRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                value={values.kmRate}
                onChange={update('kmRate')}
                />
            </div>

            <div>
                <label htmlFor="dayRate">За сутки, ₽ (необязательно)</label>
                <input
                id="dayRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={values.dayRate}
                onChange={update('dayRate')}
                />
            </div>

            {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохраняем…' : 'Создать'}
            </button>
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
                Отмена
            </button>
        </form>
    )
}


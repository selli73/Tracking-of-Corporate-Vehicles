import { ROLE_LABEL, type CreatableRole } from "@/features/auth";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { userStore } from "../store";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import type { CreateEmployeeDto } from "../types";

interface FormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  driverLicenseNumber: string;
  driverLicenseExpiresAt: string;
}

const EMPTY: FormValues = {
  name: '',
  surname: '',
  email: '',
  password: '',
  driverLicenseNumber: '',
  driverLicenseExpiresAt: '',
};

interface CreateEmployeeFormProps {
  roles: readonly CreatableRole[];
  onSuccess: () => void;
  onCancel: () => void;
}


export const CreateEmployeeForm = ({ roles, onSuccess, onCancel }: CreateEmployeeFormProps) => {
    const [role, setRole] = useState<CreatableRole>(roles[0]);
    const [values, setValues] = useState<FormValues>(EMPTY);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDriver = role === 'DRIVER';
    const today = new Date().toISOString().slice(0, 10);

    function update(field: keyof FormValues) {
        return (event: ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const dto: CreateEmployeeDto = {
            name: values.name.trim(),
            surname: values.surname.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
        };

        if (isDriver) {
            dto.driverLicenseNumber = values.driverLicenseNumber.trim().toUpperCase();
            dto.driverLicenseExpiresAt = values.driverLicenseExpiresAt;
        }

        try {
            await userStore.create(role, dto);
            onSuccess();
        } catch (error) {
            setError(getErrorMessage(error, 'Не удалось создать сотрудника'));
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="employee-role">Роль</label>
                <select
                id="employee-role"
                value={role}
                onChange={(e) => setRole(e.target.value as CreatableRole)}
                >
                {roles.map((r) => (
                    <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
                </select>
            </div>

            <div>
                <label htmlFor="employee-surname">Фамилия</label>
                <input id="employee-surname" required value={values.surname} onChange={update('surname')} />
            </div>

            <div>
                <label htmlFor="employee-name">Имя</label>
                <input id="employee-name" required value={values.name} onChange={update('name')} />
            </div>

            <div>
                <label htmlFor="employee-email">Email</label>
                <input
                id="employee-email"
                type="email"
                required
                autoComplete="off"
                value={values.email}
                onChange={update('email')}
                />
            </div>

            <div>
                <label htmlFor="employee-password">Пароль</label>
                <input
                id="employee-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={values.password}
                onChange={update('password')}
                />
            </div>

            {isDriver && (
                <fieldset>
                <legend>Водительское удостоверение</legend>

                <div>
                    <label htmlFor="license-number">Номер</label>
                    <input
                    id="license-number"
                    required
                    value={values.driverLicenseNumber}
                    onChange={update('driverLicenseNumber')}
                    />
                </div>

                <div>
                    <label htmlFor="license-expires">Действует до</label>
                    <input
                    id="license-expires"
                    type="date"
                    required
                    min={today}
                    value={values.driverLicenseExpiresAt}
                    onChange={update('driverLicenseExpiresAt')}
                    />
                </div>
                </fieldset>
            )}

            {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Создаём…' : 'Создать'}
            </button>
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
                Отмена
            </button>
        </form>
    )
}
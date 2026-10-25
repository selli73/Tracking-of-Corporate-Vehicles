import { ROLE_LABEL, type CreatableRole } from '@/features/auth';
import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Divider,
  Group,
  PasswordInput,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { usersStore } from '../store';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import type { CreateEmployeeDto } from '../types';

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

  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
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
      await usersStore.create(role, dto);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось создать сотрудника'));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {roles.length > 1 ? (
          <div>
            <Text size="sm" fw={500} mb={4}>
              Роль
            </Text>
            <SegmentedControl
              value={role}
              onChange={(value) => setRole(value as CreatableRole)}
              data={roles.map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
            />
          </div>
        ) : (
          <Text size="sm">
            Роль: <b>{ROLE_LABEL[role]}</b>
          </Text>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Фамилия"
            required
            value={values.surname}
            onChange={(e) => setField('surname', e.currentTarget.value)}
          />
          <TextInput
            label="Имя"
            required
            value={values.name}
            onChange={(e) => setField('name', e.currentTarget.value)}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Email"
            type="email"
            required
            autoComplete="off"
            value={values.email}
            onChange={(e) => setField('email', e.currentTarget.value)}
          />
          <PasswordInput
            label="Пароль"
            description="Минимум 8 символов"
            required
            minLength={8}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setField('password', e.currentTarget.value)}
          />
        </SimpleGrid>

        {isDriver && (
          <>
            <Divider label="Водительское удостоверение" labelPosition="left" />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Номер"
                required
                ff="monospace"
                value={values.driverLicenseNumber}
                onChange={(e) => setField('driverLicenseNumber', e.currentTarget.value)}
              />
              <TextInput
                label="Действует до"
                type="date"
                required
                min={today}
                value={values.driverLicenseExpiresAt}
                onChange={(e) => setField('driverLicenseExpiresAt', e.currentTarget.value)}
              />
            </SimpleGrid>
          </>
        )}

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Создать
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
import { useState, type FormEvent } from 'react';
import { Alert, Button, Group, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { vehiclesStore } from '../store';
import type { TariffOption } from '../types';

interface FormValues {
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  tariffId: string;
}

const EMPTY: FormValues = { brand: '', model: '', vin: '', licensePlate: '', tariffId: '' };

interface CreateVehicleFormProps {
  tariffs: TariffOption[];
  onSuccess: () => void;
  onCancel?: () => void;
}

export function CreateVehicleForm({ tariffs, onSuccess, onCancel }: CreateVehicleFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const tariffOptions = tariffs
    .filter((t) => t.isActive)
    .map((t) => ({ value: t.id, label: t.name }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await vehiclesStore.create({
        brand: values.brand.trim(),
        model: values.model.trim(),
        vin: values.vin.trim().toUpperCase(),
        licensePlate: values.licensePlate.trim().toUpperCase(),
        tariffId: values.tariffId || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось добавить машину'));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Марка"
            placeholder="Toyota"
            required
            value={values.brand}
            onChange={(e) => setField('brand', e.currentTarget.value)}
          />
          <TextInput
            label="Модель"
            placeholder="Camry"
            required
            value={values.model}
            onChange={(e) => setField('model', e.currentTarget.value)}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="VIN"
            description="17 символов: латинские буквы (кроме I, O, Q) и цифры"
            required
            maxLength={17}
            pattern="[A-HJ-NPR-Za-hj-npr-z0-9]{17}"
            ff="monospace"
            value={values.vin}
            onChange={(e) => setField('vin', e.currentTarget.value)}
          />
          <TextInput
            label="Госномер"
            placeholder="А123ВС163"
            required
            value={values.licensePlate}
            onChange={(e) => setField('licensePlate', e.currentTarget.value)}
          />
        </SimpleGrid>

        <Select
          label="Тариф"
          placeholder="Без тарифа"
          data={tariffOptions}
          value={values.tariffId || null}
          onChange={(value) => setField('tariffId', value ?? '')}
          clearable
        />

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Group justify="flex-end">
          {onCancel && (
            <Button variant="default" onClick={onCancel} disabled={isSubmitting}>
              Отмена
            </Button>
          )}
          <Button type="submit" loading={isSubmitting}>
            Добавить
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
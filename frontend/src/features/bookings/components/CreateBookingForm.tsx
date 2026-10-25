import { useState, type FormEvent } from 'react';
import { Alert, Button, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { DriverInfo, VehicleInfo } from '../types';
import { bookingStore } from '../store';
import { getBookingErrorMessage } from '../errors';
import { formatDuration } from '@/shared/lib/format';
import { useMediaQuery } from '@mantine/hooks';

interface FormValues {
  vehicleId: string | null;
  driverId: string | null;
  start: Date | null;
  end: Date | null;
}

const EMPTY: FormValues = { vehicleId: null, driverId: null, start: null, end: null };

type FieldErrors = Partial<Record<keyof FormValues, string>>;

function toDate(value: string | Date | null): Date | null {
  return value ? dayjs(value).toDate() : null;
}

interface CreateBookingFormProps {
  vehicles: VehicleInfo[];
  drivers: DriverInfo[];
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateBookingForm = ({
  vehicles,
  drivers,
  onSuccess,
  onCancel,
}: CreateBookingFormProps) => {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  const now = new Date();

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.vehicleId) errors.vehicleId = 'Выберите машину';
    if (!values.driverId) errors.driverId = 'Выберите водителя';
    if (!values.start) errors.start = 'Укажите начало';
    if (!values.end) errors.end = 'Укажите окончание';
    if (values.start && values.end && values.end <= values.start) {
      errors.end = 'Окончание должно быть позже начала';
    }
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingStore.create({
        vehicleId: values.vehicleId!,
        driverId: values.driverId!,
        startDate: values.start!.toISOString(),
        endDate: values.end!.toISOString(),
      });
      onSuccess();
    } catch (err) {
      setError(getBookingErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  const durationMinutes =
    values.start && values.end && values.end > values.start
      ? Math.round((values.end.getTime() - values.start.getTime()) / 60000)
      : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Машина"
            placeholder="Выберите машину"
            withAsterisk
            searchable
            nothingFoundMessage="Ничего не найдено"
            data={vehicles.map((v) => ({
              value: v.id,
              label: `${v.licensePlate} · ${v.brand} ${v.model}`,
            }))}
            value={values.vehicleId}
            onChange={(value) => setField('vehicleId', value)}
            error={fieldErrors.vehicleId}
          />
          <Select
            label="Водитель"
            placeholder="Выберите водителя"
            withAsterisk
            searchable
            nothingFoundMessage="Ничего не найдено"
            data={drivers.map((d) => ({ value: d.id, label: `${d.surname} ${d.name}` }))}
            value={values.driverId}
            onChange={(value) => setField('driverId', value)}
            error={fieldErrors.driverId}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <DateTimePicker
            label="Начало"
            placeholder="Выберите дату и время"
            withAsterisk
            valueFormat="DD.MM.YYYY HH:mm"
            minDate={now}
            value={values.start}
            onChange={(value) => setField('start', toDate(value))}
            error={fieldErrors.start}
            dropdownType={isMobile ? 'modal' : 'popover'}
          />
          <DateTimePicker
            label="Окончание"
            placeholder="Выберите дату и время"
            withAsterisk
            valueFormat="DD.MM.YYYY HH:mm"
            minDate={values.start ?? now}
            value={values.end}
            onChange={(value) => setField('end', toDate(value))}
            error={fieldErrors.end}
            dropdownType={isMobile ? 'modal' : 'popover'}
          />
        </SimpleGrid>

        {durationMinutes !== null && (
          <Text size="sm" c="dimmed">
            Длительность: {formatDuration(durationMinutes)}
          </Text>
        )}

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
            Забронировать
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
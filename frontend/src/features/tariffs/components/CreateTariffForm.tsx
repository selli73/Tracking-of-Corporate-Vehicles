import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { tariffStore } from '../store';

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

const MONEY_INPUT_PROPS = {
  min: 0,
  allowNegative: false,
  decimalScale: 2,
  decimalSeparator: ',',
  thousandSeparator: ' ',
  suffix: ' ₽',
  hideControls: true,
} as const;

export const CreateTariffForm = ({ onSuccess, onCancel }: CreateTariffFormProps) => {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function setMoney(field: keyof FormValues) {
    return (value: number | string) => setField(field, value === '' ? '' : String(value));
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
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось создать тариф'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Название"
          placeholder="Например, «Городской»"
          required
          value={values.name}
          onChange={(e) => setField('name', e.currentTarget.value)}
        />

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <NumberInput
            {...MONEY_INPUT_PROPS}
            label="За минуту"
            required
            value={values.minuteRate}
            onChange={setMoney('minuteRate')}
          />
          <NumberInput
            {...MONEY_INPUT_PROPS}
            label="За км"
            required
            value={values.kmRate}
            onChange={setMoney('kmRate')}
          />
          <NumberInput
            {...MONEY_INPUT_PROPS}
            label="За сутки"
            description="Необязательно"
            value={values.dayRate}
            onChange={setMoney('dayRate')}
          />
        </SimpleGrid>

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
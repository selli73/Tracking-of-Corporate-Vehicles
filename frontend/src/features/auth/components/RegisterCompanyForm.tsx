import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Divider,
  PasswordInput,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { authStore } from '../store';
import { getRegisterErrorMessage } from '../errors';
import type { RegisterCompanyDto } from '../types';

interface FormValues {
  officialName: string;
  shortName: string;
  tin: string;
  registeredAddress: string;
  actualAddress: string;
  phone: string;
  companyEmail: string;
  surname: string;
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const EMPTY: FormValues = {
  officialName: '',
  shortName: '',
  tin: '',
  registeredAddress: '',
  actualAddress: '',
  phone: '',
  companyEmail: '',
  surname: '',
  name: '',
  email: '',
  password: '',
  passwordRepeat: '',
};

function toDto(values: FormValues): RegisterCompanyDto {
  const actualAddress = values.actualAddress.trim();

  return {
    company: {
      officialName: values.officialName.trim(),
      shortName: values.shortName.trim(),
      tin: values.tin.trim(),
      registeredAddress: values.registeredAddress.trim(),
      actualAddress: actualAddress || undefined,
      phone: values.phone.trim(),
      companyEmail: values.companyEmail.trim().toLowerCase(),
    },
    owner: {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      name: values.name.trim(),
      surname: values.surname.trim(),
    },
  };
}

export function RegisterCompanyForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null); // НОВОЕ
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'password' || field === 'passwordRepeat') setPasswordError(null);
  }

  function bind(field: keyof FormValues) {
    return {
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(field, e.currentTarget.value),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (values.password !== values.passwordRepeat) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    setIsSubmitting(true);
    try {
      await authStore.registerCompany(toDto(values));
    } catch (e) {
      setError(getRegisterErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Divider label="Компания" labelPosition="left" />

        <TextInput
          label="Полное название"
          placeholder="ООО «Ромашка»"
          required
          maxLength={150}
          {...bind('officialName')}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Короткое название"
            placeholder="Ромашка"
            required
            maxLength={30}
            {...bind('shortName')}
          />
          <TextInput
            label="ИНН"
            description="10 цифр для организации, 12 для ИП"
            required
            inputMode="numeric"
            pattern="\d{10}|\d{12}"
            maxLength={12}
            {...bind('tin')}
          />
        </SimpleGrid>

        <TextInput label="Юридический адрес" required maxLength={150} {...bind('registeredAddress')} />
        <TextInput
          label="Фактический адрес"
          description="Если отличается от юридического"
          maxLength={150}
          {...bind('actualAddress')}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Телефон"
            type="tel"
            placeholder="+79991234567"
            required
            pattern="\+?\d{10,14}"
            maxLength={15}
            {...bind('phone')}
          />
          <TextInput
            label="Email компании"
            type="email"
            required
            maxLength={120}
            {...bind('companyEmail')}
          />
        </SimpleGrid>

        <Divider label="Владелец" labelPosition="left" mt="sm" />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput label="Фамилия" required maxLength={35} {...bind('surname')} />
          <TextInput label="Имя" required maxLength={25} {...bind('name')} />
        </SimpleGrid>

        <TextInput
          label="Email для входа"
          type="email"
          required
          autoComplete="email"
          {...bind('email')}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <PasswordInput
            label="Пароль"
            description="От 8 до 72 символов"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            {...bind('password')}
          />
          <PasswordInput
            label="Повторите пароль"
            required
            autoComplete="new-password"
            error={passwordError}
            {...bind('passwordRepeat')}
          />
        </SimpleGrid>

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} mt="sm">
          Зарегистрировать
        </Button>
      </Stack>
    </form>
  );
}
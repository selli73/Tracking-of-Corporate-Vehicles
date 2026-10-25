import { useState, type FormEvent } from 'react';
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { authStore } from '../store';
import { getRegisterErrorMessage } from '../errors';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authStore.login({ email: email.trim(), password });
    } catch (e) {
      setError(getRegisterErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <PasswordInput
          label="Пароль"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Войти
        </Button>
      </Stack>
    </form>
  );
}
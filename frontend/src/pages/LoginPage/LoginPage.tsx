import { Link } from 'react-router';
import { Anchor } from '@mantine/core';
import { LoginForm } from '@/features/auth';
import { AuthCard } from '@/shared/ui/AuthCard';

export function LoginPage() {
  return (
    <AuthCard
      title="Вход"
      subtitle="Войдите в свой аккаунт"
      footer={
        <>
          Нет аккаунта?{' '}
          <Anchor component={Link} to="/register">
            Зарегистрировать компанию
          </Anchor>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
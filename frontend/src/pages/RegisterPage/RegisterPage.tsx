import { Link } from 'react-router';
import { Anchor } from '@mantine/core';
import { RegisterCompanyForm } from '@/features/auth';
import { AuthCard } from '@/shared/ui/AuthCard';

export function RegisterPage() {
  return (
    <AuthCard
      title="Регистрация компании"
      subtitle="Создайте компанию и учётную запись владельца"
      width={640}
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Anchor component={Link} to="/login">
            Войти
          </Anchor>
        </>
      }
    >
      <RegisterCompanyForm />
    </AuthCard>
  );
}
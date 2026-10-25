import type { ReactNode } from 'react';
import { Alert, Button, Center, Loader, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconInbox } from '@tabler/icons-react';
import type { LoadStatus } from '@/shared/lib/loadStatus';

interface LoadStateProps {
  status: LoadStatus;
  error: string | null;
  isEmpty: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: ReactNode;
}

export function LoadState({
  status,
  error,
  isEmpty,
  emptyText = 'Пока ничего нет',
  onRetry,
  children,
}: LoadStateProps) {
  if (status === 'idle' || status === 'loading') {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (status === 'error') {
    return (
      <Alert color="red" icon={<IconAlertCircle />} title="Не удалось загрузить">
        <Stack gap="sm" align="flex-start">
          <Text size="sm">{error}</Text>
          {onRetry && (
            <Button size="xs" variant="light" color="red" onClick={onRetry}>
              Повторить
            </Button>
          )}
        </Stack>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Stack align="center" gap="xs" py="xl">
        <IconInbox size={40} stroke={1.2} color="var(--mantine-color-dimmed)" />
        <Text c="dimmed">{emptyText}</Text>
      </Stack>
    );
  }

  return <>{children}</>;
}
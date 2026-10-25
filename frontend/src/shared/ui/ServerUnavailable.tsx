import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconServerOff } from '@tabler/icons-react';

interface ServerUnavailableProps {
  onRetry: () => void;
}

export function ServerUnavailable({ onRetry }: ServerUnavailableProps) {
  return (
    <Center h="100vh">
      <Stack align="center" gap="sm">
        <IconServerOff size={48} stroke={1.2} color="var(--mantine-color-dimmed)" />
        <Title order={3}>Сервер недоступен</Title>
        <Text c="dimmed">Проверьте подключение и попробуйте ещё раз</Text>
        <Button onClick={onRetry}>Повторить</Button>
      </Stack>
    </Center>
  );
}
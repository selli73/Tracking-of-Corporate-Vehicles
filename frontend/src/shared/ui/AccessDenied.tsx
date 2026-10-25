import { Center, Stack, Text, Title } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

export function AccessDenied() {
  return (
    <Center py={80}>
      <Stack align="center" gap="sm">
        <IconLock size={48} stroke={1.2} color="var(--mantine-color-dimmed)" />
        <Title order={3}>Нет доступа</Title>
        <Text c="dimmed">У вашей роли нет прав на этот раздел</Text>
      </Stack>
    </Center>
  );
}
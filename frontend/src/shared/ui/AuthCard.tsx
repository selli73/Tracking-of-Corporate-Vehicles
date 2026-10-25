import type { ReactNode } from 'react';
import { Box, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  width?: number;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, width = 420, footer, children }: AuthCardProps) {
  return (
    <Box mih="100vh" bg="gray.0" py={60} px="md">
      <Stack align="center" gap="lg">
        <Group gap="xs">
          <ThemeIcon size="lg" radius="md">
            <IconCar size={20} />
          </ThemeIcon>
          <Title order={3}>VehiclePark</Title>
        </Group>

        <Paper withBorder shadow="sm" radius="md" p="xl" w="100%" maw={width}>
          <Title order={2} ta="center">
            {title}
          </Title>
          {subtitle && (
            <Text size="sm" c="dimmed" ta="center" mt={4}>
              {subtitle}
            </Text>
          )}
          <Box mt="lg">{children}</Box>
        </Paper>

        {footer && (
          <Text size="sm" c="dimmed">
            {footer}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
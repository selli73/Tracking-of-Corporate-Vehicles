import type { ReactNode } from 'react';
import { Group, Title } from '@mantine/core';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" mb="lg">
      <Title order={2}>{title}</Title>
      {actions}
    </Group>
  );
}
import { observer } from 'mobx-react-lite';
import { Badge, Paper, Stack, Table, Text } from '@mantine/core';
import type { Employee } from '../types';
import { ROLE_LABEL } from '@/features/auth';
import { formatDate } from '@/shared/lib/format';

interface UserTableProps {
  users: Employee[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRES_SOON_DAYS = 30;

const DriverLicense = ({ employee }: { employee: Employee }) => {
  if (!employee.driverLicenseNumber) {
    return <Text c="dimmed">—</Text>;
  }

  const expiresAt = employee.driverLicenseExpiresAt;
  const msLeft = expiresAt ? new Date(expiresAt).getTime() - Date.now() : null;
  const isExpired = msLeft !== null && msLeft < 0;
  const isExpiringSoon = msLeft !== null && !isExpired && msLeft < EXPIRES_SOON_DAYS * DAY_MS;

  return (
    <Stack gap={2} align="flex-start">
      <Text size="sm" ff="monospace">
        {employee.driverLicenseNumber}
      </Text>

      {expiresAt && (
        <Text size="xs" c={isExpired ? 'red' : isExpiringSoon ? 'orange' : 'dimmed'}>
          до {formatDate(expiresAt)}
          {isExpired && ' · просрочено'}
          {isExpiringSoon && ' · скоро истекает'}
        </Text>
      )}
    </Stack>
  );
};

export const UserTable = observer(({ users }: UserTableProps) => {
  return (
    <Paper withBorder radius="md">
      <Table.ScrollContainer minWidth={700}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Сотрудник</Table.Th>
              <Table.Th>Роль</Table.Th>
              <Table.Th>Водительское удостоверение</Table.Th>
              <Table.Th>Статус</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id} style={{ opacity: user.dismissed ? 0.55 : 1 }}>

                <Table.Td>
                  <Text fw={600}>
                    {user.surname} {user.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </Table.Td>

                <Table.Td>{ROLE_LABEL[user.role]}</Table.Td>

                <Table.Td>
                  <DriverLicense employee={user} />
                </Table.Td>

                <Table.Td>
                  <Badge color={user.dismissed ? 'gray' : 'green'} variant="light">
                    {user.dismissed ? 'Уволен' : 'Работает'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
});
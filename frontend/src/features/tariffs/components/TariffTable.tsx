import { formatMoney } from '@/shared/lib/format';
import type { Tariff } from '../types';
import { observer } from 'mobx-react-lite';
import { Badge, Paper, Table, Text } from '@mantine/core';
interface TariffTableProps {
  tariffs: Tariff[];
}

export const TariffTable = observer(({ tariffs }: TariffTableProps) => {
  return (
    <Paper withBorder radius="md">
      <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название</Table.Th>
              <Table.Th ta="right">За минуту</Table.Th>
              <Table.Th ta="right">За км</Table.Th>
              <Table.Th ta="right">За сутки</Table.Th>
              <Table.Th>Статус</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {tariffs.map((t) => (
              <Table.Tr key={t.id} style={{ opacity: t.isActive ? 1 : 0.55 }}>
                <Table.Td>
                  <Text fw={600}>{t.name}</Text>
                </Table.Td>
                <Table.Td ta="right">{formatMoney(t.minuteRate)}</Table.Td>
                <Table.Td ta="right">{formatMoney(t.kmRate)}</Table.Td>
                <Table.Td ta="right">
                  {t.dayRate !== null ? formatMoney(t.dayRate) : <Text c="dimmed">—</Text>}
                </Table.Td>
                <Table.Td>
                  <Badge color={t.isActive ? 'green' : 'gray'} variant="light">
                    {t.isActive ? 'Активен' : 'Отключён'}
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
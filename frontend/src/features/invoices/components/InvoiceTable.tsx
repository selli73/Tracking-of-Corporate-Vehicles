import { observer } from 'mobx-react-lite';
import { Badge, Box, Group, Paper, Stack, Table, Text } from '@mantine/core';
import { formatDateTime, formatDuration, formatKm, formatMoney } from '@/shared/lib/format';
import { INVOICE_STATUS_COLOR, INVOICE_STATUS_LABEL } from '../statuses';
import type { Invoice } from '../types';
import { PayInvoiceButton } from './PayInvoiceButton';

interface InvoiceTableProps {
  invoices: Invoice[];
  vehicleLabels: Map<string, string>;
  driverNames: Map<string, string> | null;
  canPay: boolean;
}

function InvoiceStatus({ invoice, canPay }: { invoice: Invoice; canPay: boolean }) {
  return (
    <Stack gap={6} align="flex-start">
      <Badge color={INVOICE_STATUS_COLOR[invoice.status]} variant="light">
        {INVOICE_STATUS_LABEL[invoice.status]}
      </Badge>
      {canPay && invoice.status === 'FAILED' && <PayInvoiceButton invoiceId={invoice.id} />}
    </Stack>
  );
}

export const InvoiceTable = observer(function InvoiceTable({
  invoices,
  vehicleLabels,
  driverNames,
  canPay,
}: InvoiceTableProps) {
  return (
    <>
      <Box visibleFrom="sm">
        <Paper withBorder radius="md">
          <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Дата</Table.Th>
                  <Table.Th>Машина</Table.Th>
                  {driverNames && <Table.Th>Водитель</Table.Th>}
                  <Table.Th>Время</Table.Th>
                  <Table.Th ta="right">Пробег</Table.Th>
                  <Table.Th>Тариф</Table.Th>
                  <Table.Th ta="right">Сумма</Table.Th>
                  <Table.Th>Статус</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {invoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td>{formatDateTime(invoice.createdAt)}</Table.Td>
                    <Table.Td>{vehicleLabels.get(invoice.vehicleId) ?? '—'}</Table.Td>
                    {driverNames && <Table.Td>{driverNames.get(invoice.driverId) ?? '—'}</Table.Td>}
                    <Table.Td>{formatDuration(invoice.durationMinutes)}</Table.Td>
                    <Table.Td ta="right">{formatKm(Number(invoice.distanceKm))}</Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {formatMoney(Number(invoice.minuteRate))}/мин
                        <br />
                        {formatMoney(Number(invoice.kmRate))}/км
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={600}>{formatMoney(Number(invoice.amount))}</Text>
                    </Table.Td>
                    <Table.Td>
                      <InvoiceStatus invoice={invoice} canPay={canPay} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </Box>

      <Stack gap="sm" hiddenFrom="sm">
        {invoices.map((invoice) => (
          <Paper key={invoice.id} withBorder radius="md" p="sm">
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <div>
                  <Text size="lg" fw={700}>
                    {formatMoney(Number(invoice.amount))}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatDateTime(invoice.createdAt)}
                  </Text>
                </div>
                <InvoiceStatus invoice={invoice} canPay={canPay} />
              </Group>

              <Text size="sm">{vehicleLabels.get(invoice.vehicleId) ?? '—'}</Text>

              {driverNames && (
                <Text size="sm" c="dimmed">
                  Водитель: {driverNames.get(invoice.driverId) ?? '—'}
                </Text>
              )}

              <Text size="xs" c="dimmed">
                {formatDuration(invoice.durationMinutes)} · {formatKm(Number(invoice.distanceKm))} ·{' '}
                {formatMoney(Number(invoice.minuteRate))}/мин, {formatMoney(Number(invoice.kmRate))}/км
              </Text>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
});
import { formatDateTime } from '@/shared/lib/format';
import {
  BOOKING_STATUS_COLOR,
  BOOKING_STATUS_LABEL,
  type Booking,
  type DriverInfo,
  type VehicleInfo,
} from '../types';
import { observer } from 'mobx-react-lite';
import { BookingActions } from './BookingActions';
import { Link } from 'react-router';
import { Anchor, Badge, Box, Group, Paper, Stack, Table, Text } from '@mantine/core';

interface BookingTableProps {
  bookings: Booking[];
  vehicleById: Map<string, VehicleInfo>;
  driverById: Map<string, DriverInfo>;
  showDriver: boolean;
  canManage: boolean;
}

function BookingStatus({ booking }: { booking: Booking }) {
  return (
    <Stack gap={4} align="flex-start">
      <Badge color={BOOKING_STATUS_COLOR[booking.status]} variant="light">
        {BOOKING_STATUS_LABEL[booking.status]}
      </Badge>
      {booking.status === 'DEBT' && (
        <Anchor component={Link} to="/invoices" size="xs">
          Оплатить счёт
        </Anchor>
      )}
    </Stack>
  );
}

export const BookingTable = observer(
  ({ bookings, vehicleById, driverById, showDriver, canManage }: BookingTableProps) => {
    return (
      <>
        <Box visibleFrom="sm">
          <Paper withBorder radius="md">
            <Table.ScrollContainer minWidth={850}>
              <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Начало</Table.Th>
                    <Table.Th>Окончание</Table.Th>
                    <Table.Th>Машина</Table.Th>
                    {showDriver && <Table.Th>Водитель</Table.Th>}
                    <Table.Th>Статус</Table.Th>
                    {canManage && <Table.Th>Действия</Table.Th>}
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {bookings.map((b) => {
                    const vehicle = vehicleById.get(b.vehicleId);
                    const driver = driverById.get(b.driverId);

                    return (
                      <Table.Tr key={b.id}>
                        <Table.Td>{formatDateTime(b.startDate)}</Table.Td>
                        <Table.Td>{formatDateTime(b.endDate)}</Table.Td>
                        <Table.Td>
                          {vehicle ? (
                            <>
                              <Text fw={600}>{vehicle.licensePlate}</Text>
                              <Text size="xs" c="dimmed">
                                {vehicle.brand} {vehicle.model}
                              </Text>
                            </>
                          ) : (
                            '—'
                          )}
                        </Table.Td>
                        {showDriver && (
                          <Table.Td>{driver ? `${driver.surname} ${driver.name}` : '—'}</Table.Td>
                        )}
                        <Table.Td>
                          <BookingStatus booking={b} />
                        </Table.Td>
                        {canManage && (
                          <Table.Td>
                            <BookingActions booking={b} />
                          </Table.Td>
                        )}
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Box>

        <Stack gap="sm" hiddenFrom="sm">
          {bookings.map((b) => {
            const vehicle = vehicleById.get(b.vehicleId);
            const driver = driverById.get(b.driverId);

            return (
              <Paper key={b.id} withBorder radius="md" p="sm">
                <Stack gap="xs">
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <div>
                      <Text fw={600}>{vehicle?.licensePlate ?? '—'}</Text>
                      {vehicle && (
                        <Text size="xs" c="dimmed">
                          {vehicle.brand} {vehicle.model}
                        </Text>
                      )}
                    </div>
                    <BookingStatus booking={b} />
                  </Group>

                  <Text size="sm">
                    {formatDateTime(b.startDate)} — {formatDateTime(b.endDate)}
                  </Text>

                  {showDriver && (
                    <Text size="sm" c="dimmed">
                      Водитель: {driver ? `${driver.surname} ${driver.name}` : '—'}
                    </Text>
                  )}

                  {canManage && <BookingActions booking={b} />}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </>
    );
  },
);
import { ACCESS, authStore } from '@/features/auth';
import {
  BOOKING_STATUS_LABEL,
  bookingStore,
  BookingTable,
  type BookingStatus,
} from '@/features/bookings';
import { usersStore } from '@/features/users';
import { vehiclesStore } from '@/features/vehicles';
import { LoadState } from '@/shared/ui/LoadState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button, Group, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

type StatusFilter = BookingStatus | 'ALL';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Все статусы' },
  ...Object.entries(BOOKING_STATUS_LABEL).map(([value, label]) => ({ value, label })),
];

export const BookingsPage = observer(() => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const showDriver = authStore.hasAnyRole(ACCESS.users);
  const canCreate = authStore.hasAnyRole(ACCESS.bookingsCreate);
  const canManage = authStore.hasAnyRole(ACCESS.bookingsManage);

  useEffect(() => {
    void bookingStore.load();
    void vehiclesStore.load();
    if (showDriver) {
      void usersStore.load();
    }
  }, [showDriver]);

  const vehicleById = new Map(vehiclesStore.items.map((v) => [v.id, v]));
  const driverById = new Map(usersStore.items.map((u) => [u.id, u]));

  const visibleBookings = bookingStore.items
    .filter((b) => statusFilter === 'ALL' || b.status === statusFilter)
    .slice()
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <>
      <PageHeader
        title={showDriver ? 'Брони' : 'Мои поездки'}
        actions={
          canCreate && (
            <Button component={Link} to="/bookings/new" leftSection={<IconPlus size={16} />}>
              Новая бронь
            </Button>
          )
        }
      />

      <Group mb="md">
        <Select
          data={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(value) => setStatusFilter((value ?? 'ALL') as StatusFilter)}
          allowDeselect={false}
          w={240}
          aria-label="Статус"
        />
      </Group>

      <LoadState
        status={bookingStore.status}
        error={bookingStore.error}
        isEmpty={visibleBookings.length === 0}
        emptyText={statusFilter === 'ALL' ? 'Броней пока нет' : 'Нет броней с таким статусом'}
        onRetry={() => void bookingStore.load()}
      >
        <BookingTable
          bookings={visibleBookings}
          vehicleById={vehicleById}
          driverById={driverById}
          showDriver={showDriver}
          canManage={canManage}
        />
      </LoadState>
    </>
  );
});
import { CreateBookingForm } from '@/features/bookings';
import { usersStore } from '@/features/users';
import { vehiclesStore } from '@/features/vehicles';
import { notifySuccess } from '@/shared/ui/notify';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Paper } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const CreateBookingPage = observer(function CreateBookingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void vehiclesStore.load();
    void usersStore.load();
  }, []);

  const availableVehicles = vehiclesStore.items.filter((v) => v.status === 'ACTIVE');
  const drivers = usersStore.items.filter((u) => u.role === 'DRIVER' && !u.dismissed);

  return (
    <>
      <PageHeader title="Новая бронь" />
      <Paper withBorder radius="md" p="lg" maw={720}>
        <CreateBookingForm
          vehicles={availableVehicles}
          drivers={drivers}
          onSuccess={() => {
            notifySuccess('Бронь создана');
            navigate('/bookings');
          }}
          onCancel={() => navigate('/bookings')}
        />
      </Paper>
    </>
  );
});
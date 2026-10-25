import { tariffStore } from '@/features/tariffs';
import { CreateVehicleForm } from '@/features/vehicles';
import { notifySuccess } from '@/shared/ui/notify';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Paper } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const CreateVehiclePage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    void tariffStore.load();
  }, []);

  return (
    <>
      <PageHeader title="Новая машина" />
      <Paper withBorder radius="md" p="lg" maw={720}>
        <CreateVehicleForm
          tariffs={tariffStore.items}
          onSuccess={() => {
            notifySuccess('Машина добавлена');
            navigate('/vehicles');
          }}
          onCancel={() => navigate('/vehicles')}
        />
      </Paper>
    </>
  );
});
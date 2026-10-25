import { ACCESS, authStore } from '@/features/auth';
import { tariffStore } from '@/features/tariffs';
import { vehiclesStore, VehicleTable } from '@/features/vehicles';
import { LoadState } from '@/shared/ui/LoadState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router';

export const VehiclesPage = observer(() => {
  const canManage = authStore.hasAnyRole(ACCESS.vehiclesManage);

  useEffect(() => {
    vehiclesStore.load();
    if (canManage) {
      tariffStore.load();
    }
  }, [canManage]);

  return (
    <>      
      <PageHeader
        title="Машины"
        actions={
          canManage && (
            <Button component={Link} to="/vehicles/new" leftSection={<IconPlus size={16} />}>
              Добавить машину
            </Button>
          )
        }
      />

      <LoadState
        status={vehiclesStore.status}
        error={vehiclesStore.error}
        isEmpty={vehiclesStore.items.length === 0}
        emptyText="В компании пока нет машин"
        onRetry={() => vehiclesStore.load()}
      >
        <VehicleTable
          vehicles={vehiclesStore.items}
          tariffs={tariffStore.items}
          canManage={canManage}
        />
      </LoadState>
    </>
  );
});
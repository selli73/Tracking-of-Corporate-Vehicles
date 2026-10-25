import { CreateTariffForm, tariffStore, TariffTable } from '@/features/tariffs';
import { LoadState } from '@/shared/ui/LoadState';
import { notifySuccess } from '@/shared/ui/notify';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

export const TariffsPage = observer(() => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    void tariffStore.load();
  }, []);

  return (
    <>
      <PageHeader
        title="Тарифы"
        actions={
          !isFormOpen && (
            <Button leftSection={<IconPlus size={16} />} onClick={() => setIsFormOpen(true)}>
              Новый тариф
            </Button>
          )
        }
      />

      {isFormOpen && (
        <Paper withBorder radius="md" p="md" mb="lg">
          <CreateTariffForm
            onSuccess={() => {
              notifySuccess('Тариф создан');
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </Paper>
      )}

      <LoadState
        status={tariffStore.status}
        error={tariffStore.error}
        isEmpty={tariffStore.items.length === 0}
        emptyText="Тарифов пока нет"
        onRetry={() => void tariffStore.load()}
      >
        <TariffTable tariffs={tariffStore.items} />
      </LoadState>
    </>
  );
});
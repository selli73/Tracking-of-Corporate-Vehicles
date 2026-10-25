import { authStore } from '@/features/auth';
import { CreateEmployeeForm, usersStore, UserTable } from '@/features/users';
import { LoadState } from '@/shared/ui/LoadState';
import { notifySuccess } from '@/shared/ui/notify';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button, Group, Paper, Switch } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

export const UsersPage = observer(() => {
  const [showDismissed, setShowDismissed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    usersStore.load();
  }, []);

  const roles = authStore.creatableRoles;
  const canCreate = roles.length > 0;

  const visibleUsers = showDismissed
    ? usersStore.items
    : usersStore.items.filter((user) => !user.dismissed);

  return (
    <>
      <PageHeader
        title="Сотрудники"
        actions={
          canCreate &&
          !isFormOpen && (
            <Button leftSection={<IconPlus size={16} />} onClick={() => setIsFormOpen(true)}>
              Добавить сотрудника
            </Button>
          )
        }
      />

      {canCreate && isFormOpen && (
        <Paper withBorder radius="md" p="md" mb="lg">
          <CreateEmployeeForm
            roles={roles}
            onSuccess={() => {
              notifySuccess('Сотрудник добавлен');
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </Paper>
      )}

      <Group mb="md">
        <Switch
          label="Показывать уволенных"
          checked={showDismissed}
          onChange={(e) => setShowDismissed(e.currentTarget.checked)}
        />
      </Group>

      <LoadState
        status={usersStore.status}
        error={usersStore.error}
        isEmpty={visibleUsers.length === 0}
        emptyText="Сотрудников нет"
        onRetry={() => void usersStore.load()}
      >
        <UserTable users={visibleUsers} />
      </LoadState>
    </>
  );
});
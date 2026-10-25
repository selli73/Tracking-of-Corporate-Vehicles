import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function confirmAction({
  title,
  message,
  confirmLabel = 'Подтвердить',
  danger = false,
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    let isSettled = false;
    const finish = (result: boolean) => {
      if (isSettled) return;
      isSettled = true;
      resolve(result);
    };

    modals.openConfirmModal({
      title,
      centered: true,
      children: <Text size="sm">{message}</Text>,
      labels: { confirm: confirmLabel, cancel: 'Отмена' },
      confirmProps: danger ? { color: 'red' } : undefined,
      onConfirm: () => finish(true),
      onCancel: () => finish(false),
      onClose: () => finish(false),
    });
  });
}
import { useState } from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import type { Booking } from '../types';
import { getBookingErrorMessage } from '../errors';
import { bookingStore } from '../store';
import { formatDateTime } from '@/shared/lib/format';
import { confirmAction } from '@/shared/ui/confirmAction';
import { notifyError, notifySuccess } from '@/shared/ui/notify';

interface BookingActionsProps {
  booking: Booking;
}

type Action = 'start' | 'finish' | 'cancel';

export const BookingActions = ({ booking }: BookingActionsProps) => {
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  const isBusy = pendingAction !== null;

  async function run(name: Action, action: () => Promise<void>, success: string, fallback: string) {
    setPendingAction(name);
    try {
      await action();
      notifySuccess(success);
    } catch (e) {
      notifyError(getBookingErrorMessage(e, fallback));
    } finally {
      setPendingAction(null);
    }
  }

  function handleStart() {
    run('start', () => bookingStore.start(booking.id), 'Поездка начата', 'Не удалось начать поездку');
  }

  async function handleFinish() {
    const isConfirmed = await confirmAction({
      title: 'Завершить поездку?',
      message: 'После завершения будет рассчитана стоимость и выставлен счёт.',
      confirmLabel: 'Завершить',
      danger: true,
    });
    if (!isConfirmed) return;

    run('finish', () => bookingStore.finish(booking.id), 'Поездка завершена', 'Не удалось завершить поездку');
  }

  async function handleCancel() {
    const isConfirmed = await confirmAction({
      title: 'Отменить бронь?',
      message: 'Машина снова станет доступна для бронирования на это время.',
      confirmLabel: 'Отменить бронь',
      danger: true,
    });
    if (!isConfirmed) return;

    run('cancel', () => bookingStore.cancel(booking.id), 'Бронь отменена', 'Не удалось отменить бронь');
  }

  if (booking.status === 'PENDING') {
    const now = new Date();
    const isTooEarly = new Date(booking.startDate) > now;
    const isExpired = new Date(booking.endDate) <= now;

    return (
      <Stack gap={4} align="flex-start">
        <Group gap="xs">
          {isExpired ? (
            <Text size="sm" c="dimmed">
              Срок брони истёк
            </Text>
          ) : (
            <Button
              size="xs"
              onClick={handleStart}
              disabled={isTooEarly || (isBusy && pendingAction !== 'start')}
              loading={pendingAction === 'start'}
            >
              Начать поездку
            </Button>
          )}

          <Button
            size="xs"
            variant="light"
            color="red"
            onClick={handleCancel}
            disabled={isBusy && pendingAction !== 'cancel'}
            loading={pendingAction === 'cancel'}
          >
            Отменить
          </Button>
        </Group>

        {isTooEarly && !isExpired && (
          <Text size="xs" c="dimmed">
            Можно начать с {formatDateTime(booking.startDate)}
          </Text>
        )}
      </Stack>
    );
  }

  if (booking.status === 'ACTIVE') {
    return (
      <Button size="xs" onClick={handleFinish} loading={pendingAction === 'finish'}>
        Завершить
      </Button>
    );
  }

  return null;
};
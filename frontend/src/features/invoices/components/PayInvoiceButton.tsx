import { useState } from 'react';
import { Button } from '@mantine/core';
import { invoicesStore } from '../store';
import { getInvoiceErrorMessage } from '../errors';
import { notifyError, notifySuccess } from '@/shared/ui/notify';
import { notifications } from '@mantine/notifications';

interface PayInvoiceButtonProps {
  invoiceId: string;
}

export function PayInvoiceButton({ invoiceId }: PayInvoiceButtonProps) {
  const [isPaying, setIsPaying] = useState(false);

  async function handleClick() {
    setIsPaying(true);
    try {
      const updated = await invoicesStore.pay(invoiceId);
      if (updated.status === 'PAID') {
        notifySuccess('Счёт оплачен');
      } else {
        notifications.show({
          color: 'yellow',
          title: 'Оплата не прошла',
          message: 'Банк отклонил платёж. Попробуйте ещё раз.',
          autoClose: 5000,
        });
      }
    } catch (e) {
      notifyError(getInvoiceErrorMessage(e));
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <Button size="xs" variant="light" onClick={handleClick} loading={isPaying}>
      Оплатить
    </Button>
  );
}
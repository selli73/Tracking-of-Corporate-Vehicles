import { useState } from "react";
import type { Booking } from "../types";
import { getBookingErrorMessage } from "../errors";
import { bookingStore } from "../store";
import { formatDateTime } from "@/shared/lib/format";

interface BookingActionsProps {
  booking: Booking;
}

export const BookingActions = ({ booking }: BookingActionsProps) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function run(action: () => Promise<void>, fallback: string) {
        setError(null);
        setIsPending(true);
        try {
            await action();
        } catch (error) {
            setError(getBookingErrorMessage(error, fallback));
        } finally {
            setIsPending(false);
        }
    }

    function handleStart() {
        run(() => bookingStore.start(booking.id), 'Не удалось начать поездку');
    }

    function handleFinish() {
        if (!window.confirm('Завершить поездку? После этого будет рассчитана стоимость.')) {
            return;
        }
        run(() => bookingStore.finish(booking.id), 'Не удалось завершить поездку');
    }

    function handleCancel() {
        if (!window.confirm('Отменить бронь?')) return;
        
        run(() => bookingStore.cancel(booking.id), 'Не удалось отменить бронь');
    }

    const errorText = error && <span role="alert" style={{ color: 'crimson' }}> {error}</span>;



    if (booking.status === 'PENDING') {
        const now = new Date();
        const isTooEarly = new Date(booking.startDate) > now;
        const isExpired = new Date(booking.endDate) <= now;

        return (
            <>
                {isExpired ? (
                    <span style={{ color: 'gray' }}>Срок брони истёк </span>
                    ) : (
                    <button
                        onClick={handleStart}
                        disabled={isPending || isTooEarly}
                        title={isTooEarly ? `Можно начать с ${formatDateTime(booking.startDate)}` : undefined}
                    >
                        Начать поездку
                    </button>
                )}{' '}
                
                <button onClick={handleCancel} disabled={isPending}>
                    Отменить
                </button>
                {errorText}
            </>
        );
    }

  if (booking.status === 'ACTIVE') {
    return (
      <>
        <button onClick={handleFinish} disabled={isPending}>
          {isPending ? 'Завершаем…' : 'Завершить'}
        </button>
        {errorText}
      </>
    );
  }

  return null;
}
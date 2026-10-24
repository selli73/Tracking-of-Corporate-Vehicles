import { useState } from "react";
import { getInvoiceErrorMessage } from "../errors";
import { invoicesStore } from "../store";


interface PayInvoiceButtonProps {
  invoiceId: string;
}

export const PayInvoiceButton = ({ invoiceId }: PayInvoiceButtonProps) => {
    const [isPaying, setIsPaying] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleClick() {
         setIsPaying(true);
        setMessage(null);
        try {
            const updated = await invoicesStore.pay(invoiceId);
            if (updated.status !== 'PAID') {
                setMessage('Оплата не прошла, попробуйте ещё раз');
            }
        } catch(error) {
            setMessage(getInvoiceErrorMessage(error));
        } finally {
          setIsPaying(false);
        }
    }

    return (
        <div>
            <button type="button" onClick={handleClick} disabled={isPaying}>
                {isPaying ? 'Оплачиваем…' : 'Оплатить'}
            </button>
            {message && <div style={{ color: 'crimson' }}>{message}</div>}
        </div>
    )
}
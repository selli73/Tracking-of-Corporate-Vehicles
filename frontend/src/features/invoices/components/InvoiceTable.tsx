import { observer } from "mobx-react-lite";
import type { Invoice } from "../types";
import { formatDateTime, formatDuration, formatKm, formatMoney } from "@/shared/lib/format";
import { INVOICE_STATUS_LABEL } from "../statuses";
import { PayInvoiceButton } from "./PayInvoiceButton";

interface InvoiceTableProps {
    invoices: Invoice[];
    vehicleLabels: Map<string, string>;
    driverNames: Map<string, string> | null;
    canPay: boolean;
}

export const InvoiceTable = observer(({ invoices, vehicleLabels, driverNames, canPay }: InvoiceTableProps) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Машина</th>
                    {driverNames && <th>Водитель</th>}
                    <th>Время</th>
                    <th>Пробег</th>
                    <th>Тариф</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                        <td>{formatDateTime(invoice.createdAt)}</td>
                        <td>{vehicleLabels.get(invoice.vehicleId) ?? '—'}</td>
                        {driverNames && <td>{driverNames.get(invoice.driverId) ?? '—'}</td>}
                        <td>{formatDuration(invoice.durationMinutes)}</td>
                        <td>{formatKm(Number(invoice.distanceKm))}</td>
                        <td>
                            {formatMoney(Number(invoice.minuteRate))}/мин
                            <br />
                            {formatMoney(Number(invoice.kmRate))}/км
                        </td>
                        <td>
                            <strong>{formatMoney(Number(invoice.amount))}</strong>
                        </td>
                        <td>
                            {INVOICE_STATUS_LABEL[invoice.status]}
                            {canPay && invoice.status === 'FAILED' && <PayInvoiceButton invoiceId={invoice.id} />}
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    )
})
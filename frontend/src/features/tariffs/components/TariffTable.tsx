import { formatMoney } from "@/shared/lib/format";
import type { Tariff } from "../types";
import { observer } from "mobx-react-lite";

interface TariffTableProps {
    tariffs: Tariff[];
}

export const TariffTable = observer(({ tariffs }: TariffTableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Название</th>
                    <th>За минуту</th>
                    <th>За км</th>
                    <th>За сутки</th>
                    <th>Активен</th>
                </tr>
            </thead>
            <tbody>
                {tariffs.map((t) => (
                    <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{formatMoney(t.minuteRate)}</td>
                        <td>{formatMoney(t.kmRate)}</td>
                        <td>{t.dayRate !== null ? formatMoney(t.dayRate) : '—'}</td>
                        <td>{t.isActive ? 'Да' : 'Нет'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
})
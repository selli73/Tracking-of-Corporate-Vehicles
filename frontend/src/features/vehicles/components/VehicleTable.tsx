import { observer } from "mobx-react-lite";
import { VEHICLE_STATUS_LABEL, type TariffOption, type Vehicle } from "../types";
import { VehicleStatusSelect } from "./VehicleStatusSelect";
import { VehicleTariffSelect } from "./VehicleTariffSelect";

interface VehicleTableProps {
    vehicles: Vehicle[];
    tariffs: TariffOption[];
    canManage: boolean;
}

export const VehicleTable = observer(({ vehicles, tariffs, canManage  }: VehicleTableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Госномер</th>
                    <th>Марка и модель</th>
                    <th>VIN</th>
                    <th>Статус</th>
                    {canManage && <th>Тариф</th>}
                </tr>
            </thead>
            <tbody>
                {vehicles.map((v) => (
                    <tr key={v.id}>
                        <td>{v.licensePlate}</td>
                        <td>{v.brand} {v.model}</td>
                        <td>{v.vin}</td>
                        <td>
                            {canManage ? <VehicleStatusSelect vehicle={v} /> : VEHICLE_STATUS_LABEL[v.status]}
                        </td>
                        {
                            canManage && (
                                <td>
                                    <VehicleTariffSelect vehicle={v} tariffs={tariffs} />
                                </td>
                            )
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    );
});
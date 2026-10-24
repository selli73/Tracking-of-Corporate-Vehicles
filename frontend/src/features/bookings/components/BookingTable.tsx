import { formatDateTime } from "@/shared/lib/format";
import { BOOKING_STATUS_LABEL, type Booking, type DriverInfo, type VehicleInfo } from "../types";
import { observer } from "mobx-react-lite";
import { BookingActions } from "./BookingActions";
import { Link } from "react-router";

interface BookingTableProps {
    bookings: Booking[];
    vehicleById: Map<string, VehicleInfo>;
    driverById: Map<string, DriverInfo>;
    showDriver: boolean;
    canManage: boolean;
}

export const BookingTable = observer(({ bookings, vehicleById, driverById, showDriver, canManage }: BookingTableProps) => {    
    return (
        <table>
            <thead>
                <tr>
                    <th>Начало</th>
                    <th>Окончание</th>
                    <th>Машина</th>
                    {showDriver && <th>Водитель</th>}
                    <th>Статус</th>
                    {canManage && <th>Действия</th>}
                </tr>
            </thead>
            <tbody>
                {bookings.map((b) => {
                    const vehicle = vehicleById.get(b.vehicleId);
                    const driver = driverById.get(b.driverId);

                    return (
                        <tr key={b.id}>
                        <td>{formatDateTime(b.startDate)}</td>
                        <td>{formatDateTime(b.endDate)}</td>
                        <td>
                            {vehicle ? `${vehicle.licensePlate} · ${vehicle.brand} ${vehicle.model}` : '—'}
                        </td>
                        {showDriver && <td>{driver ? `${driver.surname} ${driver.name}` : '—'}</td>}
                        <td>
                          {BOOKING_STATUS_LABEL[b.status]}
                            {b.status === 'DEBT' && (
                                <div>
                                    <Link to="/invoices">Оплатить счёт</Link>
                                </div>
                            )}
                        </td>
                        {canManage && (
                            <td>
                                <BookingActions booking={b} />
                            </td>
                        )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
});
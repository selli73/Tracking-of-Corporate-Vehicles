import { ACCESS, authStore } from "@/features/auth";
import { BOOKING_STATUS_LABEL, bookingStore, BookingTable, type BookingStatus } from "@/features/bookings";
import { usersStore } from "@/features/users";
import { vehiclesStore } from "@/features/vehicles";
import { LoadState } from "@/shared/ui/LoadState";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link } from "react-router";

type StatusFilter = BookingStatus | 'ALL';

export const BookingsPage = observer(() => {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const showDriver = authStore.hasAnyRole(ACCESS.users);

    useEffect(() => {
        void bookingStore.load();
        void vehiclesStore.load();
        if (showDriver) {
            void usersStore.load();
        }
    }, [showDriver]);

    const vehicleById = new Map(vehiclesStore.items.map((v) => [v.id, v]));
    const driverById = new Map(usersStore.items.map((u) => [u.id, u]));

    const visibleBookings = bookingStore.items
        .filter((b) => statusFilter === 'ALL' || b.status === statusFilter)
        .slice()
        .sort((a, b) => b.startDate.localeCompare(a.startDate));
    console.log(visibleBookings);
    return (
        <>
            <h1>{showDriver ? 'Брони' : 'Мои поездки'}</h1>
            {authStore.hasAnyRole(ACCESS.bookingsCreate) && (
                <Link to="/bookings/new">Новая бронь</Link>
            )}
            <label>
                Статус:{' '}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                >
                    <option value="ALL">Все</option>
                    {   Object.entries(BOOKING_STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </label>

            <LoadState
                status={bookingStore.status}
                error={bookingStore.error}
                isEmpty={visibleBookings.length === 0}
                emptyText="Броней нет"
                onRetry={() => void bookingStore.load()}
            >
                <BookingTable
                    bookings={visibleBookings}
                    vehicleById={vehicleById}
                    driverById={driverById}
                    showDriver={showDriver}
                    canManage={authStore.hasAnyRole(ACCESS.bookingsManage)}
                />
            </LoadState>
        </>
    );    
});
import { authStore, type Role } from "@/features/auth"
import { observer } from "mobx-react-lite";
import { NavLink, Outlet } from "react-router"
import { ACCESS } from "@/features/auth";

interface MenuItem {
    to: string;
    label: string;
    roles: readonly Role[];
}

const MENU: MenuItem[] = [
    { to: '/vehicles', label: 'Машины', roles: ACCESS.vehicles },
    { to: 'bookings', label: 'Брони', roles: ACCESS.bookings },
    { to: '/users', label: 'Пользователи', roles: ACCESS.users },
    { to: '/tariffs', label: 'Тарифы', roles: ACCESS.tariffs },
    { to: '/map', label: 'Карта', roles: ACCESS.map },
    { to: '/invoices', label: 'Счета', roles: ACCESS.invoices },
];

export const AppLayout = observer(() => {
    const visibleItems = MENU.filter((item) => authStore.hasAnyRole(item.roles));

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <nav style={{ width: 220, padding: 16, borderRight: '1px solid #ddd' }}>
                <div>{authStore.user?.name} {authStore.user?.surname}</div>
                <button onClick={() => authStore.logout()}>Выйти</button>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {visibleItems.map((item) => (
                        <li key={item.to}>
                            <NavLink to={item.to}>{item.label}</NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <main style={{ flex: 1, padding: 24 }}>
                <Outlet />
            </main>
        </div>
    );
});
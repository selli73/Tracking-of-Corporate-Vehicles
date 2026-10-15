import { authStore } from "@/features/auth"
import { observer } from "mobx-react-lite";
import { NavLink, Outlet } from "react-router"

export const AppLayout = observer(() => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <nav style={{ width: 220, padding: 16, borderRight: '1px solid #ddd' }}>
                <div>{authStore.isAuth ? authStore.user?.name : 'Гость'}</div>
                <button onClick={() => authStore.logout()}></button>
                <NavLink to="/vehicles">Машины</NavLink>
            </nav>
            <main style={{ flex: 1, padding: 24 }}>
                <Outlet />
            </main>
        </div>
    );
});
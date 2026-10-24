import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { VehiclesPage } from "@/pages/VehiclesPage/VehiclesPage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { GuestOnly, RequireAuth, RequireRole } from "@/features/auth";
import { BookingsPage } from "@/pages/BookingsPage/BookingsPage";
import { ACCESS } from "@/features/auth";
import { UsersPage } from "@/pages/UsersPage/UsersPage";
import { TariffsPage } from "@/pages/TariffsPage/TariffsPage";
import { CreateVehiclePage } from "@/pages/CreateVehiclePage/CreateVehiclePage";
import { CreateBookingPage } from "@/pages/CreateBookingPage/CreateBookingPage";
import { MapPage } from "@/pages/MapPage/MapPage";
import { RegisterPage } from "@/pages/RegisterPage/RegisterPage";
import { InvoicesPage } from "@/pages/InvoicesPage/InvoicesPage";

export const router = createBrowserRouter([
    {
        element: <GuestOnly />,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
        ]
    },
    {
        element: <RequireAuth />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <Navigate to='/vehicles' replace /> },
                    { path: '/vehicles', element: <VehiclesPage /> },
                    {
                        element: <RequireRole roles={ACCESS.vehiclesManage} />,
                        children: [{ path: '/vehicles/new', element: <CreateVehiclePage /> }]
                    },
                    { path: '/bookings', element: <BookingsPage /> },
                    {
                        element: <RequireRole roles={ACCESS.bookingsCreate} />,
                        children: [{ path: '/bookings/new', element: <CreateBookingPage /> }],
                    },
                    {                                            
                        element: <RequireRole roles={ACCESS.users} />,
                        children: [{ path: '/users', element: <UsersPage /> }],
                    },
                    {                                                
                        element: <RequireRole roles={ACCESS.tariffs} />,
                        children: [{ path: '/tariffs', element: <TariffsPage /> }],
                    },
                    {
                        element: <RequireRole roles={ACCESS.map} />,
                        children: [{ path: '/map', element: <MapPage /> }],
                    },
                    {
                        element: <RequireRole roles={ACCESS.invoices} />,
                        children: [{ path: '/invoices', element: <InvoicesPage /> }],
                    },
                ]
            }        
        ]
    },
    { path: '*', element: <NotFoundPage /> }
])
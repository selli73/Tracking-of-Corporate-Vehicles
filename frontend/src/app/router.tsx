import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { VehiclePage } from "@/pages/VehiclePage/VehiclePage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { GuestOnly, RequireAuth } from "@/features/auth";

export const router = createBrowserRouter([
    {
        element: <GuestOnly />,
        children: [{ path: '/login', element: <LoginPage /> }]
    },
    {
        element: <RequireAuth />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <Navigate to='/vehicles' replace /> },
                    { path: '/vehicles', element: <VehiclePage /> }
                ]
            }            
        ]
    },
    { path: '*', element: <NotFoundPage /> }
])
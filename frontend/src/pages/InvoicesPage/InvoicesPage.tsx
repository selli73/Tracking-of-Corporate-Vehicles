import { ACCESS, authStore } from "@/features/auth"
import { InvoiceTable } from "@/features/invoices";
import { invoicesStore } from "@/features/invoices/store";
import { usersStore } from "@/features/users";
import { vehiclesStore } from "@/features/vehicles";
import { LoadState } from "@/shared/ui/LoadState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const InvoicesPage = observer(() => {
    
    const canSeeDrivers = authStore.hasAnyRole(ACCESS.users);
    const canPay = authStore.hasAnyRole(ACCESS.invoicesPay);

    useEffect(() => {
        void invoicesStore.load();
        void vehiclesStore.load();
        if (canSeeDrivers) void usersStore.load();
    }, [canSeeDrivers]);

    const vehicleLabels = new Map(
        vehiclesStore.items.map((v) => [v.id, `${v.brand} ${v.model} (${v.licensePlate})`]),
    );

    const driverNames = canSeeDrivers
        ? new Map(usersStore.items.map((u) => [u.id, `${u.surname} ${u.name}`]))
        : null;

    return (
        <div>
            <PageHeader title="Счета" />
            <LoadState
                status={invoicesStore.status}
                error={invoicesStore.error}
                isEmpty={invoicesStore.items.length === 0}
                emptyText="Счетов пока нет. Они появляются после завершения поездки"
                onRetry={() => void invoicesStore.load()}
            >
                <InvoiceTable
                    invoices={invoicesStore.items}
                    vehicleLabels={vehicleLabels}
                    driverNames={driverNames}
                    canPay={canPay}
                />
            </LoadState>
        </div>
    );
});
import { authStore } from "@/features/auth";
import { bookingStore } from "@/features/bookings";
import { geofenceStore } from "@/features/geofences";
import { invoicesStore } from "@/features/invoices";
import { tariffStore } from "@/features/tariffs";
import { usersStore } from "@/features/users";
import { vehicleLocationStore } from "@/features/vehicle-locations";
import { vehiclesStore } from "@/features/vehicles";
import { reaction } from "mobx";

export function resetStoresOnUserChange() {
    reaction(
        () => authStore.user?.id ?? null,
        () => {
            vehiclesStore.reset();
            vehicleLocationStore.reset();
            usersStore.reset();
            tariffStore.reset();
            invoicesStore.reset();
            geofenceStore.reset();
            bookingStore.reset();
        }
    )
}
import { ACCESS, authStore } from "@/features/auth";
import { CreateBookingForm } from "@/features/bookings";
import { usersStore } from "@/features/users";
import { vehiclesStore } from "@/features/vehicles";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const CreateBookingPage = observer(function CreateBookingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void vehiclesStore.load();
    void usersStore.load();
  }, []);

  const availableVehicles = vehiclesStore.items.filter((v) => v.status === 'ACTIVE');
  const drivers = usersStore.items.filter((u) => u.role === 'DRIVER' && !u.dismissed);

  return (
    <>
      <h1>Новая бронь</h1>
      <CreateBookingForm
        vehicles={availableVehicles}
        drivers={drivers}
        onSuccess={() => navigate('/bookings')}
      />
    </>
  );
});
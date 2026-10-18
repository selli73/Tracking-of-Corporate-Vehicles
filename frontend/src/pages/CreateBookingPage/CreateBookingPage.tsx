import { ACCESS, authStore } from "@/features/auth";
import { CreateBookingForm } from "@/features/bookings";
import { userStore } from "@/features/users";
import { vehicleStore } from "@/features/vehicles";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const CreateBookingPage = observer(function CreateBookingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void vehicleStore.load();
    void userStore.load();
  }, []);

  const availableVehicles = vehicleStore.items.filter((v) => v.status === 'ACTIVE');
  const drivers = userStore.items.filter((u) => u.role === 'DRIVER' && !u.dismissed);

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
import { tariffStore } from "@/features/tariffs";
import { CreateVehicleForm } from "@/features/vehicles";
import { useEffect } from "react";
import { useNavigate } from "react-router"

export const CreateVehiclePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        void tariffStore.load();
    }, []);

    return (
        <>
            <h1>Новая машина</h1>
            <CreateVehicleForm
                tariffs={tariffStore.items}
                onSuccess={() => navigate('/vehicles')}
            />
        </>
    )
}
import { CreateTariffForm, tariffStore, TariffTable } from "@/features/tariffs";
import { LoadState } from "@/shared/ui/LoadState";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export const TariffsPage = observer(() => {
    
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        void tariffStore.load();
    }, [])

    return (
        <>
            <h1>Тарифы</h1>
            
            {
                isFormOpen ? (
                    <CreateTariffForm 
                        onSuccess={() => setIsFormOpen(false)}
                        onCancel={() => setIsFormOpen(false)}
                    />
                ) : (
                    <button onClick={() => setIsFormOpen(true)}>Новый тариф</button>
                )
            }

            <LoadState
                status={tariffStore.status}
                error={tariffStore.error}
                isEmpty={tariffStore.items.length === 0}
                emptyText="Тарифов пока нет"
                onRetry={() => void tariffStore.load()}
            >
                <TariffTable tariffs={tariffStore.items} />
            </LoadState>
        </>
    )
})
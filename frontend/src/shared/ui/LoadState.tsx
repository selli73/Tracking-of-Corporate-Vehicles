import type { ReactNode } from "react";
import type { LoadStatus } from "../lib/loadStatus";

interface LoadStateProps {
    status: LoadStatus;
    error: string | null;
    isEmpty: boolean;
    emptyText: string;
    onRetry: () => void;
    children: ReactNode;
}

export const LoadState = ({ status, error, isEmpty, emptyText, onRetry, children }: LoadStateProps) => {
    
    if (status === 'idle' || status === 'loading') {
        return <p>Загрузка</p>;
    }

    if (status === 'error') {
        return (
            <div role="alert">
                <p>{error}</p>
                <button onClick={onRetry}>Повторить</button>
            </div>
        );
    }

    if (isEmpty) {
        return <p>{emptyText}</p>;
    }

    return <>{children}</>;
}
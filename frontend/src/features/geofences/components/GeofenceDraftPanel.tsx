import { useState, type FormEvent } from "react"
import type { GeofenceDraft } from "../useGeofenceDraft";
import { geofenceStore } from "../store";
import { getGeofenceErrorMessage } from "../errors";

const MIN_POINTS = 3;

interface GeofenceDraftPanelProps {
  draft: GeofenceDraft;
}

export const GeofenceDraftPanel = ({ draft }: GeofenceDraftPanelProps) => {
    
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const points = draft.points;

    if (points === null) {
        return <button onClick={draft.start}>Нарисовать геозону</button>;
    }

    function handleCancel() {
        draft.cancel();
        setName('');
        setError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (points === null || points.length < MIN_POINTS) return;

        setError(null);
        setIsSaving(true);
        try {
            await geofenceStore.create({ name: name.trim(), polygon: points });
            handleCancel();
        } catch (error) {
            setError(getGeofenceErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>
                Кликайте по карте, чтобы поставить вершины по краю области.
                Точек: {points.length}
                {points.length < MIN_POINTS && ` (нужно минимум ${MIN_POINTS})`}
            </p>

            <label htmlFor="geofence-name">Название</label>{' '}
            <input
                id="geofence-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
            />{' '}

            <button type="submit" disabled={isSaving || points.length < MIN_POINTS}>
                {isSaving ? 'Сохраняем…' : 'Сохранить'}
            </button>{' '}

            <button type="button" onClick={draft.undo} disabled={isSaving || points.length === 0}>
                Убрать последнюю точку
            </button>{' '}

            <button type="button" onClick={handleCancel} disabled={isSaving}>
                Отмена
            </button>

            {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
        </form>
    )
}
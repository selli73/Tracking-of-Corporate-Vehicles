import { useState, type FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconArrowBackUp, IconInfoCircle, IconPlus, IconPolygon } from '@tabler/icons-react';
import type { GeofenceDraft } from '../useGeofenceDraft';
import { geofenceStore } from '../store';
import { getGeofenceErrorMessage } from '../errors';
import { notifySuccess } from '@/shared/ui/notify';

const MIN_POINTS = 3;

interface GeofenceDraftPanelProps {
  draft: GeofenceDraft;
}

export const GeofenceDraftPanel = observer(({ draft }: GeofenceDraftPanelProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const points = draft.points;
  const geofences = geofenceStore.items;

  if (points === null) {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Геозоны</Title>
          <Badge variant="light" color="gray">
            {geofences.length}
          </Badge>
        </Group>

        <Button leftSection={<IconPlus size={16} />} onClick={draft.start} fullWidth>
          Нарисовать геозону
        </Button>

        {geofences.length === 0 ? (
          <Text size="sm" c="dimmed">
            Геозон пока нет. Нарисуйте первую, чтобы получать уведомления о выезде за её границы.
          </Text>
        ) : (
          <Stack gap="xs">
            {geofences.map((g) => (
              <Group key={g.id} gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" size="md" radius="md">
                  <IconPolygon size={16} />
                </ThemeIcon>
                <div style={{ minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>
                    {g.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {g.points.length} точек
                  </Text>
                </div>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    );
  }

  const hasEnoughPoints = points.length >= MIN_POINTS;

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
      notifySuccess(`Геозона «${name.trim()}» сохранена`);
      handleCancel();
    } catch (err) {
      setError(getGeofenceErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Title order={4}>Новая геозона</Title>

        <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
          Кликайте по карте, ставя вершины по краю области по порядку.
        </Alert>

        <Group justify="space-between">
          <Text size="sm">Точек поставлено</Text>
          <Badge color={hasEnoughPoints ? 'green' : 'orange'} variant="light">
            {points.length}
            {!hasEnoughPoints && ` из ${MIN_POINTS}`}
          </Badge>
        </Group>

        <TextInput
          label="Название"
          placeholder="Например, «Город»"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Button type="submit" fullWidth loading={isSaving} disabled={!hasEnoughPoints}>
          Сохранить
        </Button>

        <Group grow>
          <Button
            variant="default"
            leftSection={<IconArrowBackUp size={16} />}
            onClick={draft.undo}
            disabled={isSaving || points.length === 0}
          >
            Убрать точку
          </Button>
          <Button variant="default" onClick={handleCancel} disabled={isSaving}>
            Отмена
          </Button>
        </Group>
      </Stack>
    </form>
  );
});
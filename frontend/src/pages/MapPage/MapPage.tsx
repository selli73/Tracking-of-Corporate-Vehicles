import { ACCESS, authStore } from '@/features/auth';
import {
  GeofenceDraftLayer,
  GeofenceDraftPanel,
  GeofencePolygon,
  geofenceStore,
  useGeofenceDraft,
} from '@/features/geofences';
import { useLiveVehicleLocations, vehicleLocationStore, VehicleMarkers } from '@/features/vehicle-locations';
import { vehiclesStore } from '@/features/vehicles';
import type { LoadStatus } from '@/shared/lib/loadStatus';
import { BaseMap } from '@/shared/ui/map/BaseMap';
import { FitBounds } from '@/shared/ui/map/FitBounds';
import { Alert, Button, Flex, Group, LoadingOverlay, Paper, Stack } from '@mantine/core';
import type { LatLngTuple } from 'leaflet';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const isSettled = (status: LoadStatus) => status === 'success' || status === 'error';

const PAGE_HEIGHT = 'calc(100dvh - 60px - 2 * var(--mantine-spacing-md))';

export const MapPage = observer(() => {
  const draft = useGeofenceDraft();
  useLiveVehicleLocations();
  const canManageGeofences = authStore.hasAnyRole(ACCESS.geofencesManage);

  useEffect(() => {
    vehiclesStore.load();
    geofenceStore.load();
  }, []);

  const vehicleById = new Map(vehiclesStore.items.map((v) => [v.id, v]));
  const locations = vehicleLocationStore.items;
  const geofences = geofenceStore.items;

  const isReady = isSettled(vehicleLocationStore.status) && isSettled(geofenceStore.status);

  const points: LatLngTuple[] = isReady
    ? [
        ...locations.map((l): LatLngTuple => [l.lat, l.lng]),
        ...geofences.flatMap((g) => g.points.map((p): LatLngTuple => [p.lat, p.lng])),
      ]
    : [];

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap="md"
      h={{ md: PAGE_HEIGHT }}
    >
      <Stack gap="sm" style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        {vehicleLocationStore.status === 'error' && (
          <Alert color="red" variant="light">
            <Group justify="space-between">
              {vehicleLocationStore.error}
              <Button size="xs" variant="light" color="red" onClick={() => void vehicleLocationStore.load()}>
                Повторить
              </Button>
            </Group>
          </Alert>
        )}

        {geofenceStore.status === 'error' && (
          <Alert color="red" variant="light">
            <Group justify="space-between">
              {geofenceStore.error}
              <Button size="xs" variant="light" color="red" onClick={() => void geofenceStore.load()}>
                Повторить
              </Button>
            </Group>
          </Alert>
        )}

        <Paper
          withBorder
          radius="md"
          pos="relative"
          h={{ base: '65dvh', md: '100%' }}
          style={{ flex: 1, overflow: 'hidden', isolation: 'isolate' }}
        >
          <LoadingOverlay visible={vehicleLocationStore.status === 'loading'} />

          <BaseMap height="100%">
            <GeofencePolygon geofences={geofences} />
            <VehicleMarkers locations={locations} vehicleById={vehicleById} />
            <GeofenceDraftLayer draft={draft} />
            <FitBounds points={points} />
          </BaseMap>
        </Paper>
      </Stack>

      {canManageGeofences && (
        <Paper withBorder radius="md" p="md" w={{ base: '100%', md: 320 }} style={{ flexShrink: 0, overflowY: 'auto' }}>
          <GeofenceDraftPanel draft={draft} />
        </Paper>
      )}
    </Flex>
  );
});
import { useState } from 'react';
import { Loader, Select, Stack, Text } from '@mantine/core';
import { VEHICLE_STATUS_LABEL, type Vehicle, type VehicleStatus } from '../types';
import { vehiclesStore } from '../store';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { confirmAction } from '@/shared/ui/confirmAction';
import { notifyError, notifySuccess } from '@/shared/ui/notify';

const STATUS_OPTIONS = (Object.keys(VEHICLE_STATUS_LABEL) as VehicleStatus[]).map((status) => ({
  value: status,
  label: VEHICLE_STATUS_LABEL[status],
}));

interface VehicleStatusSelectProps {
  vehicle: Vehicle;
}

export const VehicleStatusSelect = ({ vehicle }: VehicleStatusSelectProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const isOnTrip = vehicle.currentBookingId !== null;

  const handleChange = async (value: string | null) => {
    if (!value || value === vehicle.status) return;
    const next = value as VehicleStatus;

    if (next === 'DECOMMISSIONED') {
      const isConfirmed = await confirmAction({
        title: `Списать машину ${vehicle.licensePlate}?`,
        message: 'Списанную машину нельзя будет бронировать.',
        confirmLabel: 'Списать',
        danger: true,
      });
      if (!isConfirmed) return;
    }

    setIsSaving(true);
    try {
      await vehiclesStore.updateStatus(vehicle.id, next);
      notifySuccess(`${vehicle.licensePlate}: ${VEHICLE_STATUS_LABEL[next].toLowerCase()}`);
    } catch (err) {
      notifyError(getErrorMessage(err, 'Не удалось изменить статус'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack gap={4}>
      <Select
        size="xs"
        w={170}
        data={STATUS_OPTIONS}
        value={vehicle.status}
        onChange={handleChange}
        allowDeselect={false}
        disabled={isSaving || isOnTrip}
        rightSection={isSaving ? <Loader size={14} /> : undefined}
      />
      {isOnTrip && (
        <Text size="xs" c="dimmed">
          Машина в поездке
        </Text>
      )}
    </Stack>
  );
};
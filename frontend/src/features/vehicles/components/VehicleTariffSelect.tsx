import { useState } from 'react';
import { Loader, Select, Stack, Text } from '@mantine/core';
import type { TariffOption, Vehicle } from '../types';
import { vehiclesStore } from '../store';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { notifyError, notifySuccess } from '@/shared/ui/notify';

interface VehicleTariffSelectProps {
  vehicle: Vehicle;
  tariffs: TariffOption[];
}

export const VehicleTariffSelect = ({ vehicle, tariffs }: VehicleTariffSelectProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const options = tariffs
    .filter((t) => t.isActive || t.id === vehicle.tariffId)
    .map((t) => ({
      value: t.id,
      label: t.isActive ? t.name : `${t.name} (неактивен)`,
    }));

  const handleChange = async (value: string | null) => {
    if (value === vehicle.tariffId) return;

    setIsSaving(true);
    try {
      await vehiclesStore.linkTariffToVehicle(vehicle.id, value);
      const tariffName = tariffs.find((t) => t.id === value)?.name;
      notifySuccess(
        tariffName
          ? `${vehicle.licensePlate}: тариф «${tariffName}»`
          : `${vehicle.licensePlate}: тариф отвязан`,
      );
    } catch (err) {
      notifyError(getErrorMessage(err, 'Не удалось сменить тариф'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack gap={4}>
      <Select
        size="xs"
        w={190}
        placeholder="Без тарифа"
        data={options}
        value={vehicle.tariffId}
        onChange={handleChange}
        clearable
        disabled={isSaving}
        rightSection={isSaving ? <Loader size={14} /> : undefined}
      />
    </Stack>
  );
};
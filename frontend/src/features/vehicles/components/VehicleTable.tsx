import { observer } from 'mobx-react-lite';
import { Badge, Paper, Table, Text } from '@mantine/core';
import {
  VEHICLE_STATUS_COLOR, 
  VEHICLE_STATUS_LABEL,
  type TariffOption,
  type Vehicle,
} from '../types';
import { VehicleStatusSelect } from './VehicleStatusSelect';
import { VehicleTariffSelect } from './VehicleTariffSelect';

interface VehicleTableProps {
  vehicles: Vehicle[];
  tariffs: TariffOption[];
  canManage: boolean;
}

export const VehicleTable = observer(({ vehicles, tariffs, canManage }: VehicleTableProps) => {
  return (    
    <Paper withBorder radius="md">
      <Table.ScrollContainer minWidth={700}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Госномер</Table.Th>
              <Table.Th>Марка и модель</Table.Th>
              <Table.Th>VIN</Table.Th>
              <Table.Th>Статус</Table.Th>
              {canManage && <Table.Th>Тариф</Table.Th>}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {vehicles.map((v) => (
              <Table.Tr key={v.id}>
                <Table.Td>
                  <Text fw={600}>{v.licensePlate}</Text>
                </Table.Td>

                <Table.Td>
                  {v.brand} {v.model}
                </Table.Td>

                <Table.Td>
                  <Text size="xs" ff="monospace" c="dimmed">
                    {v.vin}
                  </Text>
                </Table.Td>

                <Table.Td>
                  {canManage ? (
                    <VehicleStatusSelect vehicle={v} />
                  ) : (
                    <Badge color={VEHICLE_STATUS_COLOR[v.status]} variant="light">
                      {VEHICLE_STATUS_LABEL[v.status]}
                    </Badge>
                  )}
                </Table.Td>

                {canManage && (
                  <Table.Td>
                    <VehicleTariffSelect vehicle={v} tariffs={tariffs} />
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
});
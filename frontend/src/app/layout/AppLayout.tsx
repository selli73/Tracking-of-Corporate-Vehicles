import type { ComponentType } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { observer } from 'mobx-react-lite';
import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  NavLink,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconCar,
  IconCoin,
  IconFileInvoice,
  IconLogout,
  IconMap,
  IconUsers,
} from '@tabler/icons-react';
import { ACCESS, authStore, ROLE_LABEL, type Role } from '@/features/auth';

interface MenuItem {
  to: string;
  label: string;
  roles: readonly Role[];
  icon: ComponentType<{ size?: number; stroke?: number }>;
}

const MENU: MenuItem[] = [
  { to: '/vehicles', label: 'Машины', roles: ACCESS.vehicles, icon: IconCar },
  { to: '/bookings', label: 'Бронирования', roles: ACCESS.bookings, icon: IconCalendarEvent },
  { to: '/invoices', label: 'Счета', roles: ACCESS.invoices, icon: IconFileInvoice },
  { to: '/map', label: 'Карта', roles: ACCESS.map, icon: IconMap },
  { to: '/users', label: 'Сотрудники', roles: ACCESS.users, icon: IconUsers },
  { to: '/tariffs', label: 'Тарифы', roles: ACCESS.tariffs, icon: IconCoin },
];

export const AppLayout = observer(function AppLayout() {
  const [isMenuOpen, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
  const location = useLocation();
  const user = authStore.user;

  const items = MENU.filter((item) => authStore.hasAnyRole(item.roles));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !isMenuOpen } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={isMenuOpen} onClick={toggleMenu} hiddenFrom="sm" size="sm" />
            <Title order={4}>CarBooking24</Title>
          </Group>

          <Group gap="md">
            {user && (
              <Box visibleFrom="sm">
                <Text size="sm" fw={500}>
                  {user.name} {user.surname}
                </Text>
                <Text size="xs" c="dimmed">
                  {ROLE_LABEL[user.role]}
                </Text>
              </Box>
            )}

            <Button
              visibleFrom="sm"
              variant="subtle"
              color="gray"
              leftSection={<IconLogout size={16} />}
              onClick={() => authStore.logout()}
            >
              Выйти
            </Button>

            <ActionIcon
              hiddenFrom="sm"
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => authStore.logout()}
              aria-label="Выйти"
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {items.map((item) => {
          const isActive =
            location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

          return (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.6} />}
              active={isActive}
              onClick={closeMenu}
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
});
import React from 'react';
import { Group, Button, Burger, Drawer, Stack, Text, Badge, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconLogout, IconDashboard, IconMicrophone } from '@tabler/icons-react';
import Logo from './Logo';
import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';

export default function SiteHeader() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <>
      <Group h="100%" px="md" justify="space-between" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }} onClick={close}>
          <Logo size={28} />
          <Text fw={700} size="md" c="dark">Bhasa Detect</Text>
        </Group>

        {/* Desktop Links */}
        {user ? (
          <Group gap="sm" visibleFrom="sm">
            <Button variant={location.pathname === '/dashboard' ? 'filled' : 'subtle'} color="dark" component={Link} to="/dashboard">Dashboard</Button>
            <Button variant={location.pathname === '/record' ? 'filled' : 'subtle'} color="dark" component={Link} to="/record">Record</Button>
            <Badge variant="light" color="gray" ml="md" style={{ textTransform: 'none' }}>{profile?.name || user}</Badge>
            <ActionIcon variant="subtle" color="gray" onClick={handleLogout} title="Logout" ml="xs">
              <IconLogout size={20} stroke={1.5} />
            </ActionIcon>
          </Group>
        ) : (
          <Group gap="sm" visibleFrom="sm">
            <Button variant="subtle" color="dark" component={Link} to="/login">Sign In</Button>
          </Group>
        )}

        {/* Mobile Burger */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Group>

      {/* Mobile Drawer */}
      <Drawer opened={opened} onClose={close} size="xs" padding="md" title={<Text fw={700}>Menu</Text>} hiddenFrom="sm">
        <Stack gap="sm" mt="md">
          {user ? (
            <>
              <Text size="sm" c="dimmed" mb="xs">Logged in as {profile?.name || user}</Text>
              <Button variant={location.pathname === '/dashboard' ? 'filled' : 'light'} color="dark" component={Link} to="/dashboard" onClick={close} leftSection={<IconDashboard size={18}/>}>Dashboard</Button>
              <Button variant={location.pathname === '/record' ? 'filled' : 'light'} color="dark" component={Link} to="/record" onClick={close} leftSection={<IconMicrophone size={18}/>}>Record</Button>
              <Button variant="subtle" color="gray" mt="xl" onClick={handleLogout} leftSection={<IconLogout size={18}/>}>Logout</Button>
            </>
          ) : (
            <Button variant="light" color="dark" component={Link} to="/login" onClick={close}>Sign In</Button>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

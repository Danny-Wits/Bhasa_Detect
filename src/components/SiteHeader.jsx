import React from 'react';
import { Group, Button, Burger, Drawer, Stack, Text, Badge, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconLogout, IconDashboard, IconMicrophone, IconInfoCircle, IconHome } from '@tabler/icons-react';
import Logo from './Logo';
import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';

export default function SiteHeader({ hideDashboard = false }) {
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

  const isActive = (path) => location.pathname === path;

  const navBtn = (to, label) => (
    <Button
      variant={isActive(to) ? 'light' : 'subtle'}
      color={isActive(to) ? 'indigo' : 'gray'}
      component={Link}
      to={to}
      size="sm"
    >
      {label}
    </Button>
  );

  return (
    <>
      <Group
        h="100%"
        px="md"
        justify="space-between"
        style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}
      >
        {/* Brand */}
        <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }} onClick={close}>
          <Logo size={28} />
          <Text fw={700} size="md" c="dark">Bhasa Detect</Text>
        </Group>

        {/* Desktop nav */}
        <Group gap="xs" visibleFrom="sm">
          {navBtn('/', 'Home')}
          {navBtn('/about', 'About')}
          {user && !hideDashboard && navBtn('/dashboard', 'Dashboard')}
          {user && navBtn('/record', 'Record')}

          {user ? (
            <Group gap="xs" ml="sm">
              <Badge variant="light" color="indigo" style={{ textTransform: 'none' }}>
                {profile?.name || user}
              </Badge>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={handleLogout}
                title="Logout"
              >
                <IconLogout size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          ) : (
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              size="sm"
              component={Link}
              to="/login"
              ml="sm"
            >
              Sign In
            </Button>
          )}
        </Group>

        {/* Mobile burger */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Group>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        padding="md"
        title={<Text fw={700}>Menu</Text>}
        hiddenFrom="sm"
      >
        <Stack gap="sm" mt="md">
          {user ? (
            <>
              <Text size="sm" c="dimmed" mb="xs">Logged in as {profile?.name || user}</Text>
              <Button
                variant="subtle" color="gray"
                component={Link} to="/" onClick={close}
                leftSection={<IconHome size={16} />}
              >
                Home
              </Button>
              <Button
                variant="subtle" color="gray"
                component={Link} to="/about" onClick={close}
                leftSection={<IconInfoCircle size={16} />}
              >
                About
              </Button>
              {!hideDashboard && (
                <Button
                  variant={isActive('/dashboard') ? 'light' : 'subtle'}
                  color={isActive('/dashboard') ? 'indigo' : 'gray'}
                  component={Link} to="/dashboard" onClick={close}
                  leftSection={<IconDashboard size={16} />}
                >
                  Dashboard
                </Button>
              )}
              <Button
                variant={isActive('/record') ? 'light' : 'subtle'}
                color={isActive('/record') ? 'indigo' : 'gray'}
                component={Link} to="/record" onClick={close}
                leftSection={<IconMicrophone size={16} />}
              >
                Record
              </Button>
              <Button
                variant="subtle" color="red" mt="xl"
                onClick={handleLogout}
                leftSection={<IconLogout size={16} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="subtle" color="gray" component={Link} to="/" onClick={close}
                leftSection={<IconHome size={16} />}>Home</Button>
              <Button variant="subtle" color="gray" component={Link} to="/about" onClick={close}
                leftSection={<IconInfoCircle size={16} />}>About</Button>
              <Button
                variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}
                component={Link} to="/login" onClick={close} mt="sm"
              >
                Sign In
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

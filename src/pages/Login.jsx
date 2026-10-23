import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Paper,
  Text,
  Stack,
  Center,
  Modal,
  Badge,
  Anchor,
  Alert,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../lib/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import Logo from '../components/Logo';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminOpened, { open: openAdmin, close: closeAdmin }] = useDisclosure(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        if (!username || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        await register(username, email, password);
        navigate('/onboarding');
      } else {
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = () => {
    if (adminPassword === 'admin') {
      closeAdmin();
      navigate('/admin');
    } else {
      setAdminError('Invalid password. Try "admin"');
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Admin Access Modal */}
      <Modal opened={adminOpened} onClose={closeAdmin} title="Administrator Access" centered>
        <PasswordInput
          label="Admin Password"
          placeholder="Enter administrator password"
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
            setAdminError('');
          }}
          error={adminError}
          data-autofocus
        />
        <Button fullWidth mt="md" color="indigo" onClick={handleAdminSubmit}>
          Access Admin Dashboard
        </Button>
      </Modal>

      <Container size="xs" style={{ width: '100%', maxWidth: '440px' }}>
        {/* Back Link */}
        <Center mb="lg">
          <Anchor
            component={Link}
            to="/"
            size="sm"
            c="dimmed"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <IconArrowLeft size={16} /> Return to Research Homepage
          </Anchor>
        </Center>

        <Paper withBorder shadow="sm" radius="md" p={{ base: 'xl', sm: 32 }} bg="white">
          <Stack align="center" gap="xs" mb="lg">
            <Center mb={4}>
              <Logo size={36} color="#4f46e5" />
            </Center>
            <Badge variant="light" color="indigo" size="sm">
              Academic Research Portal
            </Badge>
            <Title order={2} fz={22} fw={700} ta="center" c="gray.9">
              {isRegister ? 'Join Research Study' : 'Sign In to Your Account'}
            </Title>
            <Text c="dimmed" size="xs" ta="center" maw={320}>
              {isRegister
                ? 'Create a contributor profile to record speech samples for academic evaluation.'
                : 'Enter your credentials to continue your speech recording sessions.'}
            </Text>
          </Stack>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              mb="md"
              radius="md"
              p="xs"
            >
              <Text size="xs">{error}</Text>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              {isRegister && (
                <TextInput
                  label="Full Name"
                  placeholder="e.g. Rahul Sharma"
                  required
                  size="sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <TextInput
                label="Email Address"
                placeholder="name@example.com"
                required
                type="email"
                size="sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter password"
                required
                size="sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                mt="md"
                size="md"
                color="indigo"
                type="submit"
                loading={loading}
              >
                {isRegister ? 'Create Account & Continue' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Center mt="lg">
            <Text size="xs" c="dimmed">
              {isRegister ? 'Already registered? ' : "Don't have an account yet? "}
              <Anchor
                component="button"
                type="button"
                c="indigo.6"
                fw={600}
                onClick={() => {
                  setError('');
                  setIsRegister(!isRegister);
                }}
              >
                {isRegister ? 'Sign in here' : 'Sign up here'}
              </Anchor>
            </Text>
          </Center>

          <Center mt="xl" pt="xs" style={{ borderTop: '1px solid #f1f3f5' }}>
            <Anchor
              component="button"
              type="button"
              size="xs"
              c="gray.5"
              onClick={openAdmin}
            >
              Administrator Login
            </Anchor>
          </Center>
        </Paper>

        <Text ta="center" size="xs" c="gray.5" mt="md">
          Bahasa Detect · Dept. of Computer Science &amp; IT · University of Jammu
        </Text>
      </Container>
    </Box>
  );
}

import React, { useState, useEffect, useRef } from 'react';
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
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../lib/authContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IconAlertCircle, IconArrowLeft, IconClock, IconShieldLock } from '@tabler/icons-react';
import Logo from '../components/Logo';

const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout
const MAX_FAILED_ATTEMPTS = 4;
const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 minutes session

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hidden Admin Portal state
  const [adminOpened, { open: openAdmin, close: closeAdmin }] = useDisclosure(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Lockout & Session states
  const [adminAttempts, setAdminAttempts] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('bhasa_admin_attempts');
    return stored ? Number(stored) : 0;
  });
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('bhasa_admin_lockout');
    return stored ? Number(stored) : 0;
  });
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hidden 3-click trigger state on university footer
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Handle countdown timer during brute-force lockout
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setSecondsRemaining(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        sessionStorage.removeItem('bhasa_admin_lockout');
        sessionStorage.removeItem('bhasa_admin_attempts');
        setAdminAttempts(0);
        setLockoutUntil(0);
        setAdminError('');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Trigger 1: Query param check (?portal=eval or ?auth=admin) & Session expired notice (?expired=1)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('portal') === 'eval' || params.get('auth') === 'admin') {
      openAdmin();
    }
    if (params.get('expired') === '1') {
      setSessionExpiredNotice(true);
    }
  }, [location.search, openAdmin]);

  // Trigger 2: Secret key combo (Ctrl + Shift + A or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        openAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAdmin]);

  // Trigger 3: Secret 3 clicks on footer note
  const handleSecretFooterClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      openAdmin();
    } else {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

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

  const isLocked = secondsRemaining > 0;

  const handleAdminSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLocked) return;

    const valid = ['admin', 'admin123', 'bhasa2026', 'admin@bhasa'];
    if (valid.includes(adminPassword.trim().toLowerCase())) {
      // Clear brute-force counters
      sessionStorage.removeItem('bhasa_admin_attempts');
      sessionStorage.removeItem('bhasa_admin_lockout');

      // Set 15-minute active session
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      sessionStorage.setItem('bhasa_admin', 'true');
      sessionStorage.setItem('bhasa_admin_expires', String(expiresAt));

      closeAdmin();
      navigate('/sli-evaluation-portal');
    } else {
      const nextAttempts = adminAttempts + 1;
      setAdminAttempts(nextAttempts);
      sessionStorage.setItem('bhasa_admin_attempts', String(nextAttempts));

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        sessionStorage.setItem('bhasa_admin_lockout', String(lockoutTime));
        setLockoutUntil(lockoutTime);
        setAdminError(`Security lockout: ${MAX_FAILED_ATTEMPTS} failed attempts. Access blocked for 5 minutes.`);
      } else {
        const remainingTries = MAX_FAILED_ATTEMPTS - nextAttempts;
        setAdminError(`Invalid password. ${remainingTries} attempt${remainingTries > 1 ? 's' : ''} remaining before security lockout.`);
      }
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
      {/* Hidden Admin Access Modal */}
      <Modal
        opened={adminOpened}
        onClose={closeAdmin}
        title={
          <Group gap="xs">
            <IconShieldLock size={18} color="#4f46e5" />
            <Text fw={600} size="sm">Research Evaluation Gateway</Text>
          </Group>
        }
        centered
      >
        <form onSubmit={handleAdminSubmit}>
          <Stack gap="sm">
            {isLocked ? (
              <Alert
                icon={<IconClock size={16} />}
                color="red"
                variant="filled"
                radius="md"
              >
                <Text size="xs" fw={600}>
                  Security Lockout Active
                </Text>
                <Text size="xs" mt={4}>
                  Portal is locked due to repeated invalid attempts. Please wait {secondsRemaining}s before retrying.
                </Text>
              </Alert>
            ) : adminError ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                radius="md"
                p="xs"
              >
                <Text size="xs">{adminError}</Text>
              </Alert>
            ) : (
              <Text size="xs" c="dimmed">
                Restricted portal for research supervisors. Authenticate to inspect live database analytics and benchmarks.
              </Text>
            )}

            <PasswordInput
              label="Evaluation Portal Key"
              placeholder="Enter administrator password"
              value={adminPassword}
              disabled={isLocked}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setAdminError('');
              }}
              data-autofocus
            />

            <Button
              fullWidth
              mt="xs"
              color="indigo"
              type="submit"
              disabled={isLocked || !adminPassword.trim()}
            >
              {isLocked ? `Locked (${secondsRemaining}s)` : 'Verify & Enter Portal'}
            </Button>
          </Stack>
        </form>
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

          {sessionExpiredNotice && (
            <Alert
              icon={<IconClock size={16} />}
              color="yellow"
              variant="light"
              mb="md"
              radius="md"
              withCloseButton
              onClose={() => setSessionExpiredNotice(false)}
            >
              <Text size="xs" fw={500}>
                Your administrator session expired after 15 minutes of inactivity. Please re-authenticate.
              </Text>
            </Alert>
          )}

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
        </Paper>

        {/* Hidden 3-click trigger on the university note */}
        <Text
          ta="center"
          size="xs"
          c="gray.5"
          mt="md"
          onClick={handleSecretFooterClick}
          style={{ userSelect: 'none', cursor: 'default' }}
          title="Bhasa Detect · JU"
        >
          Bahasa Detect · Dept. of Computer Science &amp; IT · University of Jammu
        </Text>
      </Container>
    </Box>
  );
}

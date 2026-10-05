import React, { useState } from 'react';
import { TextInput, Button, Container, Title, Paper, Text, Stack, SimpleGrid, ThemeIcon, Center, Modal, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../lib/authContext';
import { useNavigate } from 'react-router-dom';
import { IconMicrophone, IconBrain } from '@tabler/icons-react';

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

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        if (!username || !email || !password) {
          throw new Error("Please fill in all fields.");
        }
        await register(username, email, password);
        navigate('/onboarding');
      } else {
        if (!email || !password) {
          throw new Error("Please fill in all fields.");
        }
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
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
    <>
      <Modal opened={adminOpened} onClose={closeAdmin} title="Admin Access">
        <PasswordInput
          label="Admin Password"
          placeholder="Enter password"
          value={adminPassword}
          onChange={(e) => {
            setAdminPassword(e.target.value);
            setAdminError('');
          }}
          error={adminError}
          data-autofocus
        />
        <Button fullWidth mt="md" onClick={handleAdminSubmit}>
          Access Dashboard
        </Button>
      </Modal>

      <Container size="md" my={60}>
        <Paper withBorder shadow="xl" p={0} radius="lg" style={{ overflow: 'hidden' }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
            {/* Left Side: Art & Info */}
            <div style={{ backgroundColor: '#1a1b1e', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Center mb="xl">
                <IconBrain size={120} stroke={1} color="var(--mantine-color-gray-4)" />
              </Center>
              <Title order={2} c="white" mb="sm">Spoken Language Identification</Title>
              <Text c="gray.5" size="sm">
                A research project investigating deep learning approaches for automatic identification of spoken Hindi, English, and Dogri.
              </Text>
            </div>

            {/* Right Side: Login Form */}
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Stack align="center" mb="xl">
                <ThemeIcon size={60} radius="xl">
                  <IconMicrophone size={34} />
                </ThemeIcon>
                <Title order={3} ta="center">Welcome</Title>
                <Text c="dimmed" size="sm" ta="center">
                  {isRegister ? "Create an account to contribute" : "Sign in to continue your journey."}
                </Text>
              </Stack>

              {error && <Text c="red" size="sm" ta="center" mb="md">{error}</Text>}

              {isRegister && (
                <TextInput 
                  label="Name" 
                  placeholder="e.g. Alex" 
                  required 
                  size="md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  mb="md"
                />
              )}
              
              <TextInput 
                label="Email Address" 
                placeholder="e.g. alex@example.com" 
                required
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mb="md"
              />

              <PasswordInput 
                label="Password" 
                placeholder="Your password" 
                required
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button fullWidth mt="xl" size="md" onClick={handleSubmit} loading={loading}>
                {isRegister ? "Sign Up" : "Login"}
              </Button>

              <Text ta="center" mt="md" size="sm">
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <Text component="span" c="blue" style={{cursor: 'pointer'}} onClick={() => setIsRegister(!isRegister)}>
                  {isRegister ? "Login here" : "Sign up here"}
                </Text>
              </Text>

              <Button 
                fullWidth 
                mt="xl" 
                size="sm" 
                variant="subtle"
                color="gray"
                onClick={openAdmin}
              >
                Admin Access
              </Button>
            </div>
          </SimpleGrid>
        </Paper>
      </Container>
    </>
  );
}

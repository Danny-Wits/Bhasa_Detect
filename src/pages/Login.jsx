import React, { useState } from 'react';
import { TextInput, Button, Container, Title, Paper, Text, Image, Stack, SimpleGrid, ThemeIcon } from '@mantine/core';
import { useAuth } from '../lib/authContext';
import { useNavigate } from 'react-router-dom';
import { IconMicrophone } from '@tabler/icons-react';
import loginArt from '../assets/login_art.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = () => {
    if (username.trim()) {
      login(username);
      navigate('/');
    }
  };

  return (
    <Container size="md" my={60}>
      <Paper withBorder shadow="xl" p={0} radius="lg" style={{ overflow: 'hidden' }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
          {/* Left Side: Art & Info */}
          <div style={{ backgroundColor: 'var(--mantine-color-blue-filled)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Image src={loginArt} alt="AI Audio Analysis" radius="md" mb="xl" />
            <Title order={2} c="white" mb="sm">Voice the Future</Title>
            <Text c="blue.1" size="sm">
              Join Bhasa Detect to help train the next generation of multilingual AI models. Your voice is the key to breaking language barriers.
            </Text>
          </div>

          {/* Right Side: Login Form */}
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack align="center" mb="xl">
              <ThemeIcon size={60} radius="xl" color="blue" variant="light">
                <IconMicrophone size={34} />
              </ThemeIcon>
              <Title order={3} ta="center">Welcome Back</Title>
              <Text c="dimmed" size="sm" ta="center">Sign in to continue your journey.</Text>
            </Stack>

            <TextInput 
              label="Username" 
              placeholder="e.g. alex_dev" 
              required 
              size="md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button fullWidth mt="xl" size="md" onClick={handleLogin}>
              Start Recording
            </Button>
          </div>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}

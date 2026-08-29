import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Group,
  SimpleGrid, ThemeIcon, Stack, Image, Paper
} from '@mantine/core';
import { IconMicrophone, IconBrain, IconGlobe, IconArrowRight } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import Logo from '../components/Logo';
import landingHeroWhite from '../assets/landing_hero_white.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: IconMicrophone,
      title: 'Speak Naturally',
      description: 'Read generated sentences in your native language. We currently support English, Hindi, and Dogri.',
    },
    {
      icon: IconBrain,
      title: 'Train Advanced AI',
      description: 'Your voice samples directly contribute to training the next generation of multilingual speech recognition models.',
    },
    {
      icon: IconGlobe,
      title: 'Break Barriers',
      description: 'Help us build technology that understands every dialect and accent, making AI accessible to everyone.',
    },
  ];

  return (
    <AppShell header={{ height: 60 }} padding="0">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }}>
              <Logo size={32} />
              <Text fw={700} size="lg" variant="gradient" gradient={{ from: 'blue.7', to: 'grape.7', deg: 45 }}>
                Bhasa Detect
              </Text>
            </Group>
            {user ? (
              <Button variant="light" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button variant="light" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {/* Hero Section */}
        <div className="hero-wrapper">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
          <div className="floating-shape shape-6"></div>

          <Container size="xl" py={5} style={{ position: 'relative', zIndex: 1 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">
              <Stack justify="center" align='center' >
                <Title fz={{ base: 36, sm: 48, md: 56 }} lh={1.1} fw={900} mb="md">
                  Teach AI to understand{' '}
                  <Text component="span" variant="gradient" gradient={{ from: 'blue.7', to: 'grape.7', deg: 45 }} inherit>
                    your language.
                  </Text>
                </Title>
                <Text c="dimmed" fz={{ base: 'md', sm: 'lg', md: 'xl' }} mb="xl" style={{ maxWidth: 500 }}>
                  Bhasa Detect is a community-driven data collection platform. Contribute your voice to help train state-of-the-art multilingual models.
                </Text>
                <Group>
                  <Button rightSection={<IconArrowRight size={20} />} onClick={() => navigate(user ? '/dashboard' : '/login')}>
                    Start Contributing
                  </Button>
                  <Button variant="default" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                    Learn More
                  </Button>
                </Group>
              </Stack>
              <div style={{ position: 'relative' }}>
                <Image
                  src={landingHeroWhite}
                  alt="AI Voice Network"
                  radius="md"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </SimpleGrid>
          </Container>
        </div>

        {/* Features Section */}
        <div id="how-it-works" style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '80px 0' }}>
          <Container size="xl">
            <Title ta="center" mb="xl">How it works</Title>
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              {features.map((feature) => (
                <Paper key={feature.title} p="xl" radius="md" withBorder shadow="sm">
                  <ThemeIcon size={60} radius="md" mb="md" variant="light">
                    <feature.icon size={34} />
                  </ThemeIcon>
                  <Title order={3} mb="sm">{feature.title}</Title>
                  <Text c="dimmed">{feature.description}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* CTA Footer */}
        <Container size="xl" py={80} ta="center">
          <Title order={2} mb="md">Ready to make an impact?</Title>
          <Text c="dimmed" size="lg" mb="xl">
            Join thousands of contributors helping to build the future of voice AI.
          </Text>
          <Button onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Go to your Dashboard' : 'Join Bhasa Detect Today'}
          </Button>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

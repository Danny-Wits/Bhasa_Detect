import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Group,
  SimpleGrid, ThemeIcon, Stack, Image, Paper, Badge, Center, Divider, List
} from '@mantine/core';
import {
  IconMicrophone, IconBrain, IconGlobe, IconArrowRight,
  IconShieldCheck, IconChartBar, IconLanguage, IconDeviceAnalytics,
  IconNumber1, IconNumber2, IconNumber3, IconNumber4, IconNumber5
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import Logo from '../components/Logo';
import landingHeroWhite from '../assets/landing_hero_white_nobg.png';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    { icon: IconNumber1, title: 'Create Your Profile', desc: 'Sign up and tell us your name, age, place, and which language combination you speak.' },
    { icon: IconNumber2, title: 'Choose Your Languages', desc: 'Pick from Hindi + English, Hindi + Dogri, English + Dogri, or all three combined.' },
    { icon: IconNumber3, title: 'Read the Sentences', desc: 'You\'ll see 5 sentences in your selected languages. Read each one aloud — the mic activates automatically.' },
    { icon: IconNumber4, title: 'AI Predicts the Language', desc: 'Our CNN-LSTM model extracts MFCC features from your voice and predicts Hindi, English, Dogri, or Other in real time.' },
    { icon: IconNumber5, title: 'Get Your Results', desc: 'See your accuracy, confidence scores, and a detailed breakdown. Your audio is never stored — only metadata is saved.' },
  ];

  const languages = [
    { name: 'Hindi', script: 'हिंदी', speakers: '600M+', desc: 'The most widely spoken language in India, serving as a lingua franca across the Hindi Belt.' },
    { name: 'English', script: 'English', speakers: '1.5B+', desc: 'A global language of science and technology, spoken natively and as a second language worldwide.' },
    { name: 'Dogri', script: 'डोगरी', speakers: '3M+', desc: 'An Indo-Aryan language spoken in Jammu & Kashmir — an underrepresented language in AI research.' },
  ];

  return (
    <AppShell header={{ height: 60 }} padding="0">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }}>
              <Logo size={32} />
              <Text fw={700} size="lg" c="dark">
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
        {/* ─── HERO ─── */}
        <div className="hero-wrapper">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
          <div className="floating-shape shape-6"></div>
          <div className="floating-shape shape-7"></div>
          <div className="floating-shape shape-8"></div>
          <div className="floating-shape shape-9"></div>
          <div className="floating-shape shape-10"></div>
          <div className="floating-shape shape-11"></div>
          <div className="floating-shape shape-12"></div>

          <Container size="xl" py={{ base: 60, md: 100 }} style={{ position: 'relative', zIndex: 1 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">
              <Stack justify="center" align={{ base: 'center', md: 'flex-start' }}>
                <Badge size="lg" variant="dot" color="dark" mb="xs">
                   Spoken Language Identification
                </Badge>
                <Title fz={{ base: 32, sm: 44, md: 52 }} lh={1.1} fw={900} ta={{ base: 'center', md: 'left' }}>
                  Help AI understand{' '}
                  <Text component="span" td="underline" style={{ textDecorationColor: 'var(--mantine-color-gray-4)' }} inherit>
                    every voice,
                  </Text>{' '}
                  every language.
                </Title>
                <Text c="dimmed" fz={{ base: 'md', md: 'lg' }} ta={{ base: 'center', md: 'left' }} maw={520}>
                  Bhasa Detect is a research platform that evaluates spoken language identification accuracy
                  for Hindi, English, and Dogri. Speak naturally — our CNN-LSTM model does the rest.
                  Your voice helps build better, more inclusive AI.
                </Text>
                <Group mt="md">
                  <Button rightSection={<IconArrowRight size={18} />} onClick={() => navigate(user ? '/record' : '/login')}>
                    Start Evaluation
                  </Button>
                  <Button variant="default" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                    How It Works
                  </Button>
                </Group>

                {/* Trust badges */}
                <Group gap="xl" mt="lg">
                  <Group gap={6}>
                    <IconShieldCheck size={18} color="var(--mantine-color-dark-4)" />
                    <Text size="xs" c="dimmed">Audio never stored</Text>
                  </Group>
                  <Group gap={6}>
                    <IconChartBar size={18} color="var(--mantine-color-dark-4)" />
                    <Text size="xs" c="dimmed">Real-time analysis</Text>
                  </Group>
                  <Group gap={6}>
                    <IconLanguage size={18} color="var(--mantine-color-dark-4)" />
                    <Text size="xs" c="dimmed">3 languages</Text>
                  </Group>
                </Group>
              </Stack>

              <div style={{ position: 'relative' }}>
                <Image
                  src={landingHeroWhite}
                  alt="AI Voice Network"
                  style={{ mixBlendMode: 'multiply', filter: 'grayscale(100%) contrast(200%) brightness(0.7)', opacity: 1 }}
                />
              </div>
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── HOW IT WORKS ─── */}
        <div id="how-it-works" style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '80px 0' }}>
          <Container size="xl">
            <Stack align="center" mb={40}>
              <Badge variant="light" color="dark">Step by Step</Badge>
              <Title order={2} ta="center">How It Works</Title>
              <Text c="dimmed" ta="center" maw={600}>
                The entire evaluation is automated. You just read sentences — the system handles
                feature extraction, model inference, and result reporting.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="lg">
              {steps.map((step) => (
                <Paper key={step.title} p="lg" radius="md" withBorder shadow="sm" ta="center">
                  <ThemeIcon size={48} radius="xl" mb="md">
                    <step.icon size={24} />
                  </ThemeIcon>
                  <Text fw={600} mb="xs">{step.title}</Text>
                  <Text c="dimmed" size="sm">{step.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── SUPPORTED LANGUAGES ─── */}
        <Container size="xl" py={80}>
          <Stack align="center" mb={40}>
            <Badge variant="light" color="dark">Multilingual</Badge>
            <Title order={2} ta="center">Supported Languages</Title>
            <Text c="dimmed" ta="center" maw={600}>
              Our SLI model currently supports three languages with distinct phonetic characteristics,
              enabling fine-grained language identification research.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {languages.map((lang) => (
              <Paper key={lang.name} withBorder p="xl" radius="md" shadow="sm">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={700} size="lg">{lang.name}</Text>
                    <Text c="dimmed" size="sm">{lang.script}</Text>
                  </div>
                  <Badge variant="light" color="gray">{lang.speakers} speakers</Badge>
                </Group>
                <Text c="dimmed" size="sm">{lang.desc}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>

        {/* ─── FOR RESEARCHERS ─── */}
        <div style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '80px 0' }}>
          <Container size="xl">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">
              <div>
                <Badge variant="light" color="dark" mb="md">For Researchers</Badge>
                <Title order={2} mb="md">Comprehensive Evaluation Reports</Title>
                <Text c="dimmed" mb="lg">
                  Each speaker session generates detailed analytics that researchers can use to
                  study language identification performance across demographics, dialects, and conditions.
                </Text>
                <List spacing="sm" size="sm" c="dimmed" icon={<IconDeviceAnalytics size={16} color="var(--mantine-color-dark-4)" />}>
                  <List.Item>Overall accuracy, precision, recall, and F1-score per language</List.Item>
                  <List.Item>Confusion matrix and language transition analysis</List.Item>
                  <List.Item>Confidence distribution and error categorization</List.Item>
                  <List.Item>Speech duration, silence ratio, and pause analysis</List.Item>
                  <List.Item>Speaker-wise and session-wise performance tracking</List.Item>
                  <List.Item>Processing latency and real-time detection metrics</List.Item>
                </List>
              </div>
              <Paper withBorder p="xl" radius="md" bg="white">
                <Stack gap="md">
                  <Text fw={600} size="lg">Sample Metrics Dashboard</Text>
                  <SimpleGrid cols={2}>
                    {[
                      { label: 'Macro F1', value: '0.87' },
                      { label: 'Weighted F1', value: '0.89' },
                      { label: 'Error Rate', value: '13%' },
                      { label: 'Avg. Latency', value: '340ms' },
                      { label: 'Switch Detection', value: '91%' },
                      { label: 'Sessions Processed', value: '142' },
                    ].map((m) => (
                      <Paper key={m.label} withBorder p="sm" radius="md" ta="center">
                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{m.label}</Text>
                        <Text fw={700} fz={20}>{m.value}</Text>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── CTA ─── */}
        <Container size="xl" py={80} ta="center">
          <Title order={2} mb="md">Ready to contribute to AI research?</Title>
          <Text c="dimmed" size="lg" mb="xl" maw={500} mx="auto">
            It takes less than 5 minutes. Speak 5 sentences and help us build better
            spoken language identification for underrepresented languages.
          </Text>
          <Button onClick={() => navigate(user ? '/record' : '/login')}>
            {user ? 'Start a New Session' : 'Get Started — It\'s Free'}
          </Button>
        </Container>

        {/* ─── FOOTER ─── */}
        <Divider />
        <Container size="xl" py="lg">
          <Group justify="space-between">
            <Group gap="sm">
              <Logo size={20} />
              <Text size="sm" c="dimmed">Bhasa Detect — Spoken Language Identification Evaluation System</Text>
            </Group>
            <Text size="xs" c="dimmed">Built for research. Audio is never permanently stored.</Text>
          </Group>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

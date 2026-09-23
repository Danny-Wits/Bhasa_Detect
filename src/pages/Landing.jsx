import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Group,
  SimpleGrid, ThemeIcon, Stack, Paper, Badge, Box, ActionIcon,
  Divider, Grid, Anchor
} from '@mantine/core';
import {
  IconArrowRight, IconShieldCheck, IconChartBar, IconLanguage,
  IconChevronDown, IconUserPlus, IconSelect, IconMicrophone2,
  IconBrain, IconReportAnalytics, IconLock, IconMapPin,
  IconBook, IconUsersGroup, IconSparkles
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import Logo from '../components/Logo';
import SiteHeader from '../components/SiteHeader';
import HeroWaveform from '../components/HeroWaveform';

// ─── DATA ────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    icon: IconUserPlus,
    title: 'Create Your Profile',
    desc: 'Set up your profile before starting the language identification process.',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    number: '02',
    icon: IconSelect,
    title: 'Choose Your Language',
    desc: 'Select from Hindi, English, or Dogri.',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    number: '03',
    icon: IconMicrophone2,
    title: 'Speak Naturally',
    desc: 'Provide a natural speech sample through your microphone.',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    number: '04',
    icon: IconBrain,
    title: 'Analyze Your Voice',
    desc: 'Our model extracts meaningful features from your voice and predicts the spoken language in real time.',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    number: '05',
    icon: IconReportAnalytics,
    title: 'View Your Results',
    desc: 'See your prediction, accuracy, confidence score, spectrogram, and technical specifications.',
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    number: '06',
    icon: IconLock,
    title: 'Privacy First',
    desc: 'Your audio is not stored — only metadata is saved.',
    color: '#6366f1',
    bg: '#eef2ff',
  },
];

const languages = [
  {
    name: 'Hindi',
    script: 'हिंदी',
    desc: 'The most widely spoken language in India, serving as a lingua franca across the Hindi Belt.',
    accentColor: '#f59e0b',
    accentBg: '#fffbeb',
    flag: '🇮🇳',
  },
  {
    name: 'English',
    script: 'English',
    desc: 'A global language of science and technology, spoken natively and as a second language worldwide.',
    accentColor: '#3b82f6',
    accentBg: '#eff6ff',
    flag: '🌐',
  },
  {
    name: 'Dogri',
    script: 'डोगरी',
    desc: 'An Indo-Aryan language spoken in Jammu & Kashmir — an underrepresented language in AI research.',
    accentColor: '#10b981',
    accentBg: '#ecfdf5',
    flag: '🏔️',
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppShell header={{ height: 60 }} padding="0">
      <AppShell.Header>
        <SiteHeader />
      </AppShell.Header>

      <AppShell.Main>

        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <div
          className="hero-wrapper"
          style={{
            background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #faf8ff 100%)',
          }}
        >
          <div className="floating-shape shape-1" />
          <div className="floating-shape shape-2" />
          <div className="floating-shape shape-3" />
          <div className="floating-shape shape-5" />

          <Container size="xl" py={{ base: 60, md: 100 }} style={{ position: 'relative', zIndex: 1 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">

              {/* Left — Copy */}
              <Stack justify="center" align={{ base: 'center', md: 'flex-start' }}>
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  mb="xs"
                >
                  Spoken Language Identification Research
                </Badge>

                <Title
                  fz={{ base: 32, sm: 44, md: 50 }}
                  lh={1.15}
                  fw={800}
                  ta={{ base: 'center', md: 'left' }}
                >
                  Speak naturally.{' '}
                  <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    inherit
                  >
                    Let AI identify
                  </Text>{' '}
                  the language in your voice.
                </Title>

                <Text
                  c="dimmed"
                  fz={{ base: 'md', md: 'lg' }}
                  ta={{ base: 'center', md: 'left' }}
                  maw={520}
                  mt="xs"
                >
                  Bahasa Detect uses speech processing and deep learning to identify spoken
                  Hindi, English, and Dogri in real time.
                </Text>

                <Group mt="lg">
                  <Button
                    size="md"
                    rightSection={<IconArrowRight size={18} />}
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    onClick={() => navigate(user ? '/record' : '/login')}
                  >
                    Start Recording
                  </Button>
                  <Button
                    size="md"
                    variant="default"
                    component={Link}
                    to="/about"
                  >
                    About the Research
                  </Button>
                </Group>

                {/* Trust badges */}
                <Group gap="xl" mt="lg">
                  <Group gap={6}>
                    <IconShieldCheck size={18} color="#10b981" />
                    <Text size="xs" c="dimmed">Audio not stored</Text>
                  </Group>
                  <Group gap={6}>
                    <IconChartBar size={18} color="#3b82f6" />
                    <Text size="xs" c="dimmed">Real-time analysis</Text>
                  </Group>
                  <Group gap={6}>
                    <IconLanguage size={18} color="#8b5cf6" />
                    <Text size="xs" c="dimmed">3 languages</Text>
                  </Group>
                </Group>
              </Stack>

              {/* Right — Waveform */}
              <Box
                onClick={() => navigate(user ? '/record' : '/login')}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                style={{
                  position: 'relative',
                  height: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease',
                }}
              >
                <HeroWaveform />
              </Box>
            </SimpleGrid>
          </Container>

          {/* Scroll cue */}
          <Box
            visibleFrom="md"
            className="scroll-bounce"
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
            onClick={() =>
              document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ActionIcon size="xl" radius="xl" variant="transparent" color="gray">
              <IconChevronDown size={36} stroke={1.5} />
            </ActionIcon>
          </Box>
        </div>

        {/* ─── HOW IT WORKS ──────────────────────────────────────────────── */}
        <div
          id="how-it-works"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
            padding: '90px 0',
          }}
        >
          <Container size="xl">
            <Stack align="center" mb={56}>
              <Badge variant="light" color="indigo" size="lg">Step by Step</Badge>
              <Title order={2} ta="center" fz={{ base: 28, md: 36 }}>
                How It Works
              </Title>
              <Text c="dimmed" ta="center" maw={600} size="lg">
                From signing up to seeing your results — here is the full process.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {steps.map((step) => (
                <Paper
                  key={step.number}
                  p="xl"
                  radius="lg"
                  withBorder
                  style={{
                    borderColor: `${step.color}22`,
                    background: `linear-gradient(135deg, white 60%, ${step.bg} 100%)`,
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <Group mb="md" align="flex-start">
                    <ThemeIcon
                      size={48}
                      radius="xl"
                      style={{ background: step.bg, color: step.color, flexShrink: 0 }}
                      variant="light"
                    >
                      <step.icon size={24} />
                    </ThemeIcon>
                    <Text fw={800} fz={28} c="gray.2" lh={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {step.number}
                    </Text>
                  </Group>
                  <Text fw={700} mb="xs" size="md">{step.title}</Text>
                  <Text c="dimmed" size="sm">{step.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── SUPPORTED LANGUAGES ───────────────────────────────────────── */}
        <div style={{ padding: '90px 0' }}>
          <Container size="xl">
            <Stack align="center" mb={56}>
              <Badge variant="light" color="indigo" size="lg">Supported Languages</Badge>
              <Title order={2} ta="center" fz={{ base: 28, md: 36 }}>
                Three Languages. One Platform.
              </Title>
              <Text c="dimmed" ta="center" maw={600} size="lg">
                Our model currently supports three languages with distinct phonetic characteristics,
                enabling fine-grained spoken language identification research.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              {languages.map((lang) => (
                <Paper
                  key={lang.name}
                  p="xl"
                  radius="lg"
                  withBorder
                  style={{
                    borderTop: `4px solid ${lang.accentColor}`,
                    background: `linear-gradient(160deg, white 50%, ${lang.accentBg} 100%)`,
                  }}
                >
                  <Group mb="md">
                    <Text fz={32}>{lang.flag}</Text>
                    <div>
                      <Text fw={700} size="xl">{lang.name}</Text>
                      <Text size="md" style={{ color: lang.accentColor }} fw={500}>{lang.script}</Text>
                    </div>
                  </Group>
                  <Text c="dimmed" size="sm">{lang.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── CTA ───────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            padding: '90px 0',
          }}
        >
          <Container size="md" ta="center">
            <Stack align="center" gap="lg">
              <Badge variant="white" color="indigo" size="lg">Contribute to Research</Badge>
              <Title order={2} c="white" fz={{ base: 28, md: 40 }}>
                Ready to contribute to AI research?
              </Title>
              <Text c="rgba(255,255,255,0.85)" size="lg" maw={520}>
                It takes less than 5 minutes. Speak a few sentences and help build better
                spoken language identification for underrepresented languages.
              </Text>
              <Button
                size="lg"
                variant="white"
                color="indigo"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => navigate(user ? '/record' : '/login')}
              >
                {user ? 'Start a New Session' : 'Get Started — It\'s Free'}
              </Button>
            </Stack>
          </Container>
        </div>

        {/* ─── FOOTER ────────────────────────────────────────────────────── */}
        <div style={{ background: '#0f172a', padding: '60px 0 40px' }}>
          <Container size="xl">
            <Grid gutter="xl" mb={40}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Group gap="sm" mb="sm">
                  <Logo size={24} color="white" />
                  <Text fw={700} size="lg" c="white">Bahasa Detect</Text>
                </Group>
                <Text size="sm" c="rgba(255,255,255,0.5)" maw={340} lh={1.7}>
                  A research initiative in Spoken Language Identification
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="xs" tt="uppercase" fw={700} c="rgba(255,255,255,0.4)" mb="sm" ls={1}>
                  Researcher
                </Text>
                <Text size="sm" c="rgba(255,255,255,0.85)" fw={600}>Sneha Choudhary</Text>
                <Text size="sm" c="rgba(255,255,255,0.5)">Ph.D. Scholar</Text>
                <Text size="sm" c="rgba(255,255,255,0.5)">Department of Computer Science &amp; IT</Text>
                <Text size="sm" c="rgba(255,255,255,0.5)">University of Jammu, Jammu &amp; Kashmir, India</Text>
                <Text size="sm" c="rgba(255,255,255,0.4)" mt="xs">
                  Under the supervision of{' '}
                  <Text component="span" c="rgba(255,255,255,0.65)" fw={600}>Prof. Pawanesh Abrol</Text>
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text size="xs" tt="uppercase" fw={700} c="rgba(255,255,255,0.4)" mb="sm" ls={1}>
                  Navigate
                </Text>
                <Stack gap={6}>
                  {[
                    { label: 'Home', to: '/' },
                    { label: 'About', to: '/about' },
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Record', to: '/record' },
                  ].map((l) => (
                    <Anchor key={l.label} component={Link} to={l.to} size="sm" c="rgba(255,255,255,0.5)"
                      style={{ textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                    >
                      {l.label}
                    </Anchor>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider color="rgba(255,255,255,0.08)" mb="md" />

            <Group justify="space-between" wrap="wrap">
              <Text size="xs" c="rgba(255,255,255,0.3)">
                © 2026 Bahasa Detect · Research Project · University of Jammu
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.3)">
                Department of Computer Science &amp; IT
              </Text>
            </Group>
          </Container>
        </div>

      </AppShell.Main>
    </AppShell>
  );
}

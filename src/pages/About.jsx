import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Group,
  SimpleGrid, ThemeIcon, Stack, Paper, Badge,
  Divider, Grid, Anchor, Avatar
} from '@mantine/core';
import {
  IconBrain, IconChartBar, IconMicrophone2, IconLanguage,
  IconArrowRight, IconBook, IconTargetArrow, IconUsersGroup
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import Logo from '../components/Logo';
import SiteHeader from '../components/SiteHeader';

const researchFocus = [
  { icon: IconMicrophone2, label: 'Speech Processing', color: '#3b82f6', bg: '#eff6ff' },
  { icon: IconBrain, label: 'Deep Learning', color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: IconLanguage, label: 'Low-Resource Languages', color: '#10b981', bg: '#ecfdf5' },
  { icon: IconBook, label: 'Indian Language Technology', color: '#f59e0b', bg: '#fffbeb' },
  { icon: IconTargetArrow, label: 'Spoken Language Identification', color: '#ef4444', bg: '#fef2f2' },
];

const cnnLayers = [
  {
    step: 'Input Stage',
    title: 'Acoustic Feature Map',
    desc: '40-band Mel-Frequency Cepstral Coefficients (MFCCs) extracted from 16 kHz audio signals framed over continuous time windows.',
  },
  {
    step: 'Convolutional Blocks',
    title: '2D Convolution & Pooling',
    desc: 'Hierarchical 2D convolutional layers extract localized time-frequency acoustic patterns, paired with max-pooling downsampling.',
  },
  {
    step: 'Regularization',
    title: 'Dropout & Normalization',
    desc: 'Batch normalization and dropout layers reduce overfitting, ensuring robust generalization across varying recording environments.',
  },
  {
    step: 'Output Stage',
    title: 'Dense Softmax Classifier',
    desc: 'Fully connected dense layers map phonological representations into classification probabilities across Dogri, Hindi, and English.',
  },
];

const representations = [
  { name: 'MFCC', desc: 'Mel-Frequency Cepstral Coefficients — compact perceptual features widely used in speech recognition.' },
  { name: 'Mel-Spectrogram', desc: 'Time-frequency representation aligned to the human auditory scale.' },
  { name: 'Acoustic Speech Features', desc: 'Prosodic, spectral, formant, and voice-quality features for richer characterisation.' },
];

const objectives = [
  { num: '01', label: 'Spoken Language Identification', icon: IconMicrophone2 },
  { num: '02', label: 'Speech Feature Analysis', icon: IconChartBar },
  { num: '03', label: 'Dogri Language Technology', icon: IconLanguage },
  { num: '04', label: 'Inclusive AI', icon: IconUsersGroup },
];

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppShell header={{ height: 60 }} padding="0">
      <AppShell.Header>
        <SiteHeader />
      </AppShell.Header>

      <AppShell.Main>

        {/* ─── PAGE HERO ─────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#0f172a',
            padding: '80px 0 70px',
          }}
        >
          <Container size="xl">
            <Stack align="center" gap="md">
              <Badge variant="light" color="indigo" size="lg">
                Research Overview
              </Badge>
              <Title order={1} ta="center" c="white" fz={{ base: 32, md: 48 }} fw={800}>
                Spoken Language Identification
                <br />
                <Text component="span" c="indigo.3" inherit>
                  using Deep Learning
                </Text>
              </Title>
              <Text c="rgba(255,255,255,0.65)" ta="center" size="lg" maw={620}>
                A research project investigating deep learning approaches for automatic identification
                of spoken Hindi, English, and Dogri — with a focus on low-resource language technology.
              </Text>
            </Stack>
          </Container>
        </div>

        {/* ─── RESEARCHER CARD ────────────────────────────────────────────── */}
        <div style={{ background: '#f8faff', padding: '70px 0' }}>
          <Container size="xl">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">

              {/* Researcher */}
              <Paper p="xl" radius="lg" withBorder style={{ borderTop: '4px solid #6366f1' }}>
                <Badge variant="light" color="indigo" mb="md">Ph.D. Researcher</Badge>
                <Group gap="md" mb="md">
                  <Avatar src="/sneha_choudhary.jpg" alt="Sneha Choudhary" size={68} radius="xl" color="indigo">SC</Avatar>
                  <div>
                    <Text fw={700} size="xl">Sneha Choudhary</Text>
                    <Text c="dimmed" size="sm">Ph.D. Scholar</Text>
                  </div>
                </Group>
                <Text size="sm" c="dimmed" lh={1.8}>
                  Department of Computer Science &amp; IT<br />
                  University of Jammu, Jammu &amp; Kashmir, India
                </Text>
              </Paper>

              {/* Supervisor */}
              <Paper p="xl" radius="lg" withBorder style={{ borderTop: '4px solid #06b6d4' }}>
                <Badge variant="light" color="cyan" mb="md">Research Supervisor</Badge>
                <Group gap="md" mb="md">
                  <Avatar src="/pawanesh_abrol.jpg" alt="Prof. Pawanesh Abrol" size={68} radius="xl" color="cyan">PA</Avatar>
                  <div>
                    <Text fw={700} size="xl">Prof. Pawanesh Abrol</Text>
                    <Text c="dimmed" size="sm">Professor &amp; Supervisor</Text>
                  </div>
                </Group>
                <Text size="sm" c="dimmed" lh={1.8}>
                  Department of Computer Science &amp; IT<br />
                  University of Jammu, Jammu &amp; Kashmir, India
                </Text>
              </Paper>

            </SimpleGrid>
          </Container>
        </div>

        {/* ─── RESEARCH FOCUS ─────────────────────────────────────────────── */}
        <div style={{ padding: '80px 0' }}>
          <Container size="xl">
            <Stack align="center" mb={48}>
              <Badge variant="light" color="indigo" size="lg">Research Focus</Badge>
              <Title order={2} ta="center" fz={{ base: 26, md: 34 }}>Areas of Investigation</Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="md">
              {researchFocus.map((item) => (
                <Paper
                  key={item.label}
                  p="lg"
                  radius="lg"
                  ta="center"
                  withBorder
                  style={{
                    borderColor: `${item.color}33`,
                    background: '#ffffff',
                  }}
                >
                  <ThemeIcon
                    size={52}
                    radius="xl"
                    mb="md"
                    mx="auto"
                    style={{ background: item.bg, color: item.color }}
                    variant="light"
                  >
                    <item.icon size={26} />
                  </ThemeIcon>
                  <Text fw={600} size="sm" ta="center">{item.label}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── RESEARCH OBJECTIVES ────────────────────────────────────────── */}
        <div style={{ background: '#f8faff', padding: '80px 0' }}>
          <Container size="xl">
            <Grid gutter="xl" align="flex-start">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Badge variant="light" color="indigo" size="lg" mb="md">Research Objectives</Badge>
                <Title order={2} fz={{ base: 26, md: 34 }} mb="md">
                  What this research aims to achieve
                </Title>
                <Text c="dimmed" size="md" lh={1.8}>
                  This project addresses core objectives spanning automated spoken language identification,
                  speech feature analysis, and advancing language technology for underrepresented languages in AI systems.
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack gap="md">
                  {objectives.map((obj) => (
                    <Paper key={obj.num} p="md" radius="md" withBorder>
                      <Group gap="md">
                        <Text fw={800} fz={22} c="indigo.3" style={{ fontVariantNumeric: 'tabular-nums', minWidth: 32 }}>
                          {obj.num}
                        </Text>
                        <ThemeIcon variant="light" color="indigo" size={36} radius="xl">
                          <obj.icon size={18} />
                        </ThemeIcon>
                        <Text fw={600}>{obj.label}</Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Container>
        </div>

        {/* ─── CNN ARCHITECTURE ───────────────────────────────────────────── */}
        <div style={{ padding: '80px 0' }}>
          <Container size="xl">
            <Stack align="center" mb={48}>
              <Badge variant="light" color="indigo" size="lg">Learning Architecture</Badge>
              <Title order={2} ta="center" fz={{ base: 26, md: 34 }}>
                Convolutional Neural Network (CNN)
              </Title>
              <Text c="dimmed" ta="center" maw={640} size="md">
                The research employs a deep 2D Convolutional Neural Network (CNN) engineered to extract
                hierarchical acoustic patterns from speech representations for spoken language identification.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
              {cnnLayers.map((layer, i) => (
                <Paper
                  key={layer.step}
                  p="xl"
                  radius="lg"
                  withBorder
                  style={{
                    borderTop: '4px solid #4f46e5',
                    background: '#ffffff',
                  }}
                >
                  <Text size="xs" fw={700} c="indigo" tt="uppercase" mb="xs">
                    Stage {i + 1} · {layer.step}
                  </Text>
                  <Text fw={700} size="md" mb="xs" c="#0f172a">
                    {layer.title}
                  </Text>
                  <Text c="dimmed" size="sm" lh={1.6}>
                    {layer.desc}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── SPEECH REPRESENTATIONS ─────────────────────────────────────── */}
        <div style={{ background: '#f8faff', padding: '80px 0' }}>
          <Container size="xl">
            <Stack align="center" mb={48}>
              <Badge variant="light" color="teal" size="lg">Speech Representations</Badge>
              <Title order={2} ta="center" fz={{ base: 26, md: 34 }}>
                Feature Extraction Methods
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              {representations.map((r, i) => (
                <Paper
                  key={r.name}
                  p="xl"
                  radius="lg"
                  withBorder
                  style={{
                    borderLeft: `4px solid ${['#14b8a6', '#06b6d4', '#0ea5e9'][i]}`,
                    background: '#ffffff',
                  }}
                >
                  <Text fw={800} size="lg" mb="xs"
                    style={{ color: ['#14b8a6', '#06b6d4', '#0ea5e9'][i] }}
                  >
                    {r.name}
                  </Text>
                  <Text c="dimmed" size="sm" lh={1.7}>{r.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </div>

        {/* ─── CTA ────────────────────────────────────────────────────────── */}
        <div
          style={{
            background: '#0f172a',
            padding: '80px 0',
          }}
        >
          <Container size="md" ta="center">
            <Stack align="center" gap="lg">
              <Title order={2} c="white" fz={{ base: 26, md: 36 }}>
                Participate in the Research
              </Title>
              <Text c="rgba(255,255,255,0.85)" size="lg" maw={520}>
                Record a few spoken sentences and directly contribute to the training and evaluation of
                spoken language identification models.
              </Text>
              <Button
                size="lg"
                variant="white"
                color="indigo"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => navigate(user ? '/record' : '/login')}
              >
                {user ? 'Start a New Session' : 'Get Started'}
              </Button>
            </Stack>
          </Container>
        </div>

        {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
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
                    <Anchor
                      key={l.label}
                      component={Link}
                      to={l.to}
                      size="sm"
                      c="rgba(255,255,255,0.5)"
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

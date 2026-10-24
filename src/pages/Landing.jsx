import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Group,
  SimpleGrid, ThemeIcon, Stack, Paper, Badge, Box,
  Divider, Grid, Anchor, Avatar
} from '@mantine/core';
import {
  IconArrowRight,
  IconUserPlus, IconSelect, IconMicrophone2,
  IconBrain, IconReportAnalytics, IconLock,
  IconSchool
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import Logo from '../components/Logo';
import SiteHeader from '../components/SiteHeader';

// ─── STUDY STEPS ─────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    icon: IconUserPlus,
    title: 'Participant Profile',
    desc: 'Provide basic demographic information (state, mother tongue) to aid linguistic diversity analysis.',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    number: '02',
    icon: IconSelect,
    title: 'Select Language',
    desc: 'Choose your preferred spoken language from Dogri, Hindi, or English.',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    number: '03',
    icon: IconMicrophone2,
    title: 'Record Speech Samples',
    desc: 'Read the provided standard prompts naturally into your microphone.',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    number: '04',
    icon: IconBrain,
    title: 'Acoustic Feature Extraction',
    desc: 'Spectral features (MFCCs) are extracted to capture phonological characteristics of the speech utterance.',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    number: '05',
    icon: IconReportAnalytics,
    title: 'Model Prediction & Metrics',
    desc: 'The trained deep learning model evaluates the speech features and computes language classification probabilities.',
    color: '#dc2626',
    bg: '#fef2f2',
  },
  {
    number: '06',
    icon: IconLock,
    title: 'Participant Privacy',
    desc: 'Audio files are deleted immediately after feature extraction. Only anonymous metadata is preserved for research evaluation.',
    color: '#475569',
    bg: '#f1f5f9',
  },
];

// ─── LANGUAGES UNDER INVESTIGATION ───────────────────────────────────────────

const languages = [
  {
    name: 'Dogri',
    script: 'डोगरी',
    desc: 'An Indo-Aryan language primarily spoken in Jammu & Kashmir. A key focal point of this study addressing low-resource language preservation.',
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    flag: '🏔️',
    classification: 'Scheduled 8th Indian Language',
  },
  {
    name: 'Hindi',
    script: 'हिंदी',
    desc: 'The most widely spoken official Indian language, serving as an acoustic benchmark across diverse dialectal variations.',
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    flag: '🇮🇳',
    classification: 'Indo-Aryan Family',
  },
  {
    name: 'English',
    script: 'English',
    desc: 'Global language of science and administration, examined for multilingual code-switching and comparative acoustic patterns.',
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    flag: '🌐',
    classification: 'Comparative Reference',
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

        {/* ─── HERO SECTION (CLEAN SOLID THEME, SPACIOUS) ────────────────── */}
        <Box
          bg="#ffffff"
          style={{
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Container size="xl" py={{ base: 50, md: 80 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 60 }} align="center">

              {/* Left Column: Academic Info & People Spotlight */}
              <Stack gap="lg" align={{ base: 'center', md: 'flex-start' }}>
                <Badge
                  size="md"
                  variant="outline"
                  color="gray"
                  radius="sm"
                  leftSection={<IconSchool size={14} />}
                >
                  University of Jammu · Dept. of Computer Science &amp; IT
                </Badge>

                <Title
                  order={1}
                  fz={{ base: 32, sm: 40, md: 46 }}
                  lh={1.18}
                  fw={800}
                  ta={{ base: 'center', md: 'left' }}
                  c="#0f172a"
                >
                  Spoken Language Identification Research
                </Title>

                <Text
                  c="#475569"
                  fz={{ base: 'sm', md: 'md' }}
                  lh={1.75}
                  ta={{ base: 'center', md: 'left' }}
                  maw={540}
                >
                  An empirical academic research study investigating speech processing and deep learning
                  models for automatic spoken language identification in <strong>Dogri</strong>, <strong>Hindi</strong>, and <strong>English</strong>,
                  with a specialized focus on advancing speech technology for the low-resource Dogri language.
                </Text>

                {/* Individual People Boxes */}
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" style={{ width: '100%', maxWidth: 540 }}>
                  {/* Box 1: Researcher */}
                  <Paper
                    withBorder
                    p="sm"
                    radius="md"
                    bg="#f8fafc"
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <Group gap="sm" wrap="nowrap" align="center">
                      <Avatar size={42} radius="xl" color="indigo" variant="filled">SC</Avatar>
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={700} c="#0f172a" truncate>
                          Sneha Choudhary
                        </Text>
                        <Text size="xs" c="indigo.7" fw={600} truncate>
                          Ph.D. Research Scholar
                        </Text>
                        <Text size="xs" c="#64748b" truncate>
                          Dept. of CS &amp; IT, Univ. of Jammu
                        </Text>
                      </div>
                    </Group>
                  </Paper>

                  {/* Box 2: Supervisor */}
                  <Paper
                    withBorder
                    p="sm"
                    radius="md"
                    bg="#f8fafc"
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <Group gap="sm" wrap="nowrap" align="center">
                      <Avatar size={42} radius="xl" color="cyan" variant="filled">PA</Avatar>
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={700} c="#0f172a" truncate>
                          Prof. Pawanesh Abrol
                        </Text>
                        <Text size="xs" c="cyan.8" fw={600} truncate>
                          Research Supervisor
                        </Text>
                        <Text size="xs" c="#64748b" truncate>
                          Professor, Univ. of Jammu
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                </SimpleGrid>

                {/* Actions */}
                <Group gap="md" mt="xs">
                  <Button
                    size="md"
                    color="indigo"
                    rightSection={<IconArrowRight size={18} />}
                    onClick={() => navigate(user ? '/record' : '/login')}
                  >
                    Contribute Voice Sample
                  </Button>
                </Group>
              </Stack>

              {/* Right Column: Lab & Team Photo */}
              <Box>
                <Paper
                  withBorder
                  radius="md"
                  p="xs"
                  bg="#ffffff"
                  style={{
                    borderColor: '#cbd5e1',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <Box
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src="/hero_team.jpg"
                      alt="Research scholars and faculty at the Speech Processing Lab, University of Jammu"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        maxHeight: '420px',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  <Box pt="xs" px={4}>
                    <Text size="xs" fw={600} c="#1e293b">
                      Speech Processing &amp; AI Research Lab
                    </Text>
                    <Text size="xs" c="#64748b">
                      Department of Computer Science &amp; IT, University of Jammu
                    </Text>
                  </Box>
                </Paper>
              </Box>

            </SimpleGrid>
          </Container>
        </Box>

        {/* ─── RESEARCH PARTICIPATION METHODOLOGY ─────────────────────────── */}
        <Box bg="#f8fafc" py={{ base: 60, md: 80 }}>
          <Container size="xl">
            <Stack align="center" mb={48}>
              <Badge variant="outline" color="indigo" size="sm">Methodology</Badge>
              <Title order={2} ta="center" fz={{ base: 26, md: 32 }} c="#0f172a" fw={700}>
                How Participants Contribute to the Study
              </Title>
              <Text c="#64748b" ta="center" maw={600} size="sm">
                Standardized steps for collecting speech samples to train and evaluate deep neural acoustic models.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {steps.map((step) => (
                <Paper
                  key={step.number}
                  p="lg"
                  radius="md"
                  withBorder
                  bg="#ffffff"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <Group mb="sm" justify="space-between" align="flex-start">
                    <ThemeIcon
                      size={40}
                      radius="md"
                      style={{ background: step.bg, color: step.color }}
                      variant="light"
                    >
                      <step.icon size={20} />
                    </ThemeIcon>
                    <Text fw={700} fz={20} c="#94a3b8" lh={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {step.number}
                    </Text>
                  </Group>
                  <Text fw={700} mb={6} size="sm" c="#0f172a">{step.title}</Text>
                  <Text c="#64748b" size="xs" lh={1.6}>{step.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ─── LANGUAGES UNDER STUDY ─────────────────────────────────────── */}
        <Box bg="#ffffff" py={{ base: 60, md: 80 }} style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <Container size="xl">
            <Stack align="center" mb={48}>
              <Badge variant="outline" color="teal" size="sm">Corpus</Badge>
              <Title order={2} ta="center" fz={{ base: 26, md: 32 }} c="#0f172a" fw={700}>
                Languages Under Linguistic Investigation
              </Title>
              <Text c="#64748b" ta="center" maw={600} size="sm">
                Evaluating acoustic phonetic discrimination across regional and national languages.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              {languages.map((lang) => (
                <Paper
                  key={lang.name}
                  p="xl"
                  radius="md"
                  withBorder
                  bg="#ffffff"
                  style={{
                    borderTop: `3px solid ${lang.accentColor}`,
                    borderColor: '#e2e8f0',
                  }}
                >
                  <Group justify="space-between" align="flex-start" mb="md">
                    <div>
                      <Text fw={700} size="lg" c="#0f172a">{lang.name}</Text>
                      <Text size="sm" style={{ color: lang.accentColor }} fw={600}>{lang.script}</Text>
                    </div>
                    <Badge size="xs" variant="light" color="gray">{lang.classification}</Badge>
                  </Group>
                  <Text c="#64748b" size="xs" lh={1.7}>{lang.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ─── CALL TO PARTICIPATE (SOLID DARK CONTAINER) ────────────────── */}
        <Box bg="#0f172a" py={{ base: 60, md: 70 }}>
          <Container size="md" ta="center">
            <Stack align="center" gap="md">
              <Badge variant="filled" color="indigo" size="sm">Academic Call</Badge>
              <Title order={2} c="#ffffff" fz={{ base: 24, md: 32 }} fw={700}>
                Participate in Speech Recognition Research
              </Title>
              <Text c="#94a3b8" size="sm" maw={540} lh={1.7}>
                Every recorded utterance directly assists in evaluating deep neural network models
                for low-resource languages like Dogri. Your voice sample is processed anonymously.
              </Text>
              <Button
                size="md"
                color="indigo"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => navigate(user ? '/record' : '/login')}
                mt="xs"
              >
                {user ? 'Open Recording Dashboard' : 'Contribute a Voice Sample'}
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* ─── ACADEMIC FOOTER ────────────────────────────────────────────── */}
        <Box bg="#020617" py={{ base: 40, md: 50 }}>
          <Container size="xl">
            <Grid gutter="xl" mb={30}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Group gap="sm" mb="xs">
                  <Logo size={20} color="white" />
                  <Text fw={700} size="sm" c="white">Bahasa Detect</Text>
                </Group>
                <Text size="xs" c="#94a3b8" maw={340} lh={1.7}>
                  A doctoral research project in Spoken Language Identification (SLI).
                  Department of Computer Science &amp; IT, University of Jammu.
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="xs" tt="uppercase" fw={700} c="#64748b" mb="xs" ls={0.8}>
                  Investigators
                </Text>
                <Text size="xs" c="#e2e8f0" fw={600}>Sneha Choudhary (Ph.D. Scholar)</Text>
                <Text size="xs" c="#94a3b8">Supervised by Prof. Pawanesh Abrol</Text>
                <Text size="xs" c="#94a3b8">University of Jammu, Jammu &amp; Kashmir, India</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text size="xs" tt="uppercase" fw={700} c="#64748b" mb="xs" ls={0.8}>
                  Navigation
                </Text>
                <Stack gap={4}>
                  {[
                    { label: 'Home', to: '/' },
                    { label: 'About Research', to: '/about' },
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Record Samples', to: '/record' },
                  ].map((l) => (
                    <Anchor
                      key={l.label}
                      component={Link}
                      to={l.to}
                      size="xs"
                      c="#94a3b8"
                      style={{ textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      {l.label}
                    </Anchor>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider color="#1e293b" mb="md" />

            <Group justify="space-between" wrap="wrap">
              <Text size="xs" c="#64748b">
                © 2026 Bahasa Detect · Academic Research Study · University of Jammu
              </Text>
              <Text size="xs" c="#64748b">
                Department of Computer Science &amp; IT
              </Text>
            </Group>
          </Container>
        </Box>

      </AppShell.Main>
    </AppShell>
  );
}

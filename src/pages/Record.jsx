import React, { useEffect } from 'react';
import {
  AppShell, Container, Title, Text, Button, Paper, Group,
  Badge, Stack, Loader, Center, RingProgress, Progress, Stepper,
  ThemeIcon, Alert, Divider, Table
} from '@mantine/core';
import {
  IconBrain, IconArrowLeft, IconArrowRight, IconCheck,
  IconMicrophone, IconInfoCircle, IconPlayerPlay
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';
import { useRecordingSession } from '../hooks/useRecordingSession';
import AudioRecorder from '../components/AudioRecorder';
import Logo from '../components/Logo';

export default function Record() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const {
    initSession,
    isSessionReady,
    currentSentence,
    currentIndex,
    totalSentences,
    isPredicting,
    currentPrediction,
    results,
    submitAudio,
    goNext,
    goBack,
    isLastSentence,
    allDone,
  } = useRecordingSession(profile?.languages);

  const handleRecordingComplete = async () => {
    await submitAudio();
  };

  if (!isSessionReady) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }}>
              <Logo size={32} />
              <Text fw={700} size="lg" c="dark">Bhasa Detect</Text>
            </Group>
            <Button variant="subtle" color="gray" onClick={logout}>Logout</Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="sm" py={60}>
            <Paper withBorder shadow="md" p="xl" radius="lg">
              <Stack align="center" gap="xl">
                <ThemeIcon size={80} radius="xl">
                  <IconMicrophone size={40} />
                </ThemeIcon>

                <div style={{ textAlign: 'center' }}>
                  <Title order={2} mb="xs">Spoken Language Identification</Title>
                  <Text c="dimmed" maw={500} mx="auto">
                    You will be shown <strong>5 sentences</strong> in your selected languages.
                    Read each sentence aloud — the AI will automatically listen, analyze your speech
                    using MFCC features, and predict which language you spoke.
                  </Text>
                </div>

                <Alert icon={<IconInfoCircle size={20} />} color="gray" variant="light" w="100%">
                  <Text size="sm">
                    <strong>How it works:</strong> Your microphone will activate when you tap record.
                    Speak the displayed sentence clearly. The system extracts audio features and runs
                    them through our CNN-LSTM model to predict the language. Your audio is{' '}
                    <strong>never stored</strong> — only metadata like accuracy and confidence are saved.
                  </Text>
                </Alert>

                <Paper withBorder p="md" radius="md" w="100%" bg="gray.0">
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={600}>Your profile:</Text>
                  </Group>
                  <Text size="sm"><strong>Name:</strong> {profile?.name}</Text>
                  <Text size="sm"><strong>Languages:</strong> {profile?.languages?.join(', ')}</Text>
                  <Text size="sm"><strong>Place:</strong> {profile?.place || '—'}</Text>
                </Paper>

                <Button
                  size="md"
                  fullWidth
                  rightSection={<IconPlayerPlay size={18} />}
                  onClick={initSession}
                >
                  Start Evaluation Session
                </Button>
              </Stack>
            </Paper>
          </Container>
        </AppShell.Main>
      </AppShell>
    );
  }

  // Session complete view
  if (allDone) {
    const correct = results.filter((r) => r?.isCorrect).length;
    const accuracy = Math.round((correct / totalSentences) * 100);
    const avgConf = Math.round(results.reduce((s, r) => s + (r?.confidence || 0), 0) / totalSentences * 100);

    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }}>
              <Logo size={32} />
              <Text fw={700} size="lg" c="dark">Bhasa Detect</Text>
            </Group>
            <Button variant="subtle" color="gray" onClick={logout}>Logout</Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="md" py={60}>
            <Paper withBorder shadow="md" p="xl" radius="lg">
              <Stack align="center" gap="lg">
                <ThemeIcon size={80} radius="xl" color="dark">
                  <IconCheck size={40} />
                </ThemeIcon>
                <Title order={2} ta="center">Session Complete!</Title>
                <Text c="dimmed" ta="center">
                  Great job, {profile?.name}! You have completed all {totalSentences} sentences.
                  Here is a quick summary of your session.
                </Text>

                <Group grow w="100%">
                  <Paper withBorder p="md" radius="md" ta="center">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Accuracy</Text>
                    <Text fw={700} fz={28}>{accuracy}%</Text>
                  </Paper>
                  <Paper withBorder p="md" radius="md" ta="center">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Correct</Text>
                    <Text fw={700} fz={28}>{correct}/{totalSentences}</Text>
                  </Paper>
                  <Paper withBorder p="md" radius="md" ta="center">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Avg. Confidence</Text>
                    <Text fw={700} fz={28}>{avgConf}%</Text>
                  </Paper>
                </Group>

                <Divider w="100%" />

                <Table striped highlightOnHover withTableBorder w="100%">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>#</Table.Th>
                      <Table.Th>Expected</Table.Th>
                      <Table.Th>Predicted</Table.Th>
                      <Table.Th>Confidence</Table.Th>
                      <Table.Th>Result</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {results.map((r, i) => (
                      <Table.Tr key={i}>
                        <Table.Td>{i + 1}</Table.Td>
                        <Table.Td>{r.expectedLanguage}</Table.Td>
                        <Table.Td>{r.predictedLanguage}</Table.Td>
                        <Table.Td>{Math.round(r.confidence * 100)}%</Table.Td>
                        <Table.Td>
                          <Badge color={r.isCorrect ? 'dark' : 'gray'} variant={r.isCorrect ? 'filled' : 'outline'}>
                            {r.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Group w="100%">
                  <Button variant="light" flex={1} onClick={initSession}>
                    Record Again
                  </Button>
                  <Button flex={1} onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Container>
        </AppShell.Main>
      </AppShell>
    );
  }

  // Active recording view
  const progressPercent = (results.filter(Boolean).length / totalSentences) * 100;

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm" component={Link} to="/" style={{ textDecoration: 'none' }}>
            <Logo size={32} />
            <Text fw={700} size="lg" c="dark">Bhasa Detect</Text>
          </Group>
          <Group gap="sm">
            <Badge variant="light" color="gray">{profile?.name}</Badge>
            <Button variant="subtle" color="gray" onClick={logout}>Logout</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" py="xl">
          <Stack gap="lg">
            {/* Progress */}
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600}>Session Progress</Text>
                <Text size="sm" c="dimmed">
                  {results.filter(Boolean).length} of {totalSentences} completed
                </Text>
              </Group>
              <Progress value={progressPercent} size="lg" radius="xl" color="dark" animated />
            </Paper>

            {/* Sentence Stepper */}
            <Stepper
              active={currentIndex}
              size="sm"
              color="dark"
              completedIcon={<IconCheck size={14} />}
            >
              {Array.from({ length: totalSentences }).map((_, i) => (
                <Stepper.Step
                  key={i}
                  label={`S${i + 1}`}
                  description={results[i] ? (results[i].isCorrect ? '✓' : '✗') : ''}
                />
              ))}
            </Stepper>

            {/* Recording Card */}
            <Paper withBorder shadow="sm" p="xl" radius="lg" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#1a1b1e' }} />

              <Stack align="center" gap="lg" mt="sm">
                <Badge size="lg" variant="light" color="dark">
                  Sentence {currentIndex + 1} of {totalSentences} — {currentSentence?.language}
                </Badge>

                <Text fw={500} ta="center" fz={{ base: 'xl', md: 28 }} lh={1.4} py="md">
                  "{currentSentence?.text}"
                </Text>

                {!isPredicting && !currentPrediction && (
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                )}

                {isPredicting && (
                  <Stack align="center" gap="sm">
                    <Loader size="lg" variant="bars" color="dark" />
                    <Text fw={500} c="dimmed">Analyzing speech with CNN-LSTM model...</Text>
                  </Stack>
                )}

                {currentPrediction && (
                  <Paper withBorder p="md" radius="md" w="100%" bg="gray.0">
                    <Group justify="space-between" wrap="nowrap">
                      <Group>
                        <Center w={50} h={50} style={{ borderRadius: '50%', background: 'white', border: '2px solid #dee2e6' }}>
                          <IconBrain size={28} color="#1a1b1e" />
                        </Center>
                        <div>
                          <Text size="sm" c="dimmed">AI Prediction</Text>
                          <Text fw={700} size="lg">
                            {currentPrediction.predictedLanguage}
                            {currentPrediction.isCorrect ? ' ✓' : ' ✗'}
                          </Text>
                        </div>
                      </Group>
                      <RingProgress
                        size={60}
                        thickness={6}
                        roundCaps
                        sections={[{ value: currentPrediction.confidence * 100, color: 'dark' }]}
                        label={
                          <Center>
                            <Text fw={700} size="xs">
                              {Math.round(currentPrediction.confidence * 100)}%
                            </Text>
                          </Center>
                        }
                      />
                    </Group>
                  </Paper>
                )}
              </Stack>
            </Paper>

            {/* Navigation */}
            {currentPrediction && (
              <Group grow>
                <Button
                  variant="default"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={goBack}
                  disabled={currentIndex === 0}
                >
                  Go Back
                </Button>
                {isLastSentence ? (
                  <Button
                    rightSection={<IconCheck size={16} />}
                    disabled={!allDone}
                    onClick={() => {/* allDone triggers complete view */}}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    rightSection={<IconArrowRight size={16} />}
                    onClick={goNext}
                  >
                    Next Sentence
                  </Button>
                )}
              </Group>
            )}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

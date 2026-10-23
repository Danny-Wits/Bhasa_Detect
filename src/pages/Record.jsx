import React, { useState } from 'react';
import {
  AppShell, Container, Title, Text, Button, Paper, Group,
  Badge, Stack, Loader, Center, RingProgress, Progress, Stepper,
  ThemeIcon, Alert, Divider, Table, Modal, SimpleGrid, Box
} from '@mantine/core';
import {
  IconBrain, IconArrowRight, IconCheck,
  IconMicrophone, IconInfoCircle, IconPlayerPlay, IconReload, IconListDetails,
  IconClock
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';
import { useRecordingSession } from '../hooks/useRecordingSession';
import AudioRecorder from '../components/AudioRecorder';
import SiteHeader from '../components/SiteHeader';
import SpectrogramViewer from '../components/SpectrogramViewer';

export default function Record() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [techSpecModalOpen, setTechSpecModalOpen] = useState(false);
  const [sentencesModalOpen, setSentencesModalOpen] = useState(false);
  const [selectedTestSentences, setSelectedTestSentences] = useState([]);

  const {
    initSession,
    isSessionReady,
    currentTest,
    currentTestIndex,
    currentTestNumber,
    currentTestLanguage,
    currentSentences,
    totalTests,
    sentencesPerTest,
    isPredicting,
    currentPrediction,
    results,
    submitAudio,
    reRecord,
    goNext,
    isLastTest,
    nextTestLanguage,
    allDone,
  } = useRecordingSession(profile?.languages);

  const handleRecordingComplete = async (blob) => {
    await submitAudio(blob);
  };

  function round(val, dec = 1) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  if (!isSessionReady) {
    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <SiteHeader />
        </AppShell.Header>

        <AppShell.Main>
          <Container size="sm" py={60}>
            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Stack align="center" gap="lg">
                <ThemeIcon size={70} radius="xl" color="indigo" variant="light">
                  <IconMicrophone size={36} />
                </ThemeIcon>

                <div style={{ textAlign: 'center' }}>
                  <Title order={2} mb="xs">Spoken Language Evaluation Session</Title>
                  <Text c="dimmed" maw={520} mx="auto" size="sm" lh={1.6}>
                    You will complete <strong>{totalTests} language tests</strong>. In each test, you will read 
                    a set of <strong>{sentencesPerTest} sentences</strong> in a single language continuously in one voice note (up to <strong>1 minute</strong> max).
                  </Text>
                </div>

                <Alert icon={<IconClock size={20} />} color="indigo" variant="light" w="100%" radius="md">
                  <Text size="xs" lh={1.6}>
                    <strong>Format:</strong> All {sentencesPerTest} sentences for the test will be displayed together. 
                    Press the microphone button and read through all 5 sentences clearly. The recording automatically stops at 1 minute (or when you tap stop).
                  </Text>
                </Alert>

                <Paper withBorder p="md" radius="md" w="100%" bg="#f8fafc">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Participant Details</Text>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm"><strong>Participant:</strong> {user?.name || 'Participant'}</Text>
                      <Text size="sm"><strong>Languages:</strong> {profile?.languages?.join(', ') || 'Dogri, Hindi, English'}</Text>
                    </div>
                    <Badge variant="outline" color="indigo">
                      {totalTests} Tests · 1 Min / Test
                    </Badge>
                  </Group>
                </Paper>

                <Button
                  size="md"
                  fullWidth
                  color="indigo"
                  rightSection={<IconPlayerPlay size={18} />}
                  onClick={initSession}
                >
                  Start Evaluation Session ({totalTests} Tests)
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
    const accuracy = Math.round((correct / totalTests) * 100);
    const avgConf = Math.round(results.reduce((s, r) => s + (r?.confidence || 0), 0) / totalTests * 100);

    return (
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <SiteHeader />
        </AppShell.Header>

        <AppShell.Main>
          <Container size="md" py={60}>
            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Stack align="center" gap="lg">
                <ThemeIcon size={70} radius="xl" color="indigo" variant="light">
                  <IconCheck size={36} />
                </ThemeIcon>
                <Title order={2} ta="center">Session Complete!</Title>
                <Text c="dimmed" ta="center" size="sm" maw={540}>
                  Great job, {user?.name || 'Participant'}! You have completed all {totalTests} language evaluation tests.
                  Here is the full summary of your spoken language identification results.
                </Text>

                {/* Overall KPI Cards */}
                <Group grow w="100%">
                  <Paper withBorder p="md" radius="md" ta="center" bg="#f8fafc">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Overall Accuracy</Text>
                    <Text fw={800} fz={32} c="indigo">{accuracy}%</Text>
                  </Paper>
                  <Paper withBorder p="md" radius="md" ta="center" bg="#f8fafc">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Tests Passed</Text>
                    <Text fw={800} fz={32}>{correct}/{totalTests}</Text>
                  </Paper>
                  <Paper withBorder p="md" radius="md" ta="center" bg="#f8fafc">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Avg. Confidence</Text>
                    <Text fw={800} fz={32}>{avgConf}%</Text>
                  </Paper>
                </Group>

                <Divider w="100%" />

                {/* 5-Test Summary Table */}
                <Box w="100%">
                  <Text size="sm" fw={700} c="gray.8" mb="xs">
                    Test Results Breakdown ({totalTests} Tests):
                  </Text>
                  <Table.ScrollContainer minWidth={600} w="100%">
                    <Table striped highlightOnHover withTableBorder w="100%" size="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Test #</Table.Th>
                          <Table.Th>Target Language</Table.Th>
                          <Table.Th>AI Predicted</Table.Th>
                          <Table.Th>Confidence</Table.Th>
                          <Table.Th>Duration</Table.Th>
                          <Table.Th>Outcome</Table.Th>
                          <Table.Th>Sentences Read</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {results.map((r, i) => (
                          <Table.Tr key={i}>
                            <Table.Td fw={700}>Test {r.testNumber}</Table.Td>
                            <Table.Td fw={600}>{r.expectedLanguage}</Table.Td>
                            <Table.Td>{r.predictedLanguage}</Table.Td>
                            <Table.Td>{Math.round(r.confidence * 100)}%</Table.Td>
                            <Table.Td>{r.duration ? `${round(r.duration, 1)}s` : '—'}</Table.Td>
                            <Table.Td>
                              <Badge color={r.isCorrect ? 'green' : 'red'} variant="light" size="sm">
                                {r.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </Badge>
                            </Table.Td>
                            <Table.Td>
                              <Button
                                size="xs"
                                variant="subtle"
                                color="indigo"
                                onClick={() => {
                                  setSelectedTestSentences(r.sentences || []);
                                  setSentencesModalOpen(true);
                                }}
                              >
                                View 5 Sentences
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Box>

                <Group w="100%" mt="md">
                  <Button variant="default" flex={1} onClick={initSession}>
                    Start New Evaluation Session
                  </Button>
                  <Button color="indigo" flex={1} onClick={() => navigate('/dashboard')}>
                    View Research Dashboard
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Container>

          {/* Modal to view test sentences */}
          <Modal
            opened={sentencesModalOpen}
            onClose={() => setSentencesModalOpen(false)}
            title={<Text fw={700} size="md">Test Sentences Evaluated</Text>}
            size="md"
            centered
          >
            <Stack gap="xs">
              {selectedTestSentences.map((st, sIdx) => (
                <Paper key={sIdx} p="sm" withBorder bg="#f8fafc" radius="sm">
                  <Text size="xs" fw={700} c="indigo">Sentence {sIdx + 1}:</Text>
                  <Text size="sm" mt={2}>{st}</Text>
                </Paper>
              ))}
            </Stack>
          </Modal>
        </AppShell.Main>
      </AppShell>
    );
  }

  // Active recording view
  const completedTestsCount = results.filter(Boolean).length;
  const progressPercent = Math.round((completedTestsCount / totalTests) * 100);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <SiteHeader hideDashboard={true} />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" py="xl">
          <Stack gap="lg">

            {/* Test Header & Overall Progress */}
            <Paper withBorder p="md" radius="md" bg="#ffffff">
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Badge color="indigo" variant="filled" size="md">
                    Test {currentTestNumber} of {totalTests}
                  </Badge>
                  <Badge color="gray" variant="outline" size="md">
                    Language: {currentTestLanguage}
                  </Badge>
                </Group>
                <Group gap={4}>
                  <IconClock size={14} color="#64748b" />
                  <Text size="xs" c="dimmed" fw={600}>
                    Max: 1 Minute
                  </Text>
                </Group>
              </Group>

              <Progress value={progressPercent} size="sm" radius="xl" color="indigo" animated />
            </Paper>

            {/* Session Stepper across 5 Tests */}
            <Paper withBorder p="md" radius="md" bg="#f8fafc">
              <Text size="xs" fw={700} c="dimmed" mb="xs">
                SESSION PROGRESS ({completedTestsCount} of {totalTests} Tests Completed)
              </Text>
              <Stepper
                active={currentTestIndex}
                size="xs"
                color="indigo"
                completedIcon={<IconCheck size={12} />}
              >
                {Array.from({ length: totalTests }).map((_, i) => {
                  const res = results[i];
                  return (
                    <Stepper.Step
                      key={i}
                      label={`Test ${i + 1}`}
                      description={res ? (res.isCorrect ? '✓' : '✗') : ''}
                    />
                  );
                })}
              </Stepper>
            </Paper>

            {/* 5 Concatenated Sentences Reading Card */}
            <Paper withBorder shadow="sm" p="xl" radius="md" bg="#ffffff" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#4f46e5' }} />

              <Stack align="center" gap="md" mt="xs">
                <Group justify="space-between" w="100%">
                  <Badge size="md" variant="light" color="indigo">
                    Reading Passage ({sentencesPerTest} Sentences)
                  </Badge>
                  <Badge size="md" variant="outline" color="dark">
                    Target Language: {currentTestLanguage}
                  </Badge>
                </Group>

                <Text size="xs" c="dimmed" ta="center">
                  Please read all 5 sentences below consecutively into your microphone:
                </Text>

                {/* Concatenated Sentences List */}
                <Stack gap="xs" w="100%">
                  {currentSentences.map((sentence, idx) => (
                    <Paper
                      key={idx}
                      p="xs"
                      radius="sm"
                      bg="#f8fafc"
                      withBorder
                      style={{ borderColor: '#e2e8f0' }}
                    >
                      <Group align="flex-start" wrap="nowrap" gap="sm">
                        <Badge size="xs" variant="filled" color="indigo" circle style={{ flexShrink: 0, marginTop: 2 }}>
                          {idx + 1}
                        </Badge>
                        <Text size="sm" fw={500} c="#0f172a" lh={1.6}>
                          {sentence}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>

                {/* Audio Recorder with 1-Minute Limit */}
                {!isPredicting && !currentPrediction && (
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                )}

                {/* Inference Loader */}
                {isPredicting && (
                  <Stack align="center" gap="sm" py="md">
                    <Loader size="md" color="indigo" />
                    <Text fw={500} size="sm" c="dimmed">Analyzing 5-sentence speech recording with deep learning model...</Text>
                  </Stack>
                )}

                {/* AI Prediction Result Card */}
                {currentPrediction && (
                  <Paper withBorder p="md" radius="md" w="100%" bg="#f8fafc">
                    <Group justify="space-between" wrap="nowrap">
                      <Group>
                        <Center w={48} h={48} style={{ borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0' }}>
                          <IconBrain size={24} color="#4f46e5" />
                        </Center>
                        <div>
                          <Text size="xs" c="dimmed">AI Prediction</Text>
                          <Group gap="xs">
                            <Text fw={700} size="md">
                              {currentPrediction.predictedLanguage}
                            </Text>
                            <Badge color={currentPrediction.isCorrect ? 'green' : 'red'} size="sm" variant="light">
                              {currentPrediction.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed" mt={2}>
                            Speech Duration: {round(currentPrediction.duration, 1)}s
                          </Text>
                        </div>
                      </Group>
                      <RingProgress
                        size={56}
                        thickness={5}
                        roundCaps
                        sections={[{ value: currentPrediction.confidence * 100, color: currentPrediction.isCorrect ? 'indigo' : 'orange' }]}
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

            {/* Navigation Actions */}
            {currentPrediction && (
              <Group grow>
                <Button
                  variant="default"
                  leftSection={<IconReload size={16} />}
                  onClick={reRecord}
                >
                  Re-record Test
                </Button>
                <Button
                  variant="default"
                  leftSection={<IconListDetails size={16} />}
                  onClick={() => setTechSpecModalOpen(true)}
                >
                  Tech Specs
                </Button>
                {isLastTest ? (
                  <Button
                    color="indigo"
                    rightSection={<IconCheck size={16} />}
                    onClick={goNext}
                  >
                    View Final Session Report
                  </Button>
                ) : (
                  <Button
                    color="indigo"
                    rightSection={<IconArrowRight size={16} />}
                    onClick={goNext}
                  >
                    Proceed to Test {currentTestNumber + 1} ({nextTestLanguage})
                  </Button>
                )}
              </Group>
            )}
          </Stack>
        </Container>

        {/* Technical Specification Modal */}
        <Modal 
          opened={techSpecModalOpen} 
          onClose={() => setTechSpecModalOpen(false)} 
          title={<Text fw={700} size="md">Acoustic Technical Specifications</Text>}
          size="lg"
          centered
        >
          {currentPrediction?.techSpecs ? (
            <Stack gap="md">
              <Text size="xs" c="dimmed">
                Acoustic features extracted from this 5-sentence speech recording for language classification.
              </Text>

              {currentPrediction.techSpecs.blobUrl && (
                <SpectrogramViewer audioUrl={currentPrediction.techSpecs.blobUrl} />
              )}
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Badge color="indigo" variant="light" size="xs" mb="xs">Spectral Features</Badge>
                  <Table size="xs" withTableBorder striped>
                    <Table.Tbody>
                      <Table.Tr><Table.Td>Centroid</Table.Td><Table.Td>{currentPrediction.techSpecs.spectral.centroid}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>Bandwidth</Table.Td><Table.Td>{currentPrediction.techSpecs.spectral.bandwidth}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>Rolloff</Table.Td><Table.Td>{currentPrediction.techSpecs.spectral.rolloff}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>Contrast</Table.Td><Table.Td>{currentPrediction.techSpecs.spectral.contrast}</Table.Td></Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Box>
                <Box>
                  <Badge color="indigo" variant="light" size="xs" mb="xs">Prosodic &amp; Formants</Badge>
                  <Table size="xs" withTableBorder striped>
                    <Table.Tbody>
                      <Table.Tr><Table.Td>Pitch</Table.Td><Table.Td>{currentPrediction.techSpecs.prosodic.pitch}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>F1 Formant</Table.Td><Table.Td>{currentPrediction.techSpecs.formants.f1}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>F2 Formant</Table.Td><Table.Td>{currentPrediction.techSpecs.formants.f2}</Table.Td></Table.Tr>
                      <Table.Tr><Table.Td>Duration</Table.Td><Table.Td>{currentPrediction.techSpecs.prosodic.duration}</Table.Td></Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Box>
              </SimpleGrid>
            </Stack>
          ) : (
            <Text size="sm">No specifications available for this recording.</Text>
          )}
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}

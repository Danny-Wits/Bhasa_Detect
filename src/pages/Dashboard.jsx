import React, { useEffect } from 'react';
import { 
  AppShell, Container, Title, Text, Button, Paper, Group, 
  Badge, Stack, Loader, Center, RingProgress, SimpleGrid, Grid, Skeleton 
} from '@mantine/core';
import { IconBrain, IconLogout } from '@tabler/icons-react';
import { AreaChart, DonutChart } from '@mantine/charts';
import '@mantine/charts/styles.css';

import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';
import { useAudioSubmission } from '../hooks/useAudioSubmission';
import { useDashboardData } from '../hooks/useDashboardData';
import AudioRecorder from '../components/AudioRecorder';
import Logo from '../components/Logo';

export default function Dashboard() {
  const { logout } = useAuth();
  const { profile } = useProfile();
  
  const { data: dashboardData, loading: dataLoading } = useDashboardData();
  
  const { 
    currentLine, 
    targetLanguage, 
    generateLine, 
    submitAudio, 
    isPredicting, 
    prediction 
  } = useAudioSubmission(profile?.languages);

  useEffect(() => {
    if (profile?.languages?.length > 0 && !currentLine) {
      generateLine();
    }
  }, [profile, currentLine, generateLine]);

  const handleRecordingComplete = async (audioBlob) => {
    await submitAudio(audioBlob);
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Logo size={32} />
            <Text fw={700} size="lg" variant="gradient" gradient={{ from: 'blue.7', to: 'grape.7', deg: 45 }}>
              Bhasa Detect
            </Text>
          </Group>
          <Button variant="subtle" color="gray" onClick={logout} rightSection={<IconLogout size={16} />}>
            Logout
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          <Grid gutter="xl">
            {/* Left Column: Recording Task */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="xl">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Title order={2}>Audio Collection</Title>
                    <Text c="dimmed">Speak the line below to train our AI models.</Text>
                  </div>
                  <Badge size="lg" color="blue" variant="light">
                    {profile?.name}
                  </Badge>
                </Group>

                <Paper withBorder shadow="sm" p="xl" radius="md" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--mantine-color-blue-filled)' }} />
                  
                  <Stack align="center" gap="lg" mt="sm">
                    <Badge size="md" variant="dot" color="grape">
                      Target Language: {targetLanguage}
                    </Badge>
                    
                    <Text fw={500} ta="center" fz={{ base: 'xl', md: 28 }} lh={1.4}>
                      "{currentLine}"
                    </Text>

                    {!isPredicting && !prediction && (
                       <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                    )}

                    {isPredicting && (
                      <Stack align="center" mt="xl" gap="sm">
                        <Loader size="lg" variant="bars" color="grape" />
                        <Text fw={500} c="dimmed">AI is analyzing the audio...</Text>
                      </Stack>
                    )}

                    {prediction && (
                      <Paper withBorder p="md" radius="md" w="100%" mt="md" bg="gray.0">
                        <Group justify="space-between" wrap="nowrap">
                          <Group>
                            <Center w={50} h={50} style={{ borderRadius: '50%', background: 'white' }}>
                              <IconBrain size={28} color="var(--mantine-color-grape-6)" />
                            </Center>
                            <div>
                              <Text size="sm" c="dimmed">AI Prediction</Text>
                              <Text fw={700} size="lg" c={prediction.isMatch ? 'green' : 'red'}>
                                {prediction.predictedLanguage}
                              </Text>
                            </div>
                          </Group>
                          
                          <RingProgress
                            size={60}
                            thickness={6}
                            roundCaps
                            sections={[{ value: prediction.confidence * 100, color: prediction.isMatch ? 'green' : 'orange' }]}
                            label={
                              <Center>
                                <Text fw={700} size="xs">
                                  {Math.round(prediction.confidence * 100)}%
                                </Text>
                              </Center>
                            }
                          />
                        </Group>
                      </Paper>
                    )}

                    {prediction && (
                      <Button mt="md" fullWidth onClick={generateLine} size="lg" variant="light" color="blue">
                        Next Sentence
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            {/* Right Column: Analytics & Stats */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="xl">
                <div>
                  <Title order={3} mb="xs">Your Impact</Title>
                  <Text c="dimmed" size="sm">Your real-time contribution statistics.</Text>
                </div>

                {dataLoading ? (
                  <Stack gap="md">
                    <Skeleton height={100} radius="md" />
                    <Skeleton height={250} radius="md" />
                    <Skeleton height={250} radius="md" />
                  </Stack>
                ) : (
                  <>
                    <SimpleGrid cols={2}>
                      <Paper withBorder p="md" radius="md">
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Total Audio Lines</Text>
                        <Text fw={700} size="xl" variant="gradient">{dashboardData.contributions}</Text>
                      </Paper>
                      <Paper withBorder p="md" radius="md">
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Avg. Accuracy</Text>
                        <Text fw={700} size="xl" c="green">{dashboardData.avgConfidence}%</Text>
                      </Paper>
                    </SimpleGrid>

                    <Paper withBorder p="md" radius="md">
                      <Text fw={600} mb="md">Contributions Over Time</Text>
                      <AreaChart
                        h={200}
                        data={dashboardData.activityData}
                        dataKey="date"
                        series={[
                          { name: 'English', color: 'blue.6' },
                          { name: 'Hindi', color: 'grape.6' },
                          { name: 'Dogri', color: 'teal.6' }
                        ]}
                        curveType="monotone"
                        withGradient
                      />
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                      <Text fw={600} mb="md">Language Distribution</Text>
                      <Group justify="center" mt="md">
                        <DonutChart 
                          size={160} 
                          thickness={20} 
                          data={dashboardData.languageData} 
                          withTooltip 
                        />
                        <Stack gap="xs">
                          {dashboardData.languageData.map(lang => (
                            <Group key={lang.name} gap="xs">
                              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: `var(--mantine-color-${lang.color.replace('.', '-')})` }} />
                              <Text size="sm">{lang.name} ({lang.value})</Text>
                            </Group>
                          ))}
                        </Stack>
                      </Group>
                    </Paper>
                  </>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

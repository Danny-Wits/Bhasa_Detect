import React from 'react';
import {
  AppShell, Container, Title, Text, Button, Paper, Group,
  Badge, Stack, SimpleGrid, Grid, Skeleton, Table, Progress, Center, ThemeIcon
} from '@mantine/core';
import {
  IconLogout, IconMicrophone, IconChartBar, IconClock, IconTargetArrow,
  IconLanguage, IconPlayerPlay
} from '@tabler/icons-react';
import { AreaChart, DonutChart, BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';
import { useDashboardData } from '../hooks/useDashboardData';
import Logo from '../components/Logo';

import SiteHeader from '../components/SiteHeader';

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{label}</Text>
        <ThemeIcon size="sm" variant="light" color="gray">
          <Icon size={14} />
        </ThemeIcon>
      </Group>
      <Text fw={700} fz={28}>{value}</Text>
      {description && <Text size="xs" c="dimmed" mt={4}>{description}</Text>}
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile } = useProfile();
  const { data, loading } = useDashboardData();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <SiteHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          {loading ? (
            <Stack gap="md">
              <Skeleton height={80} radius="md" />
              <SimpleGrid cols={{ base: 1, md: 4 }}><Skeleton height={100} /><Skeleton height={100} /><Skeleton height={100} /><Skeleton height={100} /></SimpleGrid>
              <Skeleton height={300} radius="md" />
            </Stack>
          ) : (
            <Stack gap="xl">
              {/* Welcome Banner */}
              <Paper withBorder p="xl" radius="lg" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#1a1b1e' }} />
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <div>
                    <Title order={2} mb="xs">Welcome back, {profile?.name}!</Title>
                    <Text c="dimmed">
                      Your evaluation dashboard — track your contributions to multilingual speech recognition research.
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      <strong>Languages:</strong> {profile?.languages?.join(', ')} &nbsp;|&nbsp;
                      <strong>Location:</strong> {profile?.district ? `${profile.district}, ${profile.state}` : '—'}
                    </Text>
                  </div>
                  <Button rightSection={<IconPlayerPlay size={16} />} onClick={() => navigate('/record')}>
                    New Recording Session
                  </Button>
                </Group>
              </Paper>

              {/* Stat Cards */}
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                <StatCard icon={IconChartBar} label="Total Sessions" value={data.totalSessions} description="Recording sessions completed" />
                <StatCard icon={IconMicrophone} label="Sentences Spoken" value={data.totalSentences} description="Across all languages" />
                <StatCard icon={IconTargetArrow} label="Overall Accuracy" value={`${data.overallAccuracy}%`} description="Model prediction accuracy" />
                <StatCard icon={IconClock} label="Speaking Time" value={data.totalSpeakingTime} description={`Avg. ${data.avgUtteranceDuration} per sentence`} />
              </SimpleGrid>

              {/* Charts Row */}
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Paper withBorder p="md" radius="md" h="100%">
                    <Text fw={600} mb="md">Contributions Over Time</Text>
                    <AreaChart
                      h={280}
                      data={data.activityData}
                      dataKey="date"
                      series={[
                        { name: 'English', color: 'dark.6' },
                        { name: 'Hindi', color: 'gray.5' },
                        { name: 'Dogri', color: 'gray.3' },
                      ]}
                      curveType="monotone"
                      withGradient
                    />
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Paper withBorder p="md" radius="md" h="100%">
                    <Text fw={600} mb="md">Language Distribution</Text>
                    <Center>
                      <DonutChart
                        size={160}
                        thickness={20}
                        data={[
                          { name: 'English', value: 24, color: 'dark.9' },
                          { name: 'Hindi', value: 20, color: 'gray.6' },
                          { name: 'Dogri', value: 16, color: 'gray.3' },
                        ]}
                        withTooltip
                      />
                    </Center>
                    <Stack gap="xs" mt="md">
                      {[
                        { name: 'English', value: 24, shade: '#1a1b1e' },
                        { name: 'Hindi', value: 20, shade: '#868e96' },
                        { name: 'Dogri', value: 16, shade: '#ced4da' },
                      ].map((lang) => (
                        <Group key={lang.name} gap="xs" justify="space-between">
                          <Group gap="xs">
                            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: lang.shade }} />
                            <Text size="sm">{lang.name}</Text>
                          </Group>
                          <Text size="sm" fw={600}>{lang.value} sentences</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>

              {/* Accuracy + Predictions Row */}
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Text fw={600} mb="md">Accuracy per Language</Text>
                    <Stack gap="md">
                      {data.languageAccuracy.map((lang) => (
                        <div key={lang.language}>
                          <Group justify="space-between" mb={4}>
                            <Text size="sm" fw={500}>{lang.language}</Text>
                            <Text size="sm" fw={700}>
                              {lang.accuracy}%
                            </Text>
                          </Group>
                          <Progress
                            value={lang.accuracy}
                            color="dark"
                            size="md"
                            radius="xl"
                          />
                          <Text size="xs" c="dimmed" mt={2}>
                            {lang.correct} correct, {lang.incorrect} incorrect
                          </Text>
                        </div>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Text fw={600} mb="md">Correct vs Incorrect Predictions</Text>
                    <BarChart
                      h={220}
                      data={data.predictionData}
                      dataKey="language"
                      series={[
                        { name: 'Correct', color: 'dark.6' },
                        { name: 'Incorrect', color: 'gray.3' },
                      ]}
                      type="stacked"
                    />
                  </Paper>
                </Grid.Col>
              </Grid>

              {/* Recent Sessions */}
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md">
                  <Text fw={600}>Recent Sessions</Text>
                  <IconLanguage size={18} color="var(--mantine-color-dimmed)" />
                </Group>
                <Table.ScrollContainer minWidth={600}>
                  <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Session</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Languages</Table.Th>
                        <Table.Th>Sentences</Table.Th>
                        <Table.Th>Accuracy</Table.Th>
                        <Table.Th>Duration</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {data.recentSessions.map((s) => (
                        <Table.Tr key={s.id}>
                          <Table.Td fw={500}>{s.id}</Table.Td>
                          <Table.Td>{s.date}</Table.Td>
                          <Table.Td>{s.combo}</Table.Td>
                          <Table.Td>{s.sentences}</Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="dark">
                              {s.accuracy}%
                            </Badge>
                          </Table.Td>
                          <Table.Td>{s.duration}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Paper>
            </Stack>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

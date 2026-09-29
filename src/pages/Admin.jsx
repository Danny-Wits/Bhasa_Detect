import React from 'react';
import { Container, Title, Paper, Text, Stack, Button, Center } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <>
      <SiteHeader />
      <Container size="md" my={60}>
        <Paper withBorder shadow="xl" p="xl" radius="lg">
          <Center mb="xl">
            <IconSettings size={80} color="var(--mantine-color-indigo-6)" />
          </Center>
          <Stack align="center" gap="md">
            <Title order={2}>Admin Dashboard (Demo)</Title>
            <Text c="dimmed" ta="center" maw={400}>
              This is a placeholder for the future admin dashboard. Here, researchers will be able to view overall results across all speakers and sessions.
            </Text>
            <Button mt="lg" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

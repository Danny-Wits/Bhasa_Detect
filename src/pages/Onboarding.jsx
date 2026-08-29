import React from 'react';
import { TextInput, NumberInput, Select, MultiSelect, Button, Container, Title, Paper, Text, Image, SimpleGrid, Stack, ThemeIcon, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { IconLanguage } from '@tabler/icons-react';
import onboardingArt from '../assets/onboarding_art.jpg';

export default function Onboarding() {
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { name: '', age: 18, gender: '', languages: [] },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      languages: (value) => (value.length === 0 ? 'Select at least one language' : null),
    },
  });

  const handleSubmit = (values) => {
    saveProfile(values);
    navigate('/dashboard');
  };

  return (
    <Container size="lg" my={40} >
      <Paper withBorder shadow="xl" p={0} radius="lg" style={{ overflow: 'hidden' }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
          
          <div style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack align="center" mb="lg">
              <ThemeIcon size={60} radius="xl" color="grape" variant="light">
                <IconLanguage size={34} />
              </ThemeIcon>
              <Title order={3} ta="center">Personalize Your AI</Title>
              <Text c="dimmed" size="sm" ta="center">
                Tell us about yourself so we can tailor the speech lines to your demographics and native languages.
              </Text>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput label="Full Name" placeholder="Your name" size="md" {...form.getInputProps('name')} />
                <Group grow>
                  <NumberInput label="Age" size="md" {...form.getInputProps('age')} />
                  <Select label="Gender" placeholder="Pick one" size="md" data={['Male', 'Female', 'Other', 'Prefer not to say']} {...form.getInputProps('gender')} />
                </Group>
                <MultiSelect label="Languages Spoken" placeholder="Select languages" size="md" data={['Hindi', 'English', 'Dogri']} {...form.getInputProps('languages')} />
                <Button type="submit" size="md" mt="md" color="grape" fullWidth>Complete Profile</Button>
              </Stack>
            </form>
          </div>

          <div style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Image src={onboardingArt} alt="Multilingual collaboration" radius="md" />
          </div>

        </SimpleGrid>
      </Paper>
    </Container>
  );
}

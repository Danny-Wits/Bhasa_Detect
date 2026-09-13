import React from 'react';
import { TextInput, NumberInput, Select, Button, Container, Title, Paper, Text, Image, SimpleGrid, Stack, ThemeIcon, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { IconLanguage } from '@tabler/icons-react';
import onboardingArt from '../assets/onboarding_art.jpg';

const LANGUAGE_COMBOS = [
  { value: 'Hindi+English', label: 'Hindi + English' },
  { value: 'Hindi+Dogri', label: 'Hindi + Dogri' },
  { value: 'English+Dogri', label: 'English + Dogri' },
  { value: 'Hindi+English+Dogri', label: 'Hindi + English + Dogri' },
];

export default function Onboarding() {
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { name: '', age: 18, gender: '', place: '', languageCombo: '' },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      gender: (value) => (!value ? 'Please select your gender' : null),
      place: (value) => (value.length < 2 ? 'Please enter your place' : null),
      languageCombo: (value) => (!value ? 'Please select a language combination' : null),
    },
  });

  const handleSubmit = (values) => {
    const languages = values.languageCombo.split('+');
    saveProfile({ ...values, languages });
    navigate('/dashboard');
  };

  return (
    <Container size="lg" my={40}>
      <Paper withBorder shadow="xl" p={0} radius="lg" style={{ overflow: 'hidden' }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>

          <div style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack align="center" mb="lg">
              <ThemeIcon size={60} radius="xl" color="grape" variant="light">
                <IconLanguage size={34} />
              </ThemeIcon>
              <Title order={3} ta="center">Speaker Profile</Title>
              <Text c="dimmed" size="sm" ta="center">
                Tell us about yourself so we can tailor the evaluation to your linguistic background.
              </Text>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput label="Full Name" placeholder="Your name" size="md" {...form.getInputProps('name')} />
                <Group grow>
                  <NumberInput label="Age" size="md" min={10} max={100} {...form.getInputProps('age')} />
                  <Select label="Gender" placeholder="Pick one" size="md" data={['Male', 'Female', 'Other', 'Prefer not to say']} {...form.getInputProps('gender')} />
                </Group>
                <TextInput label="Place" placeholder="Your city or town" size="md" {...form.getInputProps('place')} />
                <Select
                  label="Language Combination"
                  placeholder="Select the languages you'll be tested on"
                  size="md"
                  data={LANGUAGE_COMBOS}
                  {...form.getInputProps('languageCombo')}
                />
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

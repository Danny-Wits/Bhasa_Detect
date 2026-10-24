import React, { useState, useMemo } from 'react';
import { TextInput, Select, Button, Container, Title, Paper, Text, Stack, ThemeIcon, Group, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { IconLanguage } from '@tabler/icons-react';
import { indianStatesAndDistricts } from '../data/indiaLocations';

const AGE_GROUPS = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const QUALIFICATIONS = ['Below 10th', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Doctorate'];
const LANGUAGES_AVAILABLE = ['English', 'Hindi', 'Dogri'];

export default function Onboarding() {
  const { saveProfile } = useProfile();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: { 
      name: '', 
      age: '', 
      gender: '', 
      state: '', 
      district: '', 
      customDistrict: '',
      mothertongue: '',
      qualification: '',
      languages: []
    },
    validate: {
      age: (val) => (!val ? 'Please select your age group' : null),
      gender: (val) => (!val ? 'Please select your gender' : null),
      state: (val) => (!val ? 'Please select your state' : null),
      district: (val) => (!val ? 'Please select a district' : null),
      customDistrict: (val, values) => (values.district === 'Other / Not Found' && val.length < 2 ? 'Please specify your district' : null),
      mothertongue: (val) => (val.length < 2 ? 'Please enter your mother tongue' : null),
      qualification: (val) => (!val ? 'Please select your qualification' : null),
      languages: (val) => (val.length === 0 ? 'Please select at least one language' : null),
    },
  });

  const stateOptions = useMemo(() => Object.keys(indianStatesAndDistricts).sort(), []);
  
  const districtOptions = useMemo(() => {
    if (!form.values.state) return [];
    const districts = indianStatesAndDistricts[form.values.state] || [];
    return [...districts, 'Other / Not Found'];
  }, [form.values.state]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    let locationStr = "Location permission denied/unavailable";
    
    // Attempt to grab GPS coordinates
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        locationStr = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
      } catch (err) {
        console.warn("Geolocation failed", err);
      }
    }

    const finalDistrict = values.district === 'Other / Not Found' ? values.customDistrict : values.district;
    
    await saveProfile({ 
      age: values.age,
      gender: values.gender,
      state: values.state,
      district: finalDistrict,
      mothertongue: values.mothertongue,
      qualification: values.qualification,
      languages: values.languages,
      location: locationStr,
      timestamp: new Date().toISOString()
    });
    
    navigate('/dashboard');
  };

  return (
    <Container size="sm" py={50}>
      <Paper withBorder shadow="sm" p={{ base: 'lg', sm: 'xl' }} radius="md" bg="#ffffff">
        <Stack align="center" mb="lg">
          <ThemeIcon size={60} radius="xl" color="indigo" variant="light">
            <IconLanguage size={32} />
          </ThemeIcon>
          <Title order={2} ta="center" fz={{ base: 22, sm: 26 }} fw={700}>
            Participant Profile
          </Title>
          <Text c="dimmed" size="sm" ta="center" maw={440}>
            Please provide your demographic background to aid dialectal diversity and linguistic analysis.
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            
            <Group grow>
              <Select label="Age Group" placeholder="Select" size="md" data={AGE_GROUPS} {...form.getInputProps('age')} />
              <Select label="Gender" placeholder="Pick one" size="md" data={GENDERS} {...form.getInputProps('gender')} />
            </Group>
            
            <Group grow>
              <Select 
                label="State" 
                placeholder="Select state" 
                size="md" 
                data={stateOptions} 
                searchable
                {...form.getInputProps('state')}
                onChange={(val) => {
                  form.setFieldValue('state', val);
                  form.setFieldValue('district', '');
                  form.setFieldValue('customDistrict', '');
                }}
              />
              <Select 
                label="District" 
                placeholder="Select district" 
                size="md" 
                data={districtOptions} 
                searchable
                disabled={!form.values.state}
                {...form.getInputProps('district')} 
              />
            </Group>
            
            {form.values.district === 'Other / Not Found' && (
              <TextInput label="Specify District" placeholder="Enter your district" size="md" {...form.getInputProps('customDistrict')} />
            )}

            <Group grow>
              <TextInput label="Mother Tongue" placeholder="e.g. Dogri, Hindi" size="md" {...form.getInputProps('mothertongue')} />
              <Select label="Qualification" placeholder="Select" size="md" data={QUALIFICATIONS} {...form.getInputProps('qualification')} />
            </Group>

            <MultiSelect
              label="Languages for Evaluation"
              placeholder="Select one or more languages"
              size="md"
              data={LANGUAGES_AVAILABLE}
              {...form.getInputProps('languages')}
            />

            <Button type="submit" size="md" mt="sm" fullWidth loading={isSubmitting} color="indigo">
              Save Profile &amp; Continue
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

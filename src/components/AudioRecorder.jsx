import React, { useState, useRef } from 'react';
import { ActionIcon, Text, Stack } from '@mantine/core';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';

export default function AudioRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Microphone access is required to record audio. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Stack align="center" gap="md" mt="xl">
      <ActionIcon 
        color={isRecording ? 'red' : 'blue'} 
        size={90} 
        radius="100%" 
        variant={isRecording ? 'filled' : 'light'}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        style={{
          transition: 'all 0.2s ease',
          transform: isRecording ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isRecording ? '0 0 20px rgba(250, 82, 82, 0.6)' : 'none'
        }}
      >
        {isRecording ? <IconPlayerStop size={45} /> : <IconMicrophone size={45} />}
      </ActionIcon>
      
      <Text size="sm" c="dimmed" fw={500}>
        {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
      </Text>
    </Stack>
  );
}

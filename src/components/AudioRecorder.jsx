import React, { useState, useRef, useEffect } from 'react';
import { ActionIcon, Text, Stack, Box } from '@mantine/core';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

export default function AudioRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const recordRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#1a1b1e', // Dark monochrome theme
      progressColor: '#1a1b1e',
      barWidth: 4,
      barGap: 3,
      barRadius: 4,
      height: 120, // Taller bars
      barHeight: 1.5, // Exaggerate the height multipliers
      cursorWidth: 0,
      interact: false,
      normalize: true,
    });

    // Initialize Record plugin
    const record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    record.on('record-end', (blob) => {
      onRecordingComplete(blob);
    });

    wavesurferRef.current = wavesurfer;
    recordRef.current = record;

    return () => {
      if (recordRef.current) {
        // Safe check to avoid calling stop if not recording, though stopRecording is usually safe
        try {
           recordRef.current.stopRecording();
        } catch (e) {}
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [onRecordingComplete]);

  const startRecording = async () => {
    if (!recordRef.current) return;
    try {
      await recordRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Microphone access is required to record audio. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (recordRef.current && isRecording) {
      recordRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <Stack align="center" gap="lg" mt="xl">
      <ActionIcon 
        color="dark" 
        size={90} 
        radius="100%" 
        variant={isRecording ? 'filled' : 'light'}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        style={{
          transition: 'all 0.2s ease',
          transform: isRecording ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isRecording ? '0 0 20px rgba(26, 27, 30, 0.3)' : 'none'
        }}
      >
        {isRecording ? <IconPlayerStop size={45} /> : <IconMicrophone size={45} />}
      </ActionIcon>
      
      {/* WaveSurfer Container */}
      <Box 
        ref={containerRef} 
        w={280} 
        h={120} 
        style={{ 
          opacity: disabled ? 0.3 : 1,
          transition: 'opacity 0.2s ease',
          // Draw a flat dim line when not recording to indicate the waveform area
          background: !isRecording ? 'linear-gradient(transparent 58px, #ced4da 58px, #ced4da 62px, transparent 62px)' : 'none',
          borderRadius: '4px'
        }} 
      />

      <Text size="sm" c="dimmed" fw={500}>
        {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
      </Text>
    </Stack>
  );
}

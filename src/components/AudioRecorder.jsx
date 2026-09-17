import React, { useState, useRef, useEffect } from 'react';
import { ActionIcon, Text, Stack } from '@mantine/core';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';

export default function AudioRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Waveform refs
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    animationRef.current = requestAnimationFrame(drawWaveform);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Settings for the bars
    const barCount = 40; // Number of bars to display
    const barWidth = (canvas.width / barCount) - 2;
    let x = 1;

    for (let i = 0; i < barCount; i++) {
      // Voice frequencies are primarily in the lower half of the spectrum
      // We skip the very first few low freq bins to avoid DC offset/rumble
      const dataIndex = i * 2 + 2; 
      const value = dataArray[dataIndex] || 0;
      
      // Map amplitude to canvas height, with a minimum height of 4px
      const minHeight = 4;
      let barHeight = (value / 255) * canvas.height;
      if (barHeight < minHeight) barHeight = minHeight;
      
      // Center the bars vertically
      const y = (canvas.height - barHeight) / 2;

      canvasCtx.fillStyle = '#1a1b1e'; // Monochrome dark
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      canvasCtx.fill();
      
      x += barWidth + 2;
    }
  };

  const drawIdleWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barCount = 40;
    const barWidth = (canvas.width / barCount) - 2;
    let x = 1;

    for (let i = 0; i < barCount; i++) {
      const barHeight = 4;
      const y = (canvas.height - barHeight) / 2;
      canvasCtx.fillStyle = '#ced4da'; // Dim gray for idle state
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      canvasCtx.fill();
      x += barWidth + 2;
    }
  };

  useEffect(() => {
    // Draw idle line when not recording
    if (!isRecording) {
      drawIdleWaveform();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Set up Web Audio API for visualizer
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Cleanup audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      drawWaveform(); // Start animation loop
      
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
      
      {/* Waveform Canvas */}
      <canvas 
        ref={canvasRef} 
        width={280} 
        height={60} 
        style={{ 
          display: 'block',
          opacity: disabled ? 0.3 : 1,
          transition: 'opacity 0.2s ease'
        }} 
      />

      <Text size="sm" c="dimmed" fw={500}>
        {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
      </Text>
    </Stack>
  );
}

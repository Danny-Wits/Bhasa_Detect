import React, { useState, useRef, useEffect } from 'react';
import { ActionIcon, Text, Stack, Box, Group, Progress, Badge } from '@mantine/core';
import { IconMicrophone, IconPlayerStop, IconWaveSine } from '@tabler/icons-react';

const MAX_DURATION_SECONDS = 60; // 1 minute limit

export default function AudioRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);

  // Draw resting waveform when idle
  const drawIdleWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = 4;
    const barGap = 3;
    const step = barWidth + barGap;
    const barCount = Math.floor((width - barGap) / step);
    const startX = Math.floor((width - (barCount * step - barGap)) / 2);

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * step;
      // Gentle sine curve for idle waveform appearance
      const wave = Math.sin((i / barCount) * Math.PI) * 16;
      const barHeight = Math.max(4, wave);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = '#cbd5e1'; // Soft slate gray
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }
  };

  // Draw active live waveform responding to microphone audio
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      if (!analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = 4;
      const barGap = 3;
      const step = barWidth + barGap;
      const barCount = Math.floor((width - barGap) / step);
      const startX = Math.floor((width - (barCount * step - barGap)) / 2);

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * step;

        // Map frequency bins emphasizing human vocal range (lower-mid frequencies)
        const freqIndex = Math.min(
          bufferLength - 1,
          Math.floor((i / barCount) * (bufferLength * 0.7) + 2)
        );
        const value = dataArray[freqIndex] || 0;

        // Calculate dynamic bar height (min 4px so bars remain visible)
        const maxBarHeight = height - 12;
        const barHeight = Math.max(4, (value / 255) * maxBarHeight);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = '#4f46e5'; // Solid Indigo
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    };

    render();
  };

  // Draw initial idle waveform on mount
  useEffect(() => {
    drawIdleWaveform();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // 1-minute auto-stop countdown
  useEffect(() => {
    if (isRecording) {
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_DURATION_SECONDS) {
            clearInterval(timerRef.current);
            setTimeout(() => {
              stopRecording();
            }, 0);
            return MAX_DURATION_SECONDS;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // AudioContext - ensure running on explicit user gesture
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      // Pick supported recording MIME type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav',
      ];
      const selectedType =
        mimeTypes.find(
          (t) => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)
        ) || '';

      const recorder = new MediaRecorder(
        stream,
        selectedType ? { mimeType: selectedType } : undefined
      );
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedType || 'audio/webm',
        });
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };

      recorder.start(250);
      setIsRecording(true);
      startVisualizer();
    } catch (err) {
      console.error('Error starting audio recording:', err);
      alert('Microphone access is required to record audio. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Return to resting idle waveform
    drawIdleWaveform();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingSeconds = MAX_DURATION_SECONDS - secondsElapsed;
  const progressValue = (secondsElapsed / MAX_DURATION_SECONDS) * 100;

  return (
    <Stack align="center" gap="md" mt="md" w="100%">
      {/* 1-Minute Live Countdown & Progress Bar */}
      {isRecording && (
        <Box w="100%" maw={360}>
          <Group justify="space-between" mb={4}>
            <Badge color="red" variant="filled" size="sm">
              Recording ({formatTime(secondsElapsed)} / 1:00)
            </Badge>
            <Text size="xs" c={remainingSeconds <= 10 ? 'red' : 'dimmed'} fw={600}>
              {remainingSeconds}s remaining
            </Text>
          </Group>
          <Progress
            value={progressValue}
            size="sm"
            color={remainingSeconds <= 10 ? 'red' : 'indigo'}
            radius="xl"
            animated
          />
        </Box>
      )}

      {/* Mic Record / Stop Button */}
      <ActionIcon
        color="indigo"
        size={84}
        radius="100%"
        variant={isRecording ? 'filled' : 'light'}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        style={{
          transition: 'all 0.2s ease',
          transform: isRecording ? 'scale(1.08)' : 'scale(1)',
          boxShadow: isRecording ? '0 0 24px rgba(79, 70, 229, 0.4)' : 'none',
        }}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? <IconPlayerStop size={40} /> : <IconMicrophone size={40} />}
      </ActionIcon>

      {/* Live Waveform Display Container */}
      <Box
        w="100%"
        maw={360}
        p="xs"
        style={{
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: isRecording ? '#ffffff' : '#f8fafc',
          transition: 'all 0.2s ease',
        }}
      >
        <Group justify="space-between" mb={6} px={4}>
          <Group gap={4}>
            <IconWaveSine size={14} color={isRecording ? '#4f46e5' : '#94a3b8'} />
            <Text size="xs" fw={600} c={isRecording ? 'indigo' : 'dimmed'}>
              {isRecording ? 'Live Audio Waveform' : 'Microphone Waveform'}
            </Text>
          </Group>
          <Badge
            size="xs"
            variant="light"
            color={isRecording ? 'red' : 'gray'}
          >
            {isRecording ? '● Live Input' : 'Ready'}
          </Badge>
        </Group>

        <canvas
          ref={canvasRef}
          width={336}
          height={76}
          style={{
            display: 'block',
            width: '100%',
            height: '76px',
            opacity: disabled ? 0.4 : 1,
          }}
        />
      </Box>

      <Text size="sm" c={isRecording ? 'red.7' : 'dimmed'} fw={500} ta="center">
        {isRecording
          ? 'Reading passage... Tap button when finished (max 1 min)'
          : 'Tap microphone to start recording the 5 sentences (max 1 minute)'}
      </Text>
    </Stack>
  );
}

import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.esm.js';
import { Box, Text } from '@mantine/core';

export default function SpectrogramViewer({ audioUrl }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'var(--mantine-color-gray-4)',
      progressColor: 'var(--mantine-color-dark-4)',
      barWidth: 2,
      height: 60,
      cursorWidth: 1,
      interact: true,
      plugins: [
        Spectrogram.create({
          labels: true,
          height: 120,
          splitChannels: false,
          frequencyMin: 0,
          frequencyMax: 8000,
        }),
      ],
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.load(audioUrl);

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <Box mt="md" mb="xl">
      <Text size="sm" fw={600} mb="xs">Spectrogram Analysis</Text>
      <Box 
        ref={containerRef} 
        style={{ 
          border: '1px solid var(--mantine-color-gray-3)', 
          borderRadius: '4px',
          overflow: 'hidden' 
        }} 
      />
    </Box>
  );
}

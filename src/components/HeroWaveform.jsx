import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

function createNoiseWavBlob(durationSec, sampleRate = 44100) {
  const numSamples = durationSec * sampleRate;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); // 1 channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true); // 16 bit
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // fill with randomized noise shaped like speech pulses
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.abs(Math.sin(t * Math.PI * 1.5) * Math.cos(t * Math.PI * 0.5));
    const val = (Math.random() * 2 - 1) * env * 0.3 * 32767;
    view.setInt16(44 + i * 2, val, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export default function HeroWaveform() {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer v7
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'var(--mantine-color-gray-4)',
      progressColor: 'var(--mantine-color-gray-5)',
      barWidth: 4,
      barGap: 4,
      barRadius: 4,
      height: 120,
      cursorWidth: 0,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    // Generate a valid in-memory WAV file blob
    const blob = createNoiseWavBlob(3);
    const url = URL.createObjectURL(blob);

    wavesurfer.load(url);
    
    // Play in a loop silently
    wavesurfer.on('ready', () => {
      wavesurfer.setVolume(0);
      wavesurfer.play();
    });
    
    wavesurfer.on('finish', () => {
      wavesurfer.play();
    });

    return () => {
      wavesurfer.destroy();
      URL.revokeObjectURL(url);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', maxWidth: '400px', position: 'absolute', zIndex: 1, opacity: 0.6 }} />;
}

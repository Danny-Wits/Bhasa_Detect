import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function HeroWaveform() {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
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

    // Generate a random 3-second audio buffer with some envelope shaping to look like speech
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 3;
    const sampleRate = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      // Create a smooth envelope
      const t = i / sampleRate;
      const envelope = Math.abs(Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI * 1.5) * Math.cos(t * Math.PI * 0.5));
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    wavesurfer.setVolume(0);
    wavesurfer.loadDecodedBuffer(buffer);
    
    // Play in a loop
    wavesurfer.on('ready', () => {
      wavesurfer.play();
    });
    
    wavesurfer.on('finish', () => {
      wavesurfer.play();
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', maxWidth: '400px', position: 'absolute', zIndex: 1, opacity: 0.6 }} />;
}

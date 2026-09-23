import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

// A tiny silent WAV file data URI to prevent wavesurfer from fetching missing files
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

export default function HeroWaveform() {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer v7
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#818cf8',       // indigo-400
      progressColor: '#818cf8',
      barWidth: 4,
      barGap: 4,
      barRadius: 4,
      height: 200,
      barHeight: 1.5,
      cursorWidth: 0,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    const numBars = 40;
    let currentPeaks = Array(numBars).fill(0.01);
    let targetPeaks = Array(numBars).fill(0.01);

    let lastTargetUpdate = 0;

    // Run animation smoothly at 20fps
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Only pick new random targets every 800ms for a slower, calmer effect
      if (now - lastTargetUpdate > 800) {
        for (let i = 0; i < numBars; i++) {
          const normalized = Math.abs((i / numBars) - 0.5) * 2; 
          const envelope = Math.max(0.1, 1 - normalized * 0.8);
          targetPeaks[i] = (Math.random() * 0.9 + 0.1) * envelope;
        }
        lastTargetUpdate = now;
      }

      // Smooth, slow interpolation
      for (let i = 0; i < numBars; i++) {
        currentPeaks[i] += (targetPeaks[i] - currentPeaks[i]) * 0.08;
      }

      // Force wavesurfer to redraw with the new randomized peaks
      wavesurfer.load(SILENT_WAV, [currentPeaks], 1);
    }, 50);

    return () => {
      clearInterval(interval);
      wavesurfer.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', maxWidth: '400px', position: 'absolute', zIndex: 1, opacity: 0.6 }} />;
}

import React, { useRef, useEffect, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Mic, Activity, Volume2, ShieldCheck } from 'lucide-react';

interface AcousticSpectrogramProps {
  className?: string;
}

export const AcousticSpectrogram: React.FC<AcousticSpectrogramProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedTrack, tracks } = useSimulation();
  const track = selectedTrack || tracks[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Dark acoustic background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Draw frequency grid lines (0 to 1200 Hz)
      ctx.strokeStyle = 'rgba(31, 51, 77, 0.4)';
      ctx.lineWidth = 1;
      const freqMarkers = ['0 Hz', '200 Hz', '400 Hz', '600 Hz', '800 Hz', '1000 Hz'];
      for (let i = 0; i < 6; i++) {
        const x = (width / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, 15);
        ctx.lineTo(x, height - 15);
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#829bb5';
        ctx.fillText(freqMarkers[i], Math.max(2, x - 15), height - 4);
      }

      // Base Acoustic Noise Floor (Wind / Ambient)
      ctx.beginPath();
      ctx.moveTo(0, height - 25);
      for (let x = 0; x < width; x += 4) {
        const noise = (Math.sin(x * 0.08 + time) * 3) + (Math.random() * 3);
        const y = height - 28 - noise;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(130, 155, 181, 0.3)';
      ctx.stroke();

      // Drone Blade Pass Frequency (BPF) Harmonics
      if (track && track.groundTruth !== 'Non-threat object') {
        const fundamentalFreq = 340; // 340 Hz (approx 5100 RPM for 4-blade)
        const harmonics = [1, 2, 3]; // 340Hz, 680Hz, 1020Hz

        harmonics.forEach((h, hidx) => {
          const freqHz = fundamentalFreq * h;
          const xPos = (freqHz / 1000) * (width * 0.83);
          const peakHeight = (height * 0.7) / (h * 0.9);

          const grad = ctx.createLinearGradient(0, height - peakHeight, 0, height);
          grad.addColorStop(0, '#00e5a3');
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(xPos - 8, height - 25);
          ctx.lineTo(xPos, height - 25 - peakHeight);
          ctx.lineTo(xPos + 8, height - 25);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#00e5a3';
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(`BPF H${hidx + 1}:${freqHz}Hz`, xPos - 18, height - 30 - peakHeight);
        });
      } else if (track && track.groundTruth === 'Non-threat object') {
        // Avian wing flap acoustic peak (~4 Hz, very low frequency)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(30, height - 40, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('AVIAN WINGBEAT: 4.2 Hz', 45, height - 36);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [track]);

  return (
    <div className={`bg-tactical-surface border border-tactical-border rounded-lg p-3 font-mono text-xs flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-tactical-border text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-tactical-primary animate-pulse" />
          ACOUSTIC SPECTRUM & BLADE PASS FREQUENCY (BPF)
        </span>
        <span className="text-[10px] text-tactical-primary font-bold">
          EST. MOTOR: 5,100 RPM
        </span>
      </div>

      <div className="relative w-full h-36 bg-[#060a12] border border-tactical-border rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          width={560}
          height={144}
          className="w-full h-full block"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-tactical-textMuted pt-1">
        <span>Acoustic Signature: <strong className="text-white">Harmonic Rotor Whine (BPF = 340 Hz)</strong></span>
        <span className="text-tactical-accent">Confidence: {track?.sensors.acoustic || 68}%</span>
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Radio, Activity, Zap, ShieldAlert, Sliders } from 'lucide-react';

interface RFSpectrumAnalyzerProps {
  className?: string;
}

export const RFSpectrumAnalyzer: React.FC<RFSpectrumAnalyzerProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tracks, selectedTrack, sensors } = useSimulation();

  const [activeBand, setActiveBand] = useState<'ALL' | '2.4GHz' | '5.8GHz' | '868MHz' | 'GNSS'>('ALL');
  const [rfGain, setRfGain] = useState<number>(75);

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

      // Dark background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Grid lines for dBm power levels (-110 dBm to -30 dBm)
      ctx.strokeStyle = 'rgba(31, 51, 77, 0.4)';
      ctx.lineWidth = 1;
      const dbmLevels = ['-30 dBm', '-50 dBm', '-70 dBm', '-90 dBm', '-110 dBm'];
      for (let i = 0; i < 5; i++) {
        const y = (height / 5) * i + 15;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#829bb5';
        ctx.fillText(dbmLevels[i], 2, y + 3);
      }

      // Frequency ticks at bottom
      const bands = [
        { label: '433M', x: 0.1 },
        { label: '868M', x: 0.25 },
        { label: '1.2G', x: 0.4 },
        { label: '1.57G GNSS', x: 0.55 },
        { label: '2.4G ISM', x: 0.72 },
        { label: '5.8G FPV', x: 0.9 },
      ];
      bands.forEach(b => {
        const bx = 45 + b.x * (width - 55);
        ctx.strokeStyle = 'rgba(0, 229, 163, 0.2)';
        ctx.beginPath();
        ctx.moveTo(bx, 15);
        ctx.lineTo(bx, height - 15);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 195, 255, 0.8)';
        ctx.fillText(b.label, bx - 14, height - 4);
      });

      // Ambient Noise Floor curve
      ctx.beginPath();
      ctx.moveTo(45, height - 25);
      for (let x = 45; x < width; x += 3) {
        const noise = (Math.sin(x * 0.05 + time) * 3) + (Math.random() * 4);
        const y = height - 30 - noise;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(130, 155, 181, 0.3)';
      ctx.stroke();

      // Draw Drone RF Carrier Spikes (C2 Link & Video Link)
      tracks.forEach((trk, idx) => {
        if (trk.groundTruth === 'Non-threat object' && !trk.isDecoy) return;

        // Position peaks across 2.4G and 5.8G
        const center24G = 45 + 0.72 * (width - 55) + (Math.sin(time * 2 + idx) * 12);
        const center58G = 45 + 0.9 * (width - 55) + (Math.cos(time * 1.5 + idx) * 10);
        const peakHeight = Math.min(height - 40, (rfGain / 100) * (height * 0.75));

        // 2.4 GHz FHSS Pulse
        const grad = ctx.createLinearGradient(0, height - peakHeight, 0, height);
        grad.addColorStop(0, trk.threatLevel === 'HIGH' ? '#ef4444' : '#00e5a3');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(center24G - 12, height - 25);
        ctx.lineTo(center24G, height - 25 - peakHeight);
        ctx.lineTo(center24G + 12, height - 25);
        ctx.closePath();
        ctx.fill();

        // 5.8 GHz Video carrier
        ctx.fillStyle = 'rgba(0, 195, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(center58G - 18, height - 25);
        ctx.lineTo(center58G, height - 25 - (peakHeight * 0.65));
        ctx.lineTo(center58G + 18, height - 25);
        ctx.closePath();
        ctx.fill();

        // Signal ID tag
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(`FHSS:${trk.callsign}`, center24G - 14, height - 30 - peakHeight);
      });

      // If radar degraded (Electronic Jamming present)
      if (sensors.Radar.status === 'DEGRADED') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(45, 15, width - 45, height - 35);

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('⚠ ELECTRONIC JAMMING NOISE BURST DETECTED (BROADBAND)', width / 2 - 160, 45);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [tracks, rfGain, activeBand, sensors.Radar.status]);

  return (
    <div className={`bg-tactical-surface border border-tactical-border rounded-lg p-3 font-mono text-xs flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-tactical-border text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-tactical-accent animate-pulse" />
          RF SPECTRUM & C2 PROTOCOL ANALYZER
        </span>
        <span className="text-[10px] text-tactical-primary font-bold">
          433MHz – 5.8GHz SCANNER
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

      <div className="flex items-center justify-between text-[11px] pt-1 text-tactical-textMuted">
        <div className="flex items-center gap-2">
          <span>RF Sensitivity:</span>
          <input
            type="range"
            min="30"
            max="100"
            value={rfGain}
            onChange={(e) => setRfGain(Number(e.target.value))}
            className="w-24 accent-tactical-accent h-1 bg-slate-800 rounded"
          />
          <span className="font-bold text-white">{rfGain}%</span>
        </div>

        <div className="text-[10px] text-tactical-accent">
          PROTOCOL: FHSS 2.4G (OcuSync / ExpressLRS Encrypted)
        </div>
      </div>
    </div>
  );
};

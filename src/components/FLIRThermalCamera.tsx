import React, { useRef, useEffect, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Flame, Eye, Crosshair, ZoomIn, ZoomOut, Sliders } from 'lucide-react';

interface FLIRThermalCameraProps {
  className?: string;
}

export const FLIRThermalCamera: React.FC<FLIRThermalCameraProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedTrack, tracks } = useSimulation();

  const [palette, setPalette] = useState<'WHITE_HOT' | 'BLACK_HOT' | 'IRONBOW'>('IRONBOW');
  const [zoomLevel, setZoomLevel] = useState<number>(2); // 1x, 2x, 4x

  const track = selectedTrack || tracks[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.08;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Base background gradient based on palette
      if (palette === 'WHITE_HOT') {
        ctx.fillStyle = '#080c14';
      } else if (palette === 'BLACK_HOT') {
        ctx.fillStyle = '#c5d8ea';
      } else {
        // Ironbow deep purple/navy base
        ctx.fillStyle = '#100a26';
      }
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric thermal noise
      ctx.fillStyle = palette === 'BLACK_HOT' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
      for (let i = 0; i < 40; i++) {
        const nx = (Math.sin(i * 13 + time) * 0.5 + 0.5) * width;
        const ny = (Math.cos(i * 29 + time) * 0.5 + 0.5) * height;
        ctx.fillRect(nx, ny, 2, 2);
      }

      if (track) {
        // Drone Center & Motor Hub positions scaled by zoom
        const s = zoomLevel * 14;

        // Drone carbon fuselage
        const fuseColor = palette === 'WHITE_HOT' ? '#8899aa' : palette === 'BLACK_HOT' ? '#556677' : '#5b1d7d';
        ctx.fillStyle = fuseColor;
        ctx.fillRect(cx - s * 0.35, cy - s * 0.25, s * 0.7, s * 0.5);

        // 4x Motor Arm beams
        ctx.strokeStyle = fuseColor;
        ctx.lineWidth = s * 0.12;
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.8, cy - s * 0.6);
        ctx.lineTo(cx + s * 0.8, cy + s * 0.6);
        ctx.moveTo(cx - s * 0.8, cy + s * 0.6);
        ctx.lineTo(cx + s * 0.8, cy - s * 0.6);
        ctx.stroke();

        // High Thermal Blooms at Motor Hubs (Electric coils ~72°C)
        const motorPositions = [
          [-s * 0.8, -s * 0.6],
          [s * 0.8, -s * 0.6],
          [-s * 0.8, s * 0.6],
          [s * 0.8, s * 0.6]
        ];

        motorPositions.forEach(([mx, my]) => {
          const motorX = cx + mx;
          const motorY = cy + my;
          const radius = (s * 0.35) + (Math.sin(time * 3) * 1.5);

          const grad = ctx.createRadialGradient(motorX, motorY, 0, motorX, motorY, radius);
          if (palette === 'WHITE_HOT') {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.5, '#dddddd');
            grad.addColorStop(1, 'transparent');
          } else if (palette === 'BLACK_HOT') {
            grad.addColorStop(0, '#000000');
            grad.addColorStop(0.5, '#333333');
            grad.addColorStop(1, 'transparent');
          } else {
            // Ironbow: White -> Yellow -> Red -> Purple
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#f5ee38');
            grad.addColorStop(0.7, '#ef4444');
            grad.addColorStop(1, 'transparent');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(motorX, motorY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Battery Core Thermal Signature (~46°C)
        const battRadius = s * 0.3;
        const battGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, battRadius);
        if (palette === 'IRONBOW') {
          battGrad.addColorStop(0, '#f5ee38');
          battGrad.addColorStop(0.7, '#d97706');
          battGrad.addColorStop(1, 'transparent');
        } else if (palette === 'WHITE_HOT') {
          battGrad.addColorStop(0, '#e2e8f0');
          battGrad.addColorStop(1, 'transparent');
        } else {
          battGrad.addColorStop(0, '#1e293b');
          battGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = battGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, battRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tactical Crosshair Reticle & Rangefinder Overlay
      ctx.strokeStyle = palette === 'BLACK_HOT' ? '#000000' : '#00e5a3';
      ctx.lineWidth = 1.2;

      // Center cross
      const cSize = 14;
      ctx.beginPath();
      ctx.moveTo(cx - cSize, cy);
      ctx.lineTo(cx + cSize, cy);
      ctx.moveTo(cx, cy - cSize);
      ctx.lineTo(cx, cy + cSize);
      ctx.stroke();

      // Bounding brackets
      const bSize = 36;
      ctx.strokeRect(cx - bSize, cy - bSize, bSize * 2, bSize * 2);

      // HUD readout text
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = palette === 'BLACK_HOT' ? '#000000' : '#00e5a3';
      ctx.fillText(`FLIR OPTIC: ${palette}`, 8, 16);
      ctx.fillText(`ZOOM: ${zoomLevel}X`, 8, 28);
      ctx.fillText(`RANGE: ${track ? Math.round(track.altitudeM * 2.8) : 450}m`, 8, 40);

      // Max Temperature Delta Readout
      ctx.fillStyle = '#f5ee38';
      ctx.fillText(`T_MAX: 73.4°C (MOTOR COILS)`, width - 150, 16);
      ctx.fillText(`T_AMB: 18.2°C (ΔT +55.2°C)`, width - 150, 28);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [track, palette, zoomLevel]);

  return (
    <div className={`bg-tactical-surface border border-tactical-border rounded-lg p-3 font-mono text-xs flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-tactical-border text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-tactical-amber" />
          THERMAL INFRARED (FLIR) OPTICAL SENSOR
        </span>

        {/* Palette Switcher */}
        <div className="flex items-center gap-1 bg-[#090e17] p-0.5 rounded border border-tactical-border text-[10px]">
          {(['IRONBOW', 'WHITE_HOT', 'BLACK_HOT'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPalette(p)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                palette === p ? 'bg-tactical-amber text-black' : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-40 bg-black border border-tactical-border rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="w-full h-full block"
        />

        {/* Digital Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-1 rounded border border-tactical-border text-[10px]">
          <button
            onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
            className="text-tactical-textMuted hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-tactical-accent">{zoomLevel}X</span>
          <button
            onClick={() => setZoomLevel(Math.min(4, zoomLevel + 1))}
            className="text-tactical-textMuted hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-tactical-textMuted pt-1">
        <span>Target: <strong className="text-white">{track?.callsign || 'TGT-001'}</strong></span>
        <span className="text-tactical-primary">Confirmed Thermal Signature: Quad-Rotor Electric Propulsion</span>
      </div>
    </div>
  );
};

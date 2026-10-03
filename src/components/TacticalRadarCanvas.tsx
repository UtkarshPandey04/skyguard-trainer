import React, { useRef, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { DroneTrack } from '../types/simulation';

interface TacticalRadarCanvasProps {
  interactive?: boolean;
  compact?: boolean;
  className?: string;
}

export const TacticalRadarCanvas: React.FC<TacticalRadarCanvasProps> = ({
  interactive = true,
  compact = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tracks, selectedTrackId, setSelectedTrackId, scenario, sensors } = useSimulation();

  const sweepAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Keep latest state in ref to avoid re-binding requestAnimationFrame loop
  const stateRef = useRef({ tracks, selectedTrackId, scenario, sensors, compact });
  useEffect(() => {
    stateRef.current = { tracks, selectedTrackId, scenario, sensors, compact };
  });

  // High-performance canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      sweepAngleRef.current = (sweepAngleRef.current + dt * 1.2) % (Math.PI * 2);
      const sweepAngle = sweepAngleRef.current;
      const { tracks, selectedTrackId, scenario, sensors, compact } = stateRef.current;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Coordinate conversion: simulator uses 0-1000 domain
    const toScreenX = (x: number) => (x / 1000) * width;
    const toScreenY = (y: number) => (y / 1000) * height;

    // Clear background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw subtle grid
    ctx.strokeStyle = 'rgba(31, 51, 77, 0.35)';
    ctx.lineWidth = 1;
    const gridSize = compact ? 40 : 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Environment Terrain Elements
    const centerX = width / 2;
    const centerY = height / 2;

    if (scenario.environment === 'Urban') {
      // High-rise building footprints
      ctx.fillStyle = 'rgba(18, 32, 51, 0.6)';
      ctx.strokeStyle = 'rgba(38, 70, 105, 0.4)';
      const blocks = [
        [width * 0.25, height * 0.2, 50, 60],
        [width * 0.35, height * 0.3, 70, 40],
        [width * 0.65, height * 0.25, 60, 80],
        [width * 0.2, height * 0.65, 80, 50],
        [width * 0.7, height * 0.6, 90, 70],
      ];
      blocks.forEach(([bx, by, bw, bh]) => {
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);
      });
    } else if (scenario.environment === 'Border-like terrain' || scenario.environment === 'Rural') {
      // Border demarcation line
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.85);
      ctx.bezierCurveTo(width * 0.4, height * 0.75, width * 0.6, height * 0.9, width * 0.95, height * 0.7);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Restricted Defense Zone (Perimeter around High Value Asset at center)
    const restrictedRadius = Math.min(width, height) * 0.22;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, restrictedRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Defense Asset Marker at center
    ctx.fillStyle = '#00e5a3';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00e5a3';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.fillText('RESTRICTED SECTOR A', centerX - 55, centerY - restrictedRadius - 6);

    // 4. Concentric Radar Range Rings
    const maxRadius = Math.min(width, height) * 0.46;
    const rings = [0.25, 0.5, 0.75, 1.0];
    const rangeLabels = ['5 KM', '10 KM', '20 KM', '30 KM'];

    ctx.lineWidth = 1;
    rings.forEach((ratio, idx) => {
      const r = maxRadius * ratio;
      ctx.strokeStyle = 'rgba(0, 229, 163, 0.18)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();

      if (!compact) {
        ctx.fillStyle = 'rgba(0, 229, 163, 0.45)';
        ctx.fillText(rangeLabels[idx], centerX + 6, centerY - r + 12);
      }
    });

    // Azimuth Crosshairs
    ctx.strokeStyle = 'rgba(0, 229, 163, 0.15)';
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.stroke();

    // 5. Radar Sweep Beam (if Radar active or degraded)
    if (sensors.Radar.status !== 'OFFLINE') {
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      const sweepAlpha = sensors.Radar.status === 'DEGRADED' ? 0.12 : 0.28;
      sweepGrad.addColorStop(0, `rgba(0, 229, 163, ${sweepAlpha})`);
      sweepGrad.addColorStop(1, 'rgba(0, 229, 163, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Lead line of sweep
      ctx.strokeStyle = sensors.Radar.status === 'DEGRADED' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(0, 229, 163, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * maxRadius,
        centerY + Math.sin(sweepAngle) * maxRadius
      );
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Swarm Inter-Node Mesh
    const swarmTracks = tracks.filter(t => t.swarmId);
    if (swarmTracks.length > 1) {
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 3]);
      for (let i = 0; i < swarmTracks.length; i++) {
        for (let j = i + 1; j < swarmTracks.length; j++) {
          const t1 = swarmTracks[i];
          const t2 = swarmTracks[j];
          const distSq = Math.hypot(t1.x - t2.x, t1.y - t2.y);
          if (distSq < 220) { // Connect nearby nodes
            ctx.beginPath();
            ctx.moveTo(toScreenX(t1.x), toScreenY(t1.y));
            ctx.lineTo(toScreenX(t2.x), toScreenY(t2.y));
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
    }

    // 7. Draw Drone Tracks
    tracks.forEach(track => {
      const sx = toScreenX(track.x);
      const sy = toScreenY(track.y);
      const isSelected = track.id === selectedTrackId;

      // Color based on threat level
      let color = '#00e5a3'; // LOW / DECOY
      if (track.threatLevel === 'HIGH') color = '#ef4444';
      else if (track.threatLevel === 'MEDIUM') color = '#f59e0b';
      else if (track.threatLevel === 'UNCERTAIN') color = '#00c3ff';

      // Trajectory breadcrumbs
      if (track.history && track.history.length > 1) {
        ctx.strokeStyle = `${color}44`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        track.history.forEach(([hx, hy], hidx) => {
          const px = toScreenX(hx);
          const py = toScreenY(hy);
          if (hidx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Velocity projection vector
      const vectorLen = 22;
      const vx = Math.cos(track.headingDeg * Math.PI / 180) * vectorLen;
      const vy = Math.sin(track.headingDeg * Math.PI / 180) * vectorLen;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + vx, sy + vy);
      ctx.stroke();

      // Drone icon marker (Tactical Diamond or Triangle)
      ctx.fillStyle = color;
      ctx.beginPath();
      if (track.groundTruth === 'Multi-object swarm') {
        // Hexagon / cluster
        ctx.arc(sx, sy, isSelected ? 6 : 4.5, 0, Math.PI * 2);
      } else {
        // Tactical diamond
        const s = isSelected ? 6 : 4;
        ctx.moveTo(sx, sy - s);
        ctx.lineTo(sx + s, sy);
        ctx.lineTo(sx, sy + s);
        ctx.lineTo(sx - s, sy);
        ctx.closePath();
      }
      ctx.fill();

      // Selection Ring
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(sx, sy, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tactical reticle corners
        const retSize = 18;
        ctx.strokeStyle = '#00e5a3';
        ctx.lineWidth = 2;
        // top-left
        ctx.beginPath();
        ctx.moveTo(sx - retSize, sy - retSize + 6);
        ctx.lineTo(sx - retSize, sy - retSize);
        ctx.lineTo(sx - retSize + 6, sy - retSize);
        ctx.stroke();
        // bottom-right
        ctx.beginPath();
        ctx.moveTo(sx + retSize, sy + retSize - 6);
        ctx.lineTo(sx + retSize, sy + retSize);
        ctx.lineTo(sx + retSize - 6, sy + retSize);
        ctx.stroke();
      }

      // Telemetry Label
      if (!compact) {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(track.callsign, sx + 10, sy - 8);

        ctx.fillStyle = 'rgba(197, 216, 234, 0.7)';
        ctx.fillText(`${track.speedMps}m/s · ${track.altitudeM}m`, sx + 10, sy + 4);

        if (track.isDecoy) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('[DECOY-SUSPECT]', sx + 10, sy + 16);
        }
      }
    });

    // 8. Weather Overlay (Fog, Rain particles)
    if (scenario.weather === 'Fog') {
      ctx.fillStyle = 'rgba(180, 200, 220, 0.08)';
      ctx.fillRect(0, 0, width, height);
    } else if (scenario.weather === 'Rain') {
      ctx.strokeStyle = 'rgba(120, 180, 240, 0.25)';
      ctx.lineWidth = 1;
      const rainCount = compact ? 20 : 50;
      for (let i = 0; i < rainCount; i++) {
        const rx = ((i * 47 + sweepAngle * 200) % width);
        const ry = ((i * 83 + sweepAngle * 350) % height);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 4, ry + 12);
        ctx.stroke();
      }
    }

    ctx.restore();
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Click to select track
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Find nearest track within 25px
    let closestTrack: DroneTrack | null = null;
    let minDistance = 28;

    tracks.forEach(t => {
      const sx = (t.x / 1000) * width;
      const sy = (t.y / 1000) * height;
      const dist = Math.hypot(clickX - sx, clickY - sy);
      if (dist < minDistance) {
        minDistance = dist;
        closestTrack = t;
      }
    });

    if (closestTrack) {
      setSelectedTrackId((closestTrack as DroneTrack).id);
    }
  };

  return (
    <div className={`relative w-full h-full bg-[#060a12] border border-tactical-border rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Tactical Canvas Header */}
      <div className="absolute top-2 left-3 z-10 flex items-center gap-3 bg-[#0d1522]/85 backdrop-blur px-3 py-1.5 rounded border border-tactical-border/60 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-tactical-primary">
          <span className="w-2 h-2 rounded-full bg-tactical-primary animate-pulse" />
          RADAR 360° SYNTHETIC
        </span>
        <span className="text-tactical-textMuted">|</span>
        <span className="text-tactical-textNormal">SECTOR: {scenario.environment.toUpperCase()}</span>
        <span className="text-tactical-textMuted">|</span>
        <span className="text-tactical-amber">TRACKS: {tracks.length}</span>
      </div>

      {/* Weather & Sensor Tag */}
      <div className="absolute top-2 right-3 z-10 flex items-center gap-2 bg-[#0d1522]/85 backdrop-blur px-3 py-1.5 rounded border border-tactical-border/60 text-xs font-mono">
        <span className="text-tactical-textMuted">COND:</span>
        <span className="text-tactical-accent font-semibold">{scenario.weather} / {scenario.timeOfDay}</span>
        {sensors.Radar.status === 'DEGRADED' && (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-tactical-amber text-[10px] font-bold border border-amber-500/40 animate-pulse">
            RADAR DEGRADED
          </span>
        )}
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Legend Footer */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-mono bg-[#0d1522]/85 backdrop-blur px-3 py-1 rounded border border-tactical-border/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-tactical-critical" />
            <span className="text-tactical-textMuted">High Threat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-tactical-amber" />
            <span className="text-tactical-textMuted">Medium / Decoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-tactical-accent" />
            <span className="text-tactical-textMuted">Uncertain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-tactical-primary" />
            <span className="text-tactical-textMuted">Friendly / Verified</span>
          </div>
        </div>
        <div className="text-tactical-textMuted hidden sm:block">
          Click any target to inspect AI confidence & sensor fusion
        </div>
      </div>
    </div>
  );
};

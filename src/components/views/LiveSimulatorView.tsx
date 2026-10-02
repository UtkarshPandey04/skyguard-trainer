import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TacticalRadarCanvas } from '../TacticalRadarCanvas';
import { Tactical3DAndVRViewport } from '../Tactical3DAndVRViewport';
import { FLIRThermalCamera } from '../FLIRThermalCamera';
import { RFSpectrumAnalyzer } from '../RFSpectrumAnalyzer';
import { AcousticSpectrogram } from '../AcousticSpectrogram';
import { 
  Eye, 
  Flame, 
  Radio, 
  Mic, 
  Activity, 
  ShieldAlert, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Zap,
  ChevronRight,
  Glasses,
  Compass,
  Layers
} from 'lucide-react';
import { SensorType, SensorStatus } from '../../types/simulation';

export const LiveSimulatorView: React.FC = () => {
  const { 
    tracks, 
    selectedTrackId, 
    setSelectedTrackId, 
    sensors, 
    setSensorStatus, 
    setActiveModule,
    scenario,
    scores,
    selectedTrack
  } = useSimulation();

  // Active Center Viewport Mode: 2D Radar | 3D/VR Airspace | Multi-Spectral Optics
  const [viewportMode, setViewportMode] = useState<'2D_RADAR' | '3D_VR' | 'MULTI_SPECTRAL'>('3D_VR');

  const timelineSteps = [
    { label: 'DETECT', status: 'COMPLETED', desc: 'Target acquired by Radar/EO' },
    { label: 'CLASSIFY', status: selectedTrack?.traineeClassification ? 'COMPLETED' : 'CURRENT', desc: 'AI kinematic signature analysis' },
    { label: 'ASSESS', status: selectedTrack?.status === 'ASSESSED' ? 'COMPLETED' : 'CURRENT', desc: 'Factor multi-sensor threat risk' },
    { label: 'DECIDE', status: selectedTrack?.traineeActionTaken ? 'COMPLETED' : 'PENDING', desc: 'Apply safe ROE protocol' },
    { label: 'RESPOND', status: selectedTrack?.traineeActionTaken ? 'COMPLETED' : 'PENDING', desc: 'Execute training countermeasure' },
    { label: 'REVIEW', status: 'PENDING', desc: 'After-Action Review scoring' },
  ];

  const sensorList: { key: SensorType; label: string; icon: React.ElementType }[] = [
    { key: 'EO', label: 'Electro-Optical (EO)', icon: Eye },
    { key: 'IR', label: 'Infra-Red Thermal (IR)', icon: Flame },
    { key: 'Radar', label: '360° Tactical Radar', icon: Radio },
    { key: 'Acoustic', label: 'Acoustic Array', icon: Mic },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-tactical-bg p-3 gap-3 font-mono">
      {/* Top Quick Status Strip & Viewport Switcher */}
      <div className="flex flex-wrap items-center justify-between bg-tactical-surface border border-tactical-border px-3 py-1.5 rounded-lg text-xs gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-tactical-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" />
            LIVE SIMULATOR ACTIVE
          </span>
          <span className="text-tactical-border hidden md:inline">|</span>
          <span className="text-tactical-textNormal hidden md:inline">{scenario.environment} ({scenario.weather})</span>
          <span className="text-tactical-border hidden md:inline">|</span>
          <span className="text-tactical-amber font-bold">{tracks.length} TARGETS</span>
        </div>

        {/* Viewport Mode Switcher (2D / 3D-VR / Multi-Spectral) */}
        <div className="flex items-center gap-1 bg-[#090e17] p-1 rounded-lg border border-tactical-border">
          <button
            onClick={() => setViewportMode('2D_RADAR')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              viewportMode === '2D_RADAR'
                ? 'bg-tactical-primary text-black shadow-glow-green'
                : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            2D RADAR
          </button>
          <button
            onClick={() => setViewportMode('3D_VR')}
            className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              viewportMode === '3D_VR'
                ? 'bg-tactical-primary text-black shadow-glow-green'
                : 'text-tactical-primary hover:text-white'
            }`}
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>3D / VR AIRSPACE</span>
          </button>
          <button
            onClick={() => setViewportMode('MULTI_SPECTRAL')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              viewportMode === 'MULTI_SPECTRAL'
                ? 'bg-tactical-accent text-black shadow-glow-teal'
                : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            FLIR & EW SPECTRA
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('DECISION ENGINE')}
            className="px-2.5 py-1 rounded bg-tactical-primary/20 hover:bg-tactical-primary/30 text-tactical-primary border border-tactical-primary/40 text-[11px] font-bold flex items-center gap-1 transition-all"
          >
            <span>DECISION PANEL</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport (Left Sensors, Center Radar/3D/VR, Right Threat Queue) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* LEFT: Sensor Panels (2.5 cols) */}
        <div className="lg:col-span-3 flex flex-col bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-tactical-card border-b border-tactical-border flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-tactical-primary" /> SENSOR ARRAYS
            </span>
            <span className="text-[10px] text-tactical-textMuted">4 CHANNELS</span>
          </div>

          <div className="flex-1 p-2 space-y-2 overflow-y-auto text-xs">
            {sensorList.map(({ key, label, icon: Icon }) => {
              const sensorData = sensors[key];
              const isDegraded = sensorData.status === 'DEGRADED';
              const isOffline = sensorData.status === 'OFFLINE';

              return (
                <div
                  key={key}
                  className={`p-2 rounded-lg border transition-all ${
                    isOffline 
                      ? 'border-red-500/40 bg-red-950/15' 
                      : isDegraded 
                        ? 'border-amber-500/40 bg-amber-950/15' 
                        : 'border-tactical-border bg-tactical-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
                      <Icon className={`w-3.5 h-3.5 ${isOffline ? 'text-red-400' : isDegraded ? 'text-tactical-amber' : 'text-tactical-primary'}`} />
                      <span>{label}</span>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isOffline ? 'bg-red-500/20 text-red-400' : isDegraded ? 'bg-amber-500/20 text-tactical-amber' : 'bg-emerald-500/20 text-tactical-primary'
                    }`}>
                      {sensorData.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-tactical-textMuted mb-1.5">
                    <div>
                      <span>Integrity: </span>
                      <span className="text-white font-semibold">{sensorData.healthPercent}%</span>
                    </div>
                    <div>
                      <span>Noise: </span>
                      <span className="text-tactical-amber font-semibold">{sensorData.noiseLevel}%</span>
                    </div>
                  </div>

                  {/* Manual fault injection buttons for instructors / testing */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-tactical-border/60">
                    {(['ACTIVE', 'DEGRADED', 'OFFLINE'] as SensorStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setSensorStatus(key, st)}
                        className={`py-0.5 rounded text-[9px] font-bold transition-all ${
                          sensorData.status === st
                            ? st === 'ACTIVE' ? 'bg-emerald-500/30 text-tactical-primary border border-emerald-500'
                              : st === 'DEGRADED' ? 'bg-amber-500/30 text-tactical-amber border border-amber-500'
                              : 'bg-red-500/30 text-red-400 border border-red-500'
                            : 'bg-slate-800 text-tactical-textMuted hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Quick Multi-Spectral Preview shortcut */}
            <div className="p-2 rounded bg-[#090e17] border border-tactical-border text-[10px] text-tactical-textMuted leading-relaxed">
              <span className="text-tactical-accent font-bold">Multi-Spectral Intel:</span>{' '}
              Toggle between 2D Top-Down, 3D Orbit/VR Dual-Eye, or FLIR/EW Spectrum views above.
            </div>
          </div>
        </div>

        {/* CENTER: Radar or 3D / VR Viewport (6.5 cols) */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-[360px] bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          {viewportMode === '2D_RADAR' && <TacticalRadarCanvas interactive={true} />}
          {viewportMode === '3D_VR' && <Tactical3DAndVRViewport />}
          {viewportMode === 'MULTI_SPECTRAL' && (
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
              <FLIRThermalCamera />
              <RFSpectrumAnalyzer />
              <AcousticSpectrogram />
            </div>
          )}
        </div>

        {/* RIGHT: Threat Queue (3 cols) */}
        <div className="lg:col-span-3 flex flex-col bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-tactical-card border-b border-tactical-border flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-tactical-amber" /> THREAT QUEUE
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-tactical-accent text-[10px]">
              {tracks.length} TARGETS
            </span>
          </div>

          <div className="flex-1 p-2 space-y-2 overflow-y-auto text-xs">
            {tracks.map((track) => {
              const isSelected = track.id === selectedTrackId;
              let threatBadgeColor = 'bg-emerald-500/20 text-tactical-primary border-emerald-500/30';
              if (track.threatLevel === 'HIGH') threatBadgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
              else if (track.threatLevel === 'MEDIUM') threatBadgeColor = 'bg-amber-500/20 text-tactical-amber border-amber-500/30';
              else if (track.threatLevel === 'UNCERTAIN') threatBadgeColor = 'bg-teal-500/20 text-tactical-accent border-teal-500/30';

              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-tactical-primary bg-tactical-card shadow-glow-green'
                      : 'border-tactical-border bg-[#090e17] hover:border-tactical-borderLight'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Target className="w-3 h-3 text-tactical-primary" />
                      <span>{track.callsign}</span>
                      {track.swarmId && (
                        <span className="px-1 rounded text-[8px] bg-red-500/20 text-red-400 border border-red-500/30">
                          SWARM
                        </span>
                      )}
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${threatBadgeColor}`}>
                      {track.threatLevel}
                    </span>
                  </div>

                  <div className="text-[11px] text-tactical-textNormal mb-1.5">
                    {track.groundTruth}
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-tactical-textMuted">
                    <div>
                      <span>Conf: </span>
                      <span className="text-white font-bold">{track.fusedConfidence}%</span>
                    </div>
                    <div>
                      <span>Alt: </span>
                      <span className="text-white font-bold">{track.altitudeM}m</span>
                    </div>
                    <div>
                      <span>Speed: </span>
                      <span className="text-white font-bold">{track.speedMps}m/s</span>
                    </div>
                    <div>
                      <span>Status: </span>
                      <span className="text-tactical-accent font-bold">{track.status}</span>
                    </div>
                  </div>

                  {track.isDecoy && (
                    <div className="mt-1.5 pt-1 border-t border-tactical-border/60 text-[9px] text-tactical-amber">
                      ⚠ Signature suggests decoy artifact
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick inspect button */}
          <div className="p-2 border-t border-tactical-border bg-tactical-card">
            <button
              onClick={() => setActiveModule('DECISION ENGINE')}
              className="w-full py-1.5 rounded bg-tactical-primary/20 hover:bg-tactical-primary/30 text-tactical-primary border border-tactical-primary/40 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>ENGAGE SELECTED TRACK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM: Training Timeline */}
      <div className="bg-tactical-surface border border-tactical-border rounded-lg p-2.5">
        <div className="text-[10px] text-tactical-textMuted uppercase font-bold mb-2 flex items-center justify-between">
          <span>TRAINING PIPELINE SEQUENCE</span>
          <span className="text-tactical-primary">STANDARDIZED OPERATIONAL DOCTRINE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {timelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isCurrent = step.status === 'CURRENT';

            return (
              <div
                key={step.label}
                className={`p-2 rounded border text-xs transition-all relative ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-white'
                    : isCurrent
                      ? 'border-tactical-primary bg-tactical-card shadow-glow-green text-white'
                      : 'border-tactical-border bg-[#090e17] text-tactical-textMuted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px] flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-tactical-primary">
                      {idx + 1}
                    </span>
                    {step.label}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-tactical-primary" />
                  ) : isCurrent ? (
                    <Activity className="w-3 h-3 text-tactical-primary animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="text-[9px] text-tactical-textMuted leading-tight truncate">
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

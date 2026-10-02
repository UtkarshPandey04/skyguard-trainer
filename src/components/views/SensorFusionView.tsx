import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Layers, 
  Eye, 
  Flame, 
  Radio, 
  Mic, 
  AlertTriangle, 
  Info, 
  Sliders, 
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const SensorFusionView: React.FC = () => {
  const { 
    tracks, 
    selectedTrackId, 
    setSelectedTrackId, 
    selectedTrack, 
    sensors, 
    setActiveModule 
  } = useSimulation();

  const track = selectedTrack || tracks[0];

  // Configurable sensor weights for fusion simulation
  const [weights, setWeights] = useState({
    eo: 25,
    ir: 30,
    radar: 35,
    acoustic: 10
  });

  if (!track) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-tactical-textMuted font-mono">
        No active aerial tracks in current simulation.
      </div>
    );
  }

  // Calculate dynamic fused confidence based on current weights
  const totalWeight = weights.eo + weights.ir + weights.radar + weights.acoustic || 1;
  const dynamicFusedConfidence = Math.round(
    ((track.sensors.eo * weights.eo) +
     (track.sensors.ir * weights.ir) +
     (track.sensors.radar * weights.radar) +
     (track.sensors.acoustic * weights.acoustic)) / totalWeight
  );

  const resetWeights = () => {
    setWeights({ eo: 25, ir: 30, radar: 35, acoustic: 10 });
  };

  const sensorReadingsList = [
    { key: 'eo' as const, label: 'Electro-Optical (EO)', icon: Eye, val: track.sensors.eo, weight: weights.eo, color: 'text-emerald-400', barColor: 'bg-emerald-500' },
    { key: 'ir' as const, label: 'Infra-Red Thermal (IR)', icon: Flame, val: track.sensors.ir, weight: weights.ir, color: 'text-amber-400', barColor: 'bg-amber-500' },
    { key: 'radar' as const, label: '360° Tactical Radar', icon: Radio, val: track.sensors.radar, weight: weights.radar, color: 'text-cyan-400', barColor: 'bg-cyan-500' },
    { key: 'acoustic' as const, label: 'Acoustic Array Matrix', icon: Mic, val: track.sensors.acoustic, weight: weights.acoustic, color: 'text-purple-400', barColor: 'bg-purple-500' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-tactical-accent" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              MULTI-SENSOR FUSION ENGINE
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-tactical-accent border border-teal-500/30">
              NOVEL FEATURE #2
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Combines multi-spectral observations (optical, thermal, radar, acoustic) to resolve single-sensor vulnerabilities and deception.
          </p>
        </div>

        {/* Track switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                t.id === track.id
                  ? 'bg-tactical-accent/20 border-tactical-accent text-white shadow-glow-teal'
                  : 'bg-tactical-card border-tactical-border text-tactical-textMuted hover:text-white'
              }`}
            >
              {t.callsign}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Sensor Readings & Interactive Weight Tuning (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-tactical-accent" />
                MULTI-SPECTRAL SENSOR INPUTS & CONFIDENCE
              </span>
              <button
                onClick={resetWeights}
                className="text-[10px] text-tactical-textMuted hover:text-white flex items-center gap-1"
                title="Reset Default Fusion Weights"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-4">
              {sensorReadingsList.map(({ key, label, icon: Icon, val, weight, color, barColor }) => (
                <div key={key} className="p-3 rounded bg-tactical-card border border-tactical-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span>{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-tactical-textMuted">Weight: {weight}%</span>
                      <span className="text-white font-mono font-bold text-xs bg-[#090e17] px-2 py-0.5 rounded border border-tactical-border">
                        {val}% CONF
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-[#090e17] h-2 rounded-full overflow-hidden border border-tactical-border/60">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>

                  {/* Weight Slider */}
                  <div className="flex items-center gap-2 text-[10px] text-tactical-textMuted pt-1">
                    <span>Fusion Weight:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weight}
                      onChange={(e) => setWeights(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="flex-1 accent-tactical-accent h-1 bg-slate-800 rounded"
                    />
                    <span className="w-8 text-right font-mono text-white font-bold">{weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fused Confidence & Disagreement Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Fused Confidence Big Card */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-tactical-textMuted font-bold uppercase tracking-wider mb-2">
                SYNTHESIZED FUSION RESULT
              </div>

              <div className="p-4 rounded-lg bg-[#090e17] border border-tactical-border text-center space-y-2">
                <div className="text-xs text-tactical-textMuted">COMPUTED FUSED CONFIDENCE</div>
                <div className="text-5xl font-extrabold text-tactical-accent font-mono glow-accent">
                  {dynamicFusedConfidence}%
                </div>
                <div className="text-xs text-tactical-textNormal">
                  Target Identity: <span className="font-bold text-white">{track.groundTruth}</span>
                </div>
              </div>

              {/* Sensor Disagreement Indicator */}
              <div className="mt-4 p-3 rounded-lg border bg-tactical-card space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">SENSOR DISAGREEMENT INDEX</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    track.sensorDisagreement === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    track.sensorDisagreement === 'MEDIUM' ? 'bg-amber-500/20 text-tactical-amber border border-amber-500/40' :
                    'bg-emerald-500/20 text-tactical-primary border border-emerald-500/40'
                  }`}>
                    {track.sensorDisagreement} DISAGREEMENT
                  </span>
                </div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  {track.disagreementExplanation}
                </p>
              </div>
            </div>

            {/* Why single sensor is dangerous */}
            <div className="mt-4 p-3 rounded bg-amber-950/20 border border-amber-500/40 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-tactical-amber font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>TRAINING DOCTRINE: SENSOR REDUNDANCY</span>
              </div>
              <p className="text-[10px] text-tactical-textNormal leading-relaxed">
                Relying exclusively on a single modality (e.g. radar alone) risks spoofing by passive corner reflectors, bird flocks, or electronic jamming. Fusion across non-correlated spectra ensures resilience against asymmetric deception.
              </p>
            </div>

            {/* Button to Decision Engine */}
            <div className="mt-4 pt-3 border-t border-tactical-border">
              <button
                onClick={() => setActiveModule('DECISION ENGINE')}
                className="w-full py-2.5 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center justify-center gap-2 transition-all"
              >
                <span>APPLY IN DECISION ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

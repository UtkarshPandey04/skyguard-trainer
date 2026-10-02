import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { DroneClassType } from '../../types/simulation';
import { 
  Crosshair, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  ShieldCheck, 
  Compass, 
  Gauge, 
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

const DRONE_CLASSES: DroneClassType[] = [
  'Small UAV',
  'Large UAV',
  'Multi-object swarm',
  'Unknown aerial object',
  'Non-threat object',
  'Decoy'
];

export const ThreatAnalysisView: React.FC = () => {
  const { 
    tracks, 
    selectedTrackId, 
    setSelectedTrackId, 
    selectedTrack, 
    classifyTrack,
    setActiveModule 
  } = useSimulation();

  const [expandedWhy, setExpandedWhy] = useState<boolean>(true);
  const track = selectedTrack || tracks[0];

  if (!track) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-tactical-textMuted font-mono">
        No active aerial tracks in current simulation. Launch scenario from Scenario Lab.
      </div>
    );
  }

  const isClassified = !!track.traineeClassification;
  const isCorrect = track.traineeClassification === track.groundTruth;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              AI THREAT CLASSIFICATION & EXPLAINABILITY
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
              NOVEL FEATURE #3 & #4
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Simulated neural inference signature matching with transparent explainability factors and trainee verification.
          </p>
        </div>

        {/* Track selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                t.id === track.id
                  ? 'bg-tactical-primary/20 border-tactical-primary text-white shadow-glow-green'
                  : 'bg-tactical-card border-tactical-border text-tactical-textMuted hover:text-white'
              }`}
            >
              {t.callsign}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Physical & Kinematic Signatures (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-tactical-accent" />
                OBJECT TELEMETRY SIGNATURE
              </span>
              <span className="text-xs text-tactical-primary font-bold">{track.callsign}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">SHAPE SIGNATURE</span>
                <span className="text-white font-semibold">{track.shapeSignature}</span>
              </div>

              <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">MOTION PATTERN</span>
                <span className="text-white font-semibold">{track.motionPattern}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">SPEED CATEGORY</span>
                  <span className="text-tactical-accent font-semibold">{track.speedCategory}</span>
                </div>
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">ALTITUDE BAND</span>
                  <span className="text-tactical-accent font-semibold">{track.altitudeCategory}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">TRAJECTORY VECTOR</span>
                <span className="text-tactical-amber font-semibold">{track.trajectoryPattern}</span>
              </div>
            </div>
          </div>

          {/* Trainee Verification Box */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-tactical-primary" />
                TRAINEE CONFIRMATION ACTION
              </span>
              <span className="text-[10px] text-tactical-textMuted">RECORDED IN AAR</span>
            </div>

            <p className="text-[11px] text-tactical-textMuted mb-3">
              Inspect the AI confidence distribution and select the verified classification profile:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DRONE_CLASSES.map((cls) => {
                const isSelected = track.traineeClassification === cls;
                return (
                  <button
                    key={cls}
                    onClick={() => classifyTrack(track.id, cls)}
                    className={`p-2 rounded text-left border text-xs transition-all ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-tactical-primary font-bold shadow-glow-green'
                          : 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                        : 'bg-[#090e17] border-tactical-border text-tactical-textNormal hover:border-tactical-borderLight'
                    }`}
                  >
                    <div className="font-bold">{cls}</div>
                    <div className="text-[9px] text-tactical-textMuted mt-0.5">
                      Model: {track.confidenceDistribution[cls]}%
                    </div>
                  </button>
                );
              })}
            </div>

            {isClassified && (
              <div className={`mt-3 p-2.5 rounded border text-xs flex items-start gap-2 ${
                isCorrect 
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-tactical-primary' 
                  : 'border-amber-500/40 bg-amber-950/20 text-tactical-amber'
              }`}>
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {isCorrect ? 'Accurate Trainee Confirmation (+5 PTS)' : 'Classification Divergence Detected (-6 PTS)'}
                  </div>
                  <div className="text-[10px] mt-0.5 leading-relaxed text-tactical-textNormal">
                    Ground truth profile: <span className="font-bold text-white">{track.groundTruth}</span>.
                    {isCorrect ? ' Telemetry aligns with synthetic radar cross-section.' : ' Inspect sensor disagreement in Sensor Fusion tab.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Confidence Distribution & Explainability (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Confidence Distribution */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-tactical-primary" />
                AI CLASSIFICATION CONFIDENCE DISTRIBUTION
              </span>
              <span className="text-xs text-tactical-accent font-bold">
                Overall: {track.classificationConfidence}%
              </span>
            </div>

            <div className="space-y-3">
              {DRONE_CLASSES.map((cls) => {
                const conf = track.confidenceDistribution[cls] || 5;
                const isGroundTruth = track.groundTruth === cls;

                return (
                  <div key={cls} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold flex items-center gap-1.5 ${isGroundTruth ? 'text-white' : 'text-tactical-textMuted'}`}>
                        {cls}
                        {isGroundTruth && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-tactical-primary">
                            AI HIGHEST
                          </span>
                        )}
                      </span>
                      <span className="text-white font-mono font-bold">{conf}%</span>
                    </div>

                    <div className="w-full bg-[#090e17] h-2 rounded-full overflow-hidden border border-tactical-border/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          conf > 60
                            ? 'bg-tactical-primary shadow-glow-green'
                            : conf > 30
                              ? 'bg-tactical-accent'
                              : 'bg-slate-700'
                        }`}
                        style={{ width: `${conf}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explainable Threat Assessment (Novel Feature #4) */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-tactical-amber" />
                  EXPLAINABLE THREAT ASSESSMENT ENGINE
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  track.threatLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  track.threatLevel === 'MEDIUM' ? 'bg-amber-500/20 text-tactical-amber border border-amber-500/40' :
                  'bg-emerald-500/20 text-tactical-primary border border-emerald-500/40'
                }`}>
                  THREAT: {track.threatLevel} ({track.threatScore}/100)
                </span>
              </div>

              <button
                onClick={() => setExpandedWhy(!expandedWhy)}
                className="text-xs text-tactical-accent hover:underline flex items-center gap-1"
              >
                <span>{expandedWhy ? 'Collapse Why?' : 'Explain Why?'}</span>
                {expandedWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {expandedWhy && (
              <div className="space-y-3 mt-3">
                <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border text-xs text-tactical-textNormal leading-relaxed">
                  <span className="text-tactical-accent font-bold">Explainability Synthesis:</span>{' '}
                  This threat score is calculated from transparent weighted anomaly factors rather than an opaque black box.
                </div>

                <div className="space-y-2">
                  {track.anomalyFactors.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-tactical-card border border-tactical-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white flex items-center gap-1.5">
                          <span className="text-tactical-primary">+</span> {f.factor}
                        </span>
                        <span className="text-tactical-amber font-mono">+{f.weight} PTS</span>
                      </div>
                      <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveModule('DECISION ENGINE')}
                    className="px-3.5 py-1.5 rounded bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark flex items-center gap-1.5 shadow-glow-green"
                  >
                    <span>PROCEED TO DECISION ENGINE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

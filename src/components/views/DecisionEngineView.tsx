import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TraineeDecisionChoice } from '../../types/simulation';
import { 
  GitFork, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  Award, 
  Target, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface DecisionOption {
  choice: TraineeDecisionChoice;
  title: string;
  description: string;
  category: 'observe' | 'confirm' | 'escalate' | 'resolve';
}

const DECISION_OPTIONS: DecisionOption[] = [
  {
    choice: 'CONTINUE_OBSERVATION',
    title: '1. Continue Active Observation',
    description: 'Sustain tracking without alert escalation. Monitor for kinematic course changes.',
    category: 'observe'
  },
  {
    choice: 'REQUEST_SENSOR_CONFIRMATION',
    title: '2. Request Additional Sensor Confirmation',
    description: 'Slew auxiliary EO/IR or acoustic telemetry to resolve high sensor disagreement.',
    category: 'confirm'
  },
  {
    choice: 'ESCALATE_SUPERVISOR',
    title: '3. Escalate for Supervisor Review',
    description: 'Forward track telemetry with anomaly indicators to Senior Watch Officer.',
    category: 'escalate'
  },
  {
    choice: 'MARK_NON_THREAT',
    title: '4. Mark as Non-Threat / Decoy',
    description: 'Classify as verified civilian, wildlife, or passive atmospheric false-positive.',
    category: 'resolve'
  },
  {
    choice: 'INITIATE_RESPONSE_PROTOCOL',
    title: '5. Initiate Simulated Response Protocol',
    description: 'Activate simulated sector alert and safe non-kinetic perimeter protocols.',
    category: 'escalate'
  },
  {
    choice: 'END_TRACKING',
    title: '6. Conclude & End Target Tracking',
    description: 'Archive track log and release radar beam allocations.',
    category: 'resolve'
  },
];

export const DecisionEngineView: React.FC = () => {
  const { 
    tracks, 
    selectedTrackId, 
    setSelectedTrackId, 
    selectedTrack, 
    makeDecision, 
    scores, 
    setActiveModule 
  } = useSimulation();

  const track = selectedTrack || tracks[0];
  const [lastAction, setLastAction] = useState<TraineeDecisionChoice | null>(null);

  if (!track) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-tactical-textMuted font-mono">
        No active targets available for decision training.
      </div>
    );
  }

  const handleSelectDecision = (choice: TraineeDecisionChoice) => {
    setLastAction(choice);
    makeDecision(track.id, choice);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-tactical-amber" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              INTERACTIVE DECISION ENGINE & TRANSPARENT SCORING
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-tactical-amber border border-amber-500/30">
              NOVEL FEATURE #6 & #7
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Apply predefined safe Rules of Engagement (ROE). Every decision is scored with transparent reasoning and zero kinetic weapon controls.
          </p>
        </div>

        {/* Track switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedTrackId(t.id); setLastAction(null); }}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                t.id === track.id
                  ? 'bg-tactical-amber/20 border-tactical-amber text-white shadow-glow-amber'
                  : 'bg-tactical-card border-tactical-border text-tactical-textMuted hover:text-white'
              }`}
            >
              {t.callsign}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Target Telemetry & Threat Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-tactical-primary" />
                ENGAGEMENT TARGET DOSSIER
              </span>
              <span className="text-tactical-primary font-bold text-xs">{track.callsign}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-tactical-textMuted">AI Classification:</span>
                <span className="text-white font-bold">{track.groundTruth}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-tactical-textMuted">Threat Level:</span>
                <span className={`font-bold ${
                  track.threatLevel === 'HIGH' ? 'text-red-400' :
                  track.threatLevel === 'MEDIUM' ? 'text-tactical-amber' :
                  'text-tactical-primary'
                }`}>
                  {track.threatLevel} ({track.threatScore}/100)
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-tactical-textMuted">Fused Confidence:</span>
                <span className="text-tactical-accent font-bold">{track.fusedConfidence}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-tactical-textMuted">Sensor Disagreement:</span>
                <span className={`font-bold ${track.sensorDisagreement === 'HIGH' ? 'text-red-400' : 'text-tactical-primary'}`}>
                  {track.sensorDisagreement}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-tactical-textMuted">Approach Vector:</span>
                <span className="text-tactical-amber font-bold">{track.isRestrictedZoneApproach ? 'PERIMETER THREAT' : 'PATROL CORRIDOR'}</span>
              </div>
            </div>

            {/* Current Target Status */}
            <div className="p-2.5 rounded bg-tactical-card border border-tactical-border text-xs flex items-center justify-between">
              <span className="text-tactical-textMuted">Target Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white">
                {track.status}
              </span>
            </div>
          </div>

          {/* Safety Notice Card */}
          <div className="p-3 rounded-lg bg-[#070b12] border border-tactical-border text-[11px] text-tactical-textMuted space-y-1">
            <div className="flex items-center gap-1.5 text-tactical-primary font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DEFENSE SIMULATION BOUNDARY</span>
            </div>
            <p className="leading-relaxed">
              Decisions teach personnel situational awareness, false alarm avoidance, and escalation timing. All choices are non-kinetic and software-simulated.
            </p>
          </div>
        </div>

        {/* Right: Predefined Safe Decision Options & Transparent Scoring (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Decision Grid */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
              <span>SELECT PREDEFINED TRAINING RESPONSE</span>
              <span className="text-[10px] text-tactical-textMuted">CLICK OPTION TO LOG & EVALUATE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DECISION_OPTIONS.map((opt) => {
                const isSelected = track.traineeActionTaken === opt.choice;

                return (
                  <button
                    key={opt.choice}
                    onClick={() => handleSelectDecision(opt.choice)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-tactical-primary/20 border-tactical-primary text-white shadow-glow-green'
                        : 'bg-tactical-card border-tactical-border text-tactical-textNormal hover:border-tactical-borderLight'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{opt.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-tactical-primary" />}
                    </div>
                    <div className="text-[11px] text-tactical-textMuted mt-1 leading-relaxed">
                      {opt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparent Scoring Log (Novel Feature #7) */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-tactical-primary" />
                <span className="text-xs font-bold text-white">
                  TRANSPARENT DECISION-TREE SCORING LOG
                </span>
              </div>
              <span className="text-xs font-bold text-tactical-primary">
                Current Score: {scores.overallScore}/100
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
              {scores.scoreBreakdownLog.map((logItem, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-tactical-card border border-tactical-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      <span className="text-tactical-accent">[{logItem.category}]</span>
                      <span>{logItem.reason}</span>
                    </div>
                  </div>
                  <div className={`font-mono font-bold text-xs shrink-0 pl-3 ${
                    logItem.delta > 0 ? 'text-tactical-primary' : 'text-red-400'
                  }`}>
                    {logItem.delta > 0 ? `+${logItem.delta}` : logItem.delta} PTS
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="pt-2 border-t border-tactical-border flex items-center justify-between text-xs">
              <span className="text-tactical-textMuted">
                Review complete operational timeline in After-Action Review:
              </span>
              <button
                onClick={() => setActiveModule('AFTER-ACTION REVIEW')}
                className="px-3 py-1.5 rounded bg-tactical-primary/20 hover:bg-tactical-primary/30 text-tactical-primary border border-tactical-primary/40 font-bold flex items-center gap-1.5 transition-all"
              >
                <span>OPEN AFTER-ACTION REVIEW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

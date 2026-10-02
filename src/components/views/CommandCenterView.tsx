import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TacticalRadarCanvas } from '../TacticalRadarCanvas';
import { 
  ShieldCheck, 
  Target, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Compass, 
  Radio, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const { 
    scenario, 
    tracks, 
    scores, 
    elapsedSec, 
    events, 
    trainee, 
    setActiveModule,
    sensors,
    startSimulation,
    isRunning
  } = useSimulation();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-tactical-bg p-4 gap-4">
      {/* Top Banner: Active Training Session & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Session Info Card */}
        <div className="bg-tactical-card border border-tactical-border rounded-lg p-3 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-tactical-primary/5 rounded-full blur-xl" />
          <div className="text-[10px] font-mono text-tactical-textMuted uppercase flex items-center justify-between">
            <span>ACTIVE TRAINING SESSION</span>
            <span className="text-tactical-primary font-bold">ONLINE</span>
          </div>
          <div className="text-base font-bold text-white font-mono mt-1 truncate">
            {scenario.name}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono text-tactical-textNormal">
            <div>
              <span className="text-tactical-textMuted block text-[10px]">ENVIRONMENT</span>
              <span className="font-semibold text-tactical-accent">{scenario.environment}</span>
            </div>
            <div>
              <span className="text-tactical-textMuted block text-[10px]">DIFFICULTY</span>
              <span className={`font-semibold ${scenario.difficulty === 'Expert' ? 'text-tactical-critical' : scenario.difficulty === 'Advanced' ? 'text-tactical-amber' : 'text-tactical-primary'}`}>
                {scenario.difficulty}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-tactical-border/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-tactical-textMuted">SEED: {scenario.seed}</span>
            <span className="text-tactical-amber font-bold">{tracks.length} TARGETS</span>
          </div>
        </div>

        {/* Live Metrics: Accuracy & Speed */}
        <div className="bg-tactical-card border border-tactical-border rounded-lg p-3">
          <div className="text-[10px] font-mono text-tactical-textMuted uppercase flex items-center justify-between">
            <span>DETECTION & CLASSIFICATION</span>
            <Target className="w-3.5 h-3.5 text-tactical-primary" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{scores.detectionTime}%</span>
            <span className="text-xs text-tactical-primary flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
            </span>
          </div>
          <div className="mt-2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-[11px]">
              <span className="text-tactical-textMuted">Class. Accuracy</span>
              <span className="text-tactical-textNormal font-bold">{scores.classificationAccuracy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-tactical-primary h-full rounded-full" style={{ width: `${scores.classificationAccuracy}%` }} />
            </div>
            <div className="flex justify-between text-[11px] pt-0.5">
              <span className="text-tactical-textMuted">Avg Detect Time</span>
              <span className="text-tactical-accent font-bold">{trainee.avgReactionTimeSec}s</span>
            </div>
          </div>
        </div>

        {/* Decision & Response Score */}
        <div className="bg-tactical-card border border-tactical-border rounded-lg p-3">
          <div className="text-[10px] font-mono text-tactical-textMuted uppercase flex items-center justify-between">
            <span>DECISION & ROE ACCURACY</span>
            <ShieldCheck className="w-3.5 h-3.5 text-tactical-accent" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{scores.decisionQuality}%</span>
            <span className="text-xs text-tactical-accent font-mono">Target: 80%</span>
          </div>
          <div className="mt-2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-[11px]">
              <span className="text-tactical-textMuted">False Alarm Rate</span>
              <span className="text-emerald-400 font-bold">{trainee.falsePositiveRate}% (Low)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-tactical-accent h-full rounded-full" style={{ width: `${scores.decisionQuality}%` }} />
            </div>
            <div className="flex justify-between text-[11px] pt-0.5">
              <span className="text-tactical-textMuted">Response Score</span>
              <span className="text-tactical-amber font-bold">{scores.responseTiming}/100</span>
            </div>
          </div>
        </div>

        {/* Overall Readiness & Quick Action */}
        <div className="bg-tactical-card border border-tactical-border rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-tactical-textMuted uppercase flex items-center justify-between">
              <span>OVERALL READINESS SCORE</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-tactical-primary text-[9px] font-bold">
                QUALIFIED
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold font-mono text-tactical-primary glow-primary">
                {scores.overallScore}
              </span>
              <span className="text-xs font-mono text-tactical-textMuted">/ 100 PTS</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                className="w-full py-2 rounded bg-tactical-primary text-black font-mono font-bold text-xs hover:bg-tactical-primaryDark transition-all flex items-center justify-center gap-1.5 shadow-glow-green"
              >
                <span>RESUME SIMULATOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveModule('LIVE SIMULATOR')}
                className="w-full py-2 rounded bg-[#1f334d] hover:bg-[#2c486d] text-white font-mono font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>OPEN HUD VIEW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Center Area: Radar Canvas (70%) + Live Event Stream (30%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Tactical Map Display */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[360px] bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-tactical-card border-b border-tactical-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-tactical-primary animate-pulse" />
              <span className="font-bold text-white">CENTRAL TACTICAL AIRSPACE DISPLAY</span>
              <span className="text-tactical-textMuted text-[11px] hidden sm:inline">
                (Real-time Kinematics & Flocking Vectors)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-tactical-textMuted">Sensors:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${sensors.Radar.status === 'ACTIVE' ? 'bg-emerald-500/20 text-tactical-primary' : 'bg-amber-500/20 text-tactical-amber'}`}>
                RADAR: {sensors.Radar.status}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-tactical-accent">
                EO/IR: {sensors.EO.status}
              </span>
            </div>
          </div>

          <div className="flex-1 relative p-1">
            <TacticalRadarCanvas interactive={true} />
          </div>
        </div>

        {/* Right Panel: Live Event Stream */}
        <div className="lg:col-span-4 flex flex-col h-full bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-tactical-card border-b border-tactical-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white font-bold">
              <Activity className="w-4 h-4 text-tactical-accent animate-pulse" />
              <span>LIVE EVENT STREAM</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-tactical-textMuted text-[10px]">
              {events.length} LOGS
            </span>
          </div>

          <div className="flex-1 p-2 overflow-y-auto space-y-2 text-xs font-mono">
            {events.map((evt) => {
              let borderClass = 'border-slate-800 bg-[#0a101a]';
              let badgeColor = 'text-tactical-textMuted bg-slate-800';
              if (evt.level === 'critical') {
                borderClass = 'border-red-500/40 bg-red-950/20';
                badgeColor = 'text-red-400 bg-red-500/20';
              } else if (evt.level === 'warning') {
                borderClass = 'border-amber-500/40 bg-amber-950/20';
                badgeColor = 'text-tactical-amber bg-amber-500/20';
              } else if (evt.level === 'success') {
                borderClass = 'border-emerald-500/40 bg-emerald-950/20';
                badgeColor = 'text-tactical-primary bg-emerald-500/20';
              }

              return (
                <div
                  key={evt.id}
                  className={`p-2.5 rounded border ${borderClass} transition-all hover:border-tactical-borderLight`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-tactical-accent font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {evt.timeString}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${badgeColor}`}>
                      {evt.category}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs leading-snug">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-tactical-textMuted mt-1 leading-relaxed">
                    {evt.details}
                  </div>

                  {evt.decisionEval && (
                    <div className="mt-2 pt-1.5 border-t border-tactical-border/40 text-[10px] flex items-center justify-between">
                      <span className="text-tactical-textMuted">Trainee Rationale:</span>
                      <span className={`font-bold ${evt.decisionEval.quality === 'OPTIMAL' ? 'text-tactical-primary' : 'text-red-400'}`}>
                        {evt.decisionEval.quality} ({evt.decisionEval.scoreDelta > 0 ? `+${evt.decisionEval.scoreDelta}` : evt.decisionEval.scoreDelta} PTS)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-tactical-border bg-tactical-card flex items-center justify-between text-[11px] font-mono">
            <span className="text-tactical-textMuted">Stream Status: ACTIVE</span>
            <button
              onClick={() => setActiveModule('AFTER-ACTION REVIEW')}
              className="text-tactical-accent hover:underline flex items-center gap-1"
            >
              <span>View Full AAR</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

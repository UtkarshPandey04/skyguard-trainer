import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldAlert, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Crosshair,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    scenario, 
    isRunning, 
    elapsedSec, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation, 
    completeScenario,
    scores,
    trainee,
    soundEnabled,
    toggleSound,
    isDemoActive,
    demoStep,
    startDemo,
    stopDemo
  } = useSimulation();

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 bg-[#090e17] border-b border-tactical-border px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Defense Affiliation */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#00e5a3]/10 border border-[#00e5a3]/40 flex items-center justify-center text-tactical-primary shadow-glow-green">
          <Crosshair className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-white text-lg font-mono">
              SKYGUARD
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-tactical-primary/15 text-tactical-primary border border-tactical-primary/30">
              v2.6 DSSC
            </span>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
              MoD • Problem Statement 26247
            </span>
          </div>
          <div className="text-[11px] text-tactical-textMuted flex items-center gap-2">
            <span>AI Drone & Counter-Drone Threat Simulation Trainer</span>
            <span className="text-tactical-border">•</span>
            <span className="text-tactical-textNormal font-mono">Team Six_Seven (ID: 175920)</span>
          </div>
        </div>
      </div>

      {/* Center Tactical Simulation Controls & Status */}
      <div className="hidden md:flex items-center gap-4 bg-[#0d1522] border border-tactical-border px-3 py-1.5 rounded-lg font-mono text-xs">
        {/* Active Scenario Pill */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" />
          <span className="text-tactical-textMuted">SCENARIO:</span>
          <span className="text-white font-semibold truncate max-w-[140px]">{scenario.seed}</span>
        </div>

        <div className="h-4 w-px bg-tactical-border" />

        {/* Timer */}
        <div className="flex items-center gap-1.5 text-tactical-accent">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-bold">{formatElapsed(elapsedSec)}</span>
          <span className="text-tactical-textMuted">/ {scenario.estimatedDurationSec}s</span>
        </div>

        <div className="h-4 w-px bg-tactical-border" />

        {/* Readiness Score */}
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-tactical-primary" />
          <span className="text-tactical-textMuted">SCORE:</span>
          <span className="font-bold text-tactical-primary">{scores.overallScore}/100</span>
        </div>

        <div className="h-4 w-px bg-tactical-border" />

        {/* Sim Controls */}
        <div className="flex items-center gap-1">
          {!isRunning ? (
            <button
              onClick={startSimulation}
              className="px-2.5 py-1 rounded bg-tactical-primary/20 hover:bg-tactical-primary/30 text-tactical-primary border border-tactical-primary/40 font-semibold flex items-center gap-1 transition-all"
              title="Start Simulation Clock"
            >
              <Play className="w-3 h-3 fill-current" /> Run
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-tactical-amber border border-amber-500/40 font-semibold flex items-center gap-1 transition-all"
              title="Pause Simulation"
            >
              <Square className="w-3 h-3 fill-current" /> Pause
            </button>
          )}

          <button
            onClick={resetSimulation}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-tactical-textMuted hover:text-white transition-all text-[11px]"
            title="Reset Simulation State"
          >
            Reset
          </button>

          <button
            onClick={completeScenario}
            className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 text-[11px] font-semibold"
            title="End and View AAR"
          >
            End / AAR
          </button>
        </div>
      </div>

      {/* Right Actions: Demo Mode, Sound, Callsign */}
      <div className="flex items-center gap-2.5">
        {/* Judge Demo Walkthrough Button */}
        {isDemoActive ? (
          <button
            onClick={stopDemo}
            className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 text-xs font-mono font-bold flex items-center gap-2 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            DEMO STEP {demoStep}/10 [STOP]
          </button>
        ) : (
          <button
            onClick={startDemo}
            className="px-3.5 py-1.5 rounded-lg bg-tactical-primary/20 hover:bg-tactical-primary/30 text-tactical-primary border border-tactical-primary text-xs font-mono font-bold flex items-center gap-2 shadow-glow-green hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4 text-tactical-primary animate-spin" />
            <span>START DEMO (60s)</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-[#0d1522] border border-tactical-border text-tactical-textMuted hover:text-tactical-primary hover:border-tactical-primary/40 transition-colors"
          title={soundEnabled ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-tactical-primary" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Callsign Profile */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-tactical-border text-xs font-mono">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-tactical-primary font-bold">
            07
          </div>
          <div>
            <div className="text-white font-bold leading-tight">{trainee.callsign}</div>
            <div className="text-[10px] text-tactical-textMuted leading-tight">LVL {trainee.currentLevel} • {trainee.rank}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

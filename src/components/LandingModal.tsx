import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Crosshair, 
  ShieldAlert, 
  Sparkles, 
  Play, 
  Award, 
  Activity, 
  CheckCircle2, 
  Database,
  Layers,
  Cpu,
  X
} from 'lucide-react';

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandingModal: React.FC<LandingModalProps> = ({ isOpen, onClose }) => {
  const { startDemo, setActiveModule, startSimulation } = useSimulation();

  if (!isOpen) return null;

  const handleEnterTraining = () => {
    setActiveModule('COMMAND CENTER');
    onClose();
  };

  const handleInstructorMode = () => {
    setActiveModule('PERFORMANCE ANALYTICS');
    onClose();
  };

  const handleLaunchDemo = () => {
    onClose();
    startDemo();
  };

  const noveltyList = [
    'Procedural Scenario Generation',
    'Multi-Sensor Fusion (EO/IR/Radar/Acoustic)',
    'Explainable Threat Assessment (XAI)',
    'Swarm Behaviour & Flocking Visualization',
    'Deception & Decoy Training',
    'Decision-Tree Transparent Scoring',
    'Adaptive Difficulty Engine',
    'After-Action Replay Timeline',
    'Trainee Readiness Digital Twin',
    'Scenario × Skill Heatmap',
    'Synthetic Sensor Degradation',
    'Reproducible Deterministic Seeds',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-4xl bg-tactical-surface border border-tactical-primary rounded-xl overflow-hidden shadow-glow-green flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d1522] to-[#121d2f] border-b border-tactical-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-tactical-primary/10 border border-tactical-primary/40 flex items-center justify-center text-tactical-primary shadow-glow-green">
              <Crosshair className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white tracking-wider">
                  SKYGUARD
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tactical-primary/20 text-tactical-primary border border-tactical-primary/40">
                  DSSC DEFENSE SIMULATOR
                </span>
              </div>
              <div className="text-xs text-tactical-accent font-semibold mt-0.5">
                AI-ENABLED DRONE & COUNTER-DRONE THREAT SIMULATION TRAINER
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-tactical-textMuted hover:text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Subtitle & Mission */}
          <div className="text-center space-y-1.5 py-1">
            <div className="text-base text-white font-bold tracking-wide">
              "Train for the Threat Before the Threat Becomes Real."
            </div>
            <div className="text-tactical-textMuted text-[11px] max-w-2xl mx-auto leading-relaxed">
              Developed for the <span className="text-white font-semibold">Defence Services Staff College (DSSC)</span>, Ministry of Defence (MoD) • Problem Statement 26247 • Team Six_Seven (ID: 175920)
            </div>
          </div>

          {/* System Status Indicators (Requirement #27) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded bg-tactical-card border border-tactical-border text-center">
              <span className="text-[10px] text-tactical-textMuted block">SIMULATION ENGINE</span>
              <span className="text-tactical-primary font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" /> ONLINE
              </span>
            </div>
            <div className="p-2.5 rounded bg-tactical-card border border-tactical-border text-center">
              <span className="text-[10px] text-tactical-textMuted block">AI MODULE</span>
              <span className="text-tactical-primary font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" /> READY
              </span>
            </div>
            <div className="p-2.5 rounded bg-tactical-card border border-tactical-border text-center">
              <span className="text-[10px] text-tactical-textMuted block">SENSOR ENGINE</span>
              <span className="text-tactical-primary font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" /> READY
              </span>
            </div>
            <div className="p-2.5 rounded bg-tactical-card border border-tactical-border text-center">
              <span className="text-[10px] text-tactical-textMuted block">ANALYTICS & AAR</span>
              <span className="text-tactical-primary font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-tactical-primary animate-ping-slow" /> ONLINE
              </span>
            </div>
          </div>

          {/* Novelty Highlights Summary (Requirement #29) */}
          <div className="bg-[#090e17] border border-tactical-border rounded-lg p-4 space-y-2">
            <span className="text-[10px] text-tactical-primary font-bold tracking-wider uppercase block">
              PLATFORM INNOVATION & NOVELTY MATRIX
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {noveltyList.map((nov, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-tactical-textNormal">
                  <span className="text-tactical-primary">★</span>
                  <span>{nov}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Non-kinetic Guarantee Notice */}
          <div className="p-3 rounded-lg bg-tactical-card border border-amber-500/40 text-tactical-textNormal text-[11px] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-tactical-amber shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-tactical-amber">DEFENSE SIMULATOR BOUNDARY: </span>
              This software platform is exclusively designed for cognitive training, classification drills, situational awareness, and ROE evaluation. It contains zero live-fire, weapon targeting, or kinetic engagement controls.
            </div>
          </div>
        </div>

        {/* Primary Action Buttons (Requirement #27) */}
        <div className="p-5 bg-tactical-surface border-t border-tactical-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>START GUIDED DEMO (60s)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleInstructorMode}
              className="w-full sm:w-auto px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-tactical-border flex items-center justify-center gap-1.5 transition-all"
            >
              <span>INSTRUCTOR / ANALYTICS MODE</span>
            </button>

            <button
              onClick={handleEnterTraining}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#1f334d] hover:bg-[#2c486d] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ENTER TRAINING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

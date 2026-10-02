import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SimulationEvent } from '../../types/simulation';
import { 
  FileCheck2, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Share2, 
  Sparkles,
  ArrowRight,
  Target,
  ShieldCheck
} from 'lucide-react';

export const AfterActionReviewView: React.FC = () => {
  const { 
    scenario, 
    scores, 
    events, 
    elapsedSec, 
    aarSelectedEvent, 
    setAarSelectedEvent, 
    setActiveModule,
    resetSimulation,
    startSimulation
  } = useSimulation();

  const selectedEv = aarSelectedEvent || events[0] || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              AFTER-ACTION REVIEW (AAR) & COGNITIVE REPLAY
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              NOVEL FEATURE #10
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Systematic mission debrief, granular replay timeline, and comparative expected vs actual decision evaluation.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetSimulation(); startSimulation(); }}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-tactical-border flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-tactical-primary" />
            <span>REPLAY SCENARIO</span>
          </button>
          <button
            onClick={() => setActiveModule('ADAPTIVE TRAINING')}
            className="px-4 py-2 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center gap-1.5 transition-all"
          >
            <span>NEXT ADAPTIVE DRILL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Banner: Mission Summary & Key Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Mission Card */}
        <div className="p-3 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">MISSION SUMMARY</span>
          <div className="text-sm font-bold text-white mt-1 truncate">{scenario.name}</div>
          <div className="text-[11px] text-tactical-accent mt-0.5">
            {scenario.environment} • {scenario.weather}
          </div>
          <div className="text-[10px] text-tactical-textMuted mt-1">
            Duration: <span className="text-white font-bold">{elapsedSec || scenario.estimatedDurationSec}s</span>
          </div>
        </div>

        {/* Detection Accuracy */}
        <div className="p-3 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">DETECTION ACCURACY</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{scores.detectionTime}%</div>
          <div className="text-[10px] text-tactical-primary mt-1 font-semibold">Standard: ≥ 85% (Passed)</div>
        </div>

        {/* Classification Accuracy */}
        <div className="p-3 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">CLASSIFICATION ACCURACY</span>
          <div className="text-2xl font-bold font-mono text-tactical-accent mt-1">{scores.classificationAccuracy}%</div>
          <div className="text-[10px] text-tactical-textMuted mt-1">6-Class AI Model Sync</div>
        </div>

        {/* Decision Accuracy */}
        <div className="p-3 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">DECISION ROE SCORE</span>
          <div className="text-2xl font-bold font-mono text-tactical-primary mt-1">{scores.decisionQuality}%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Zero Kinetic Breaches</div>
        </div>

        {/* Overall Mission Score */}
        <div className="p-3 rounded-lg bg-tactical-card border border-tactical-primary shadow-glow-green">
          <span className="text-[10px] text-tactical-textMuted uppercase block">OVERALL READINESS</span>
          <div className="text-3xl font-extrabold font-mono text-tactical-primary mt-1">
            {scores.overallScore}<span className="text-xs text-white">/100</span>
          </div>
          <div className="text-[10px] text-tactical-primary font-bold mt-1">QUALIFIED TO OPERATE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[380px]">
        {/* Left: Interactive Replay Timeline (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-tactical-surface border border-tactical-border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-tactical-card border-b border-tactical-border flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-tactical-accent" />
              CHRONOLOGICAL REPLAY TIMELINE
            </span>
            <span className="text-[10px] text-tactical-textMuted">CLICK EVENT TO INSPECT</span>
          </div>

          <div className="flex-1 p-2 space-y-2 overflow-y-auto text-xs">
            {events.map((evt) => {
              const isSelected = selectedEv?.id === evt.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => setAarSelectedEvent(evt)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-tactical-primary bg-tactical-card shadow-glow-green'
                      : 'border-tactical-border bg-[#090e17] hover:border-tactical-borderLight'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-tactical-accent font-bold">{evt.timeString}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-tactical-textNormal text-[9px]">
                      {evt.category}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs leading-snug">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-tactical-textMuted mt-0.5 line-clamp-1">
                    {evt.details}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Deep-Inspection Box (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-tactical-surface border border-tactical-border rounded-lg p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs font-bold text-tactical-primary flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                COGNITIVE DEBRIEF FOR SELECTED EVENT
              </span>
              <span className="text-xs text-white font-bold">{selectedEv?.timeString || '09:41:25'}</span>
            </div>

            {/* 1. What Happened */}
            <div className="p-3 rounded bg-tactical-card border border-tactical-border space-y-1 text-xs">
              <span className="text-[10px] text-tactical-accent font-bold uppercase block">
                1. WHAT HAPPENED AT THIS INSTANT
              </span>
              <p className="text-white font-semibold leading-relaxed">
                {selectedEv?.title}
              </p>
              <p className="text-tactical-textMuted text-[11px] leading-relaxed">
                {selectedEv?.details}
              </p>
            </div>

            {/* 2. What you decided vs What the simulator expected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#090e17] border border-tactical-border space-y-1">
                <span className="text-[10px] text-tactical-textMuted font-bold uppercase block">
                  2. WHAT YOU DECIDED
                </span>
                <span className="text-white font-bold block">
                  {selectedEv?.decisionEval ? selectedEv.decisionEval.action.replace(/_/g, ' ') : 'Passive Sensor Monitoring'}
                </span>
                <span className="text-[11px] text-tactical-textMuted">
                  Response latency: {selectedEv?.decisionEval?.timeTakenSec || '2.8'}s
                </span>
              </div>

              <div className="p-3 rounded bg-[#090e17] border border-tactical-border space-y-1">
                <span className="text-[10px] text-tactical-primary font-bold uppercase block">
                  3. WHAT SIMULATOR EXPECTED
                </span>
                <span className="text-tactical-primary font-bold block">
                  {selectedEv?.decisionEval?.expectedAction ? selectedEv.decisionEval.expectedAction.replace(/_/g, ' ') : 'Continuous Track Correlation'}
                </span>
                <span className="text-[11px] text-emerald-400">
                  Compliant with DSSC ROE 2026
                </span>
              </div>
            </div>

            {/* 3. Why & How to Improve */}
            <div className="p-3 rounded bg-tactical-card border border-tactical-border space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-tactical-amber font-bold uppercase block">
                  4. WHY (DOCTRINAL RATIONALE)
                </span>
                <p className="text-tactical-textNormal text-[11px] leading-relaxed mt-0.5">
                  {selectedEv?.decisionEval?.rationale || 'Target was maneuvering towards the restricted airspace boundary. Maintaining sensor fusion confidence verification prevented both target evasion and false response protocol activation.'}
                </p>
              </div>

              <div className="pt-2 border-t border-tactical-border/60">
                <span className="text-[10px] text-tactical-primary font-bold uppercase block">
                  5. HOW TO IMPROVE IN NEXT SCENARIO
                </span>
                <p className="text-tactical-textMuted text-[11px] leading-relaxed mt-0.5">
                  When acoustic confidence drops below 50% due to range or wind noise, rely primarily on thermal infrared imaging to confirm rotor count rather than delaying decision past the 15-second perimeter window.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-tactical-border flex items-center justify-between text-xs">
            <span className="text-tactical-textMuted">
              Review cumulative training trends in Performance Analytics:
            </span>
            <button
              onClick={() => setActiveModule('PERFORMANCE ANALYTICS')}
              className="px-3 py-1.5 rounded bg-[#1f334d] hover:bg-[#2c486d] text-white font-bold flex items-center gap-1.5"
            >
              <span>OPEN READINESS PROFILE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

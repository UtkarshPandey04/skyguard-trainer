import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Award, 
  AlertTriangle, 
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoActive, demoStep, stopDemo } = useSimulation();

  if (!isDemoActive) return null;

  const stepDescriptions: Record<number, { title: string; desc: string }> = {
    1: { title: 'STEP 1: PROCEDURAL SCENARIO GENERATED', desc: 'Randomized reproducible seed [SG-DEMO-2026] initialized with Fog, Night, and Urban sector.' },
    2: { title: 'STEP 2: DRONE AIRSPACE ENTRY', desc: 'Hostile drone vector intersects peripheral perimeter at 28 m/s.' },
    3: { title: 'STEP 3: MULTI-SENSOR ACQUISITION', desc: 'Radar & EO camera acquire object; kinematic trajectory prediction begins.' },
    4: { title: 'STEP 4: AI THREAT CLASSIFICATION', desc: 'Convolutional neural feature model outputs probability distribution across 6 drone classes.' },
    5: { title: 'STEP 5: SENSOR DEGRADATION INJECTED', desc: 'Radar RF jamming detected! Multi-sensor fusion engine seamlessly shifts weights to EO/IR thermal.' },
    6: { title: 'STEP 6: SWARM FLOCKING FORMATION', desc: 'Target bifurcates into 8-node micro-swarm executing coordinated evasive dispersion.' },
    7: { title: 'STEP 7: TRAINEE ROE DECISION PROMPT', desc: 'Personnel evaluate threat risk and select safe operational response.' },
    8: { title: 'STEP 8: TRANSPARENT DECISION SCORING', desc: 'Decision-tree scoring engine evaluates timing, ambiguity mitigation, and ROE compliance.' },
    9: { title: 'STEP 9: AFTER-ACTION REVIEW GENERATED', desc: 'Automated cognitive debrief details expected vs actual decisions and doctrinal improvement steps.' },
    10: { title: 'STEP 10: ADAPTIVE DIFFICULTY SYNTHESIS', desc: 'Reinforcement loop adjusts subsequent scenario parameters to target observed trainee friction.' },
  };

  const currentInfo = stepDescriptions[demoStep] || {
    title: 'GUIDED JUDGE DEMONSTRATION',
    desc: 'Simulating full 60-second end-to-end defense training cycle.'
  };

  const isFinal = demoStep >= 10;

  return (
    <div className="bg-gradient-to-r from-emerald-950/80 via-[#0d1522] to-teal-950/80 border-b border-tactical-primary px-4 py-2.5 font-mono text-xs z-40 flex items-center justify-between select-none shadow-glow-green">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-tactical-primary/20 border border-tactical-primary flex items-center justify-center text-tactical-primary animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-tactical-primary font-extrabold tracking-wider">
              {currentInfo.title}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-white font-bold">
              {demoStep}/10
            </span>
          </div>
          <div className="text-[11px] text-tactical-textNormal mt-0.5">
            {currentInfo.desc}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isFinal ? (
          <div className="px-3 py-1 rounded bg-tactical-primary/20 border border-tactical-primary text-tactical-primary font-bold text-xs animate-bounce">
            TRAIN → ASSESS → LEARN → ADAPT → TRAIN AGAIN
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1 text-[11px] text-tactical-textMuted">
            <span>Auto-advancing demo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tactical-primary animate-ping" />
          </div>
        )}

        <button
          onClick={stopDemo}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-tactical-textMuted hover:text-white"
          title="Exit Guided Demo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

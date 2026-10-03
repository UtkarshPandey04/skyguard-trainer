import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  BrainCircuit, 
  AlertCircle,
  Play,
  Loader2
} from 'lucide-react';

export const AdaptiveTrainingView: React.FC = () => {
  const { 
    trainee, 
    adaptiveRecommendation, 
    generateNewScenario, 
    setActiveModule, 
    startSimulation,
    scores 
  } = useSimulation();

  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  const handleLaunchAdaptiveScenario = () => {
    if (isLaunching) return;
    setIsLaunching(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        generateNewScenario(adaptiveRecommendation.nextScenarioSeed, {
          difficulty: adaptiveRecommendation.targetLevel >= 4 ? 'Expert' : adaptiveRecommendation.targetLevel === 3 ? 'Advanced' : 'Intermediate',
          sensorCondition: adaptiveRecommendation.targetLevel >= 4 ? 'Intermittent sensor' : 'Normal',
          threatType: adaptiveRecommendation.targetLevel >= 4 ? 'Swarm' : 'Multiple drones',
        });
        startSimulation();
        React.startTransition(() => {
          setActiveModule('LIVE SIMULATOR');
          setIsLaunching(false);
        });
      }, 20);
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              ADAPTIVE DIFFICULTY TRAINING ENGINE
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-tactical-primary border border-emerald-500/30">
              NOVEL FEATURE #8
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Dynamic reinforcement engine that tailors subsequent threat simulations based on individual cognitive friction and ROE accuracy.
          </p>
        </div>

        {/* Current Level Pill */}
        <div className="flex items-center gap-2 bg-tactical-card px-3 py-1.5 rounded-lg border border-tactical-border text-xs">
          <span className="text-tactical-textMuted">CURRENT PROFICIENCY:</span>
          <span className="text-tactical-primary font-bold text-sm">LEVEL {trainee.currentLevel} / 5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Adaptive Diagnostic Engine Status (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-5 space-y-4">
            <div className="text-xs font-bold text-white pb-2 border-b border-tactical-border flex items-center justify-between">
              <span>ADAPTIVE ENGINE STATUS & TELEMETRY</span>
              <span className="text-tactical-primary font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> REINFORCED LOOP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">PERFORMANCE TREND</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {adaptiveRecommendation.trend === 'Improving' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-tactical-primary" />
                      <span className="text-tactical-primary font-bold text-sm">↑ IMPROVING</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-tactical-amber" />
                      <span className="text-tactical-amber font-bold text-sm">↓ NEEDS REVIEW</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">NEXT SCENARIO DIFFICULTY</span>
                <span className="text-tactical-accent font-bold text-sm mt-1 block">
                  Difficulty {adaptiveRecommendation.targetLevel > trainee.currentLevel ? '+1' : 'Calibrated'}
                </span>
              </div>
            </div>

            {/* Reason explanation card */}
            <div className="p-3 rounded bg-tactical-card border border-tactical-border space-y-1">
              <span className="text-[10px] text-tactical-textMuted font-bold uppercase block">
                ADAPTATION REASONING
              </span>
              <p className="text-xs text-white leading-relaxed">
                "{adaptiveRecommendation.reason}"
              </p>
            </div>

            {/* Adaptive Rules Logic Matrix */}
            <div className="p-3 rounded bg-[#090e17] border border-tactical-border space-y-2 text-xs">
              <span className="text-[10px] text-tactical-accent font-bold uppercase block">
                AUTOMATED CALIBRATION RULES MATRIX
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-tactical-card border border-emerald-500/20 text-emerald-300">
                  <span className="font-bold">IF Performance &gt; 80%:</span>
                  <div className="text-tactical-textMuted text-[10px] mt-0.5">
                    • Increase drone velocities by +20% • Inject 2x passive decoy reflectors • Apply intermittent radar blackout
                  </div>
                </div>

                <div className="p-2 rounded bg-tactical-card border border-amber-500/20 text-amber-300">
                  <span className="font-bold">IF Decision Accuracy &lt; 65%:</span>
                  <div className="text-tactical-textMuted text-[10px] mt-0.5">
                    • Provide auxiliary sensor cross-hints • Increase EO optical contrast • Slow target angular evasion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Personalized Next Scenario Recommendation (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-tactical-surface border border-tactical-border rounded-lg p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs text-tactical-primary font-bold tracking-wider">
                PERSONALIZED NEXT TRAINING CURRICULUM
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-white">
                SEED: {adaptiveRecommendation.nextScenarioSeed}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                Operation: Night Fog Swarm & Decoy Stress Test
              </h2>
              <p className="text-xs text-tactical-textMuted mt-1 leading-relaxed">
                Synthesized by the adaptive engine to specifically target your observed friction point:{' '}
                <span className="text-tactical-amber font-bold">{trainee.weakestArea}</span>.
              </p>
            </div>

            {/* Recommended parameters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">TARGET WEAKNESS</span>
                <span className="text-tactical-amber font-bold">{trainee.weakestArea}</span>
              </div>
              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">CAPITALIZED STRENGTH</span>
                <span className="text-tactical-primary font-bold">{trainee.strongestArea}</span>
              </div>
              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">ADAPTED DIFFICULTY</span>
                <span className="text-red-400 font-bold">Level {adaptiveRecommendation.targetLevel} (Expert)</span>
              </div>
              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">SENSOR STRESS</span>
                <span className="text-tactical-accent font-bold">Intermittent RF Clutter</span>
              </div>
            </div>

            <div className="p-3 rounded bg-tactical-card border border-tactical-border text-xs text-tactical-textNormal leading-relaxed">
              <span className="text-tactical-primary font-bold">Training Pedagogy:</span>{' '}
              By continuously operating at the edge of trainee proficiency, SKYGUARD accelerates threat reaction instinct without risk of live asset damage or habituation to repetitive patterns.
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-tactical-border">
            <button
              onClick={handleLaunchAdaptiveScenario}
              disabled={isLaunching}
              className={`w-full py-3 rounded-lg font-extrabold text-xs shadow-glow-green flex items-center justify-center gap-2 transition-all ${
                isLaunching
                  ? 'bg-tactical-primary/75 text-black cursor-wait'
                  : 'bg-tactical-primary text-black hover:bg-tactical-primaryDark cursor-pointer'
              }`}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>LAUNCHING ADAPTED SCENARIO NOW...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>LAUNCH ADAPTED SCENARIO NOW</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

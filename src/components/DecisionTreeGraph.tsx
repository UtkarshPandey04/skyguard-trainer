import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { GitFork, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DecisionTreeGraphProps {
  className?: string;
}

export const DecisionTreeGraph: React.FC<DecisionTreeGraphProps> = ({ className = '' }) => {
  const { selectedTrack, scores } = useSimulation();

  const isClassified = !!selectedTrack?.traineeClassification;
  const isDecisionMade = !!selectedTrack?.traineeActionTaken;

  return (
    <div className={`bg-tactical-surface border border-tactical-border rounded-lg p-4 font-mono text-xs flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-tactical-border text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-tactical-amber" />
          DECISION-TREE DOCTRINAL BRANCHING GRAPH
        </span>
        <span className="text-[10px] text-tactical-primary font-bold">
          DSSC ROE 2026 STANDARD
        </span>
      </div>

      {/* Visual Branching Nodes */}
      <div className="relative py-2 flex flex-col items-center space-y-3">
        {/* Node 1: Detection Latency Check */}
        <div className="w-full max-w-md p-2.5 rounded-lg bg-tactical-card border border-tactical-primary flex items-center justify-between shadow-glow-green">
          <div>
            <span className="text-[9px] text-tactical-textMuted block font-bold">NODE 1: DETECTION SPEED</span>
            <span className="text-white font-bold text-xs">Target Acquired within 3.4s</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-tactical-primary border border-emerald-500/30">
            OPTIMAL (+15 PTS)
          </span>
        </div>

        <div className="w-0.5 h-3 bg-tactical-primary" />

        {/* Node 2: Sensor Agreement Check */}
        <div className="w-full max-w-md p-2.5 rounded-lg bg-tactical-card border border-tactical-accent flex items-center justify-between">
          <div>
            <span className="text-[9px] text-tactical-textMuted block font-bold">NODE 2: SENSOR FUSION CORRELATION</span>
            <span className="text-white font-bold text-xs">
              {selectedTrack?.sensorDisagreement || 'LOW'} Disparity Across EO/Radar/IR
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-tactical-accent border border-teal-500/30">
            CONFIDENCE: {selectedTrack?.fusedConfidence || 88}%
          </span>
        </div>

        <div className="w-0.5 h-3 bg-tactical-accent" />

        {/* Node 3: AI Classification Verification */}
        <div className={`w-full max-w-md p-2.5 rounded-lg bg-tactical-card border flex items-center justify-between ${
          isClassified ? 'border-tactical-primary' : 'border-tactical-border'
        }`}>
          <div>
            <span className="text-[9px] text-tactical-textMuted block font-bold">NODE 3: CLASSIFICATION VERIFICATION</span>
            <span className="text-white font-bold text-xs">
              {selectedTrack?.traineeClassification ? `Confirmed: ${selectedTrack.traineeClassification}` : 'Pending Trainee Action'}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isClassified ? 'bg-emerald-500/20 text-tactical-primary' : 'bg-slate-800 text-tactical-textMuted'
          }`}>
            {isClassified ? 'VERIFIED (+5 PTS)' : 'PENDING'}
          </span>
        </div>

        <div className="w-0.5 h-3 bg-tactical-border" />

        {/* Node 4: ROE Safe Decision Execution */}
        <div className={`w-full max-w-md p-2.5 rounded-lg bg-tactical-card border flex items-center justify-between ${
          isDecisionMade ? 'border-tactical-amber shadow-glow-amber' : 'border-tactical-border'
        }`}>
          <div>
            <span className="text-[9px] text-tactical-textMuted block font-bold">NODE 4: ROE SAFE ACTION</span>
            <span className="text-white font-bold text-xs">
              {selectedTrack?.traineeActionTaken ? selectedTrack.traineeActionTaken.replace(/_/g, ' ') : 'Awaiting ROE Decision'}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isDecisionMade ? 'bg-amber-500/20 text-tactical-amber border border-amber-500/40' : 'bg-slate-800 text-tactical-textMuted'
          }`}>
            {isDecisionMade ? 'RECORDED' : 'PENDING'}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-tactical-textMuted pt-1 border-t border-tactical-border flex items-center justify-between">
        <span>Transparent scoring guarantees every decision point is mathematically traceable.</span>
        <span className="text-tactical-primary font-bold">Cumulative: {scores.overallScore}/100</span>
      </div>
    </div>
  );
};

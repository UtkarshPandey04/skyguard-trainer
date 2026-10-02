import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  BarChart3, 
  User, 
  Award, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Target, 
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

export const PerformanceAnalyticsView: React.FC = () => {
  const { trainee, heatmapData, scores, setActiveModule } = useSimulation();
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

  const readinessSkills = [
    { label: 'Detection Speed & Sensitivity', val: 91, color: 'bg-emerald-500' },
    { label: 'AI Classification Verification', val: 84, color: 'bg-teal-500' },
    { label: 'Threat Risk Assessment', val: 90, color: 'bg-emerald-500' },
    { label: 'ROE Decision Execution', val: 82, color: 'bg-amber-500' },
    { label: 'Multi-Sensor Fusion Balancing', val: 94, color: 'bg-cyan-500' },
    { label: 'Swarm Kinematics Tracking', val: 76, color: 'bg-red-400' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              TRAINEE DIGITAL TWIN & PERFORMANCE ANALYTICS
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              NOVEL FEATURE #11 & #12
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Persistent cognitive model tracking reaction latency, false-alarm tendencies, and situational competency across environmental domains.
          </p>
        </div>

        {/* Trainee Profile Tag */}
        <div className="flex items-center gap-2.5 bg-tactical-card px-3 py-1.5 rounded-lg border border-tactical-border text-xs">
          <User className="w-4 h-4 text-tactical-primary" />
          <div>
            <span className="text-white font-bold">{trainee.callsign}</span>
            <span className="text-tactical-textMuted text-[10px] ml-1.5">({trainee.department})</span>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">SIMULATED SESSIONS</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{trainee.sessionsCompleted}</div>
          <div className="text-[10px] text-tactical-primary mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% Doctrinal Compliance
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">AVERAGE SCORE</span>
          <div className="text-2xl font-bold font-mono text-tactical-primary mt-1">{trainee.averageScore}/100</div>
          <div className="text-[10px] text-tactical-textMuted mt-1">Level {trainee.currentLevel} Tier Benchmark</div>
        </div>

        <div className="p-3.5 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">DECISION REACTION TIME</span>
          <div className="text-2xl font-bold font-mono text-tactical-accent mt-1">{trainee.avgReactionTimeSec}s</div>
          <div className="text-[10px] text-emerald-400 mt-1">42% Faster than standard</div>
        </div>

        <div className="p-3.5 rounded-lg bg-tactical-surface border border-tactical-border">
          <span className="text-[10px] text-tactical-textMuted uppercase block">FALSE ALARM RATE</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{trainee.falsePositiveRate}%</div>
          <div className="text-[10px] text-tactical-primary mt-1 font-bold">Minimal Decoy Escalation</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Trainee Digital Twin Readiness Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-tactical-primary" />
                TRAINEE READINESS PROFILE BARS
              </span>
              <span className="text-xs text-tactical-primary font-bold">DSSC-QUALIFIED</span>
            </div>

            <div className="space-y-3 text-xs">
              {readinessSkills.map((sk) => (
                <div key={sk.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-tactical-textNormal font-medium">{sk.label}</span>
                    <span className="text-white font-bold">{sk.val}%</span>
                  </div>
                  <div className="w-full bg-[#090e17] h-2 rounded-full overflow-hidden border border-tactical-border/60">
                    <div
                      className={`h-full rounded-full ${sk.color}`}
                      style={{ width: `${sk.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cognitive Twin Assessment */}
            <div className="mt-4 pt-3 border-t border-tactical-border/60 space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-tactical-card border border-tactical-border">
                <span className="text-tactical-textMuted">Strongest Competency:</span>
                <span className="text-tactical-primary font-bold">{trainee.strongestArea}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-tactical-card border border-tactical-border">
                <span className="text-tactical-textMuted">Primary Vulnerability:</span>
                <span className="text-tactical-amber font-bold">{trainee.weakestArea}</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300">
                <span className="font-bold">Recommended Curriculum: </span>
                {trainee.recommendedNextTraining}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Training Heatmap (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-tactical-accent" />
                TRAINING HEATMAP MATRIX (SCENARIO × SKILL)
              </span>
              <span className="text-[10px] text-tactical-textMuted">HISTORICAL COGNITIVE PERFORMANCE</span>
            </div>

            {/* Heatmap Table */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-tactical-border text-tactical-textMuted text-[10px]">
                    <th className="p-2">SCENARIO TYPE</th>
                    <th className="p-2 text-center">DETECTION</th>
                    <th className="p-2 text-center">CLASSIFY</th>
                    <th className="p-2 text-center">DECISION</th>
                    <th className="p-2 text-center">FUSION</th>
                    <th className="p-2 text-center">OVERALL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tactical-border/60">
                  {heatmapData.map((row) => {
                    const getHeatBadge = (val: number) => {
                      if (val >= 85) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold';
                      if (val >= 70) return 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold';
                      return 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold';
                    };

                    return (
                      <tr key={row.scenarioType} className="hover:bg-tactical-card/40 transition-colors">
                        <td className="p-2 font-semibold text-white text-[11px]">{row.scenarioType}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getHeatBadge(row.detection)}`}>
                            {row.detection}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getHeatBadge(row.classification)}`}>
                            {row.classification}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getHeatBadge(row.decision)}`}>
                            {row.decision}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${getHeatBadge(row.sensorFusion)}`}>
                            {row.sensorFusion}
                          </span>
                        </td>
                        <td className="p-2 text-center font-bold text-white text-xs">
                          {row.overall}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-4 pt-3 border-t border-tactical-border flex items-center justify-between text-[10px] text-tactical-textMuted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500" />
                  Optimal (≥85)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 border border-amber-500" />
                  Acceptable (70-84)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500/40 border border-red-500" />
                  Target Friction (&lt;70)
                </span>
              </div>

              <button
                onClick={() => setActiveModule('ADAPTIVE TRAINING')}
                className="text-tactical-accent hover:underline flex items-center gap-1"
              >
                <span>Trigger Adaptive Remediation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

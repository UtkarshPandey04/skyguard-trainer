import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Share2, 
  Users, 
  Activity, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const SwarmIntelligenceView: React.FC = () => {
  const { tracks, scenario, setActiveModule } = useSimulation();

  const [formationState, setFormationState] = useState<'FORMATION' | 'DISPERSION' | 'REGROUPING'>('FORMATION');
  const swarmTracks = tracks.filter(t => t.swarmId) || tracks.slice(0, 8);
  const totalSwarmNodes = swarmTracks.length > 0 ? swarmTracks.length : 8;

  // Swarm metrics
  const detectedCount = totalSwarmNodes;
  const unidentifiedCount = scenario.decoyCount;
  const flockingCohesion = formationState === 'FORMATION' ? 94 : formationState === 'REGROUPING' ? 82 : 46;
  const trajectorySimilarity = formationState === 'FORMATION' ? 96 : formationState === 'REGROUPING' ? 79 : 38;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              SWARM INTELLIGENCE & FLOCKING DYNAMICS
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
              NOVEL FEATURE #5
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Analyze distributed autonomous swarm formations, inter-node topology, and centroid tracking for counter-swarm doctrine.
          </p>
        </div>

        {/* Formation State Switcher */}
        <div className="flex items-center gap-1.5 bg-tactical-card p-1 rounded-lg border border-tactical-border">
          {(['FORMATION', 'DISPERSION', 'REGROUPING'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormationState(fmt)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                formationState === fmt
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red'
                  : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Swarm Kinematics & Node Network Topology (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Swarm Interconnected Graph Display */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border mb-3 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                SWARM INTER-NODE TOPOLOGY MESH
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-tactical-accent font-bold">
                PATTERN: {formationState}
              </span>
            </div>

            {/* Tactical SVG Swarm Visualization */}
            <div className="relative w-full h-64 bg-[#060a12] border border-tactical-border rounded-lg overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Background grid */}
                <defs>
                  <pattern id="swarmGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(31,51,77,0.3)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="500" height="240" fill="url(#swarmGrid)" />

                {/* Swarm Nodes & Connections based on formation */}
                {formationState === 'FORMATION' && (
                  <g>
                    {/* Inter-node connection lines */}
                    <line x1="120" y1="110" x2="200" y2="60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="200" y1="60" x2="300" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="300" y1="70" x2="380" y2="120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="120" y1="110" x2="220" y2="140" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="220" y1="140" x2="310" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="310" y1="150" x2="380" y2="120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="200" y1="60" x2="220" y2="140" stroke="#00c3ff" strokeWidth="1.2" opacity="0.5" />
                    <line x1="300" y1="70" x2="310" y2="150" stroke="#00c3ff" strokeWidth="1.2" opacity="0.5" />
                    <line x1="220" y1="140" x2="260" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="310" y1="150" x2="260" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />

                    {/* Centroid Ring */}
                    <circle cx="250" cy="120" r="18" fill="none" stroke="#00e5a3" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
                    <circle cx="250" cy="120" r="3" fill="#00e5a3" />
                    <text x="255" y="115" fill="#00e5a3" fontSize="9" fontFamily="monospace">CENTROID</text>

                    {/* Nodes */}
                    {[
                      { x: 120, y: 110, id: 'S-01', role: 'Flanker' },
                      { x: 200, y: 60, id: 'S-02', role: 'Lead' },
                      { x: 300, y: 70, id: 'S-03', role: 'Follower' },
                      { x: 380, y: 120, id: 'S-04', role: 'Flanker' },
                      { x: 220, y: 140, id: 'S-05', role: 'Follower' },
                      { x: 310, y: 150, id: 'S-06', role: 'Follower' },
                      { x: 260, y: 200, id: 'S-07', role: 'Rear' },
                    ].map((n) => (
                      <g key={n.id}>
                        <circle cx={n.x} cy={n.y} r="8" fill="#121d2f" stroke="#ef4444" strokeWidth="2" />
                        <circle cx={n.x} cy={n.y} r="3" fill="#ef4444" />
                        <text x={n.x - 12} y={n.y - 12} fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                          {n.id}
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {formationState === 'DISPERSION' && (
                  <g>
                    {/* Dispersed nodes radiating outward */}
                    {[
                      { x: 60, y: 50, id: 'S-01', vx: -15, vy: -15 },
                      { x: 220, y: 35, id: 'S-02', vx: 0, vy: -20 },
                      { x: 440, y: 60, id: 'S-03', vx: 18, vy: -12 },
                      { x: 450, y: 190, id: 'S-04', vx: 16, vy: 16 },
                      { x: 260, y: 215, id: 'S-05', vx: 0, vy: 20 },
                      { x: 70, y: 185, id: 'S-06', vx: -16, vy: 14 },
                      { x: 250, y: 120, id: 'S-07', vx: 5, vy: -5 },
                    ].map((n) => (
                      <g key={n.id}>
                        <line x1={n.x} y1={n.y} x2={n.x + n.vx} y2={n.y + n.vy} stroke="#f59e0b" strokeWidth="2" />
                        <circle cx={n.x} cy={n.y} r="7" fill="#121d2f" stroke="#f59e0b" strokeWidth="2" />
                        <circle cx={n.x} cy={n.y} r="2.5" fill="#f59e0b" />
                        <text x={n.x - 12} y={n.y - 10} fill="#f59e0b" fontSize="9" fontFamily="monospace">
                          {n.id}
                        </text>
                      </g>
                    ))}
                    <text x="180" y="130" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      EVASIVE SCATTER IN PROGRESS
                    </text>
                  </g>
                )}

                {formationState === 'REGROUPING' && (
                  <g>
                    {/* Converging vectors toward new waypoint */}
                    <circle cx="280" cy="110" r="24" fill="none" stroke="#00c3ff" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="250" y="115" fill="#00c3ff" fontSize="10" fontFamily="monospace">NEW CENTROID</text>
                    {[
                      { x: 100, y: 70, id: 'S-01' },
                      { x: 180, y: 170, id: 'S-02' },
                      { x: 400, y: 70, id: 'S-03' },
                      { x: 380, y: 180, id: 'S-04' },
                    ].map((n) => (
                      <g key={n.id}>
                        <line x1={n.x} y1={n.y} x2="280" y2="110" stroke="#00c3ff" strokeWidth="1.2" strokeDasharray="3,3" />
                        <circle cx={n.x} cy={n.y} r="7" fill="#121d2f" stroke="#00c3ff" strokeWidth="2" />
                        <text x={n.x - 10} y={n.y - 10} fill="#00c3ff" fontSize="9" fontFamily="monospace">{n.id}</text>
                      </g>
                    ))}
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Node Breakdown Table */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 text-xs">
            <div className="font-bold text-white mb-2 flex items-center justify-between">
              <span>SWARM TELEMETRY NODES</span>
              <span className="text-tactical-textMuted text-[10px]">SYNCED KINEMATICS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded bg-tactical-card border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">TOTAL NODES</span>
                <span className="text-lg font-bold text-white">{totalSwarmNodes}</span>
              </div>
              <div className="p-2.5 rounded bg-tactical-card border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">DETECTED</span>
                <span className="text-lg font-bold text-tactical-primary">{detectedCount}</span>
              </div>
              <div className="p-2.5 rounded bg-tactical-card border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">DECOY/AMBIGUOUS</span>
                <span className="text-lg font-bold text-tactical-amber">{unidentifiedCount}</span>
              </div>
              <div className="p-2.5 rounded bg-tactical-card border border-tactical-border">
                <span className="text-[10px] text-tactical-textMuted block">COHESION INDEX</span>
                <span className="text-lg font-bold text-tactical-accent">{flockingCohesion}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Swarm Analysis & Flocking Dynamics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-3">
            <div className="font-bold text-white text-xs pb-2 border-b border-tactical-border flex items-center justify-between">
              <span>FLOCKING ALGORITHM ANALYSIS</span>
              <span className="text-tactical-accent text-[10px]">REYNOLDS MODEL B-OIDS</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <div className="flex justify-between mb-1">
                  <span className="text-tactical-textMuted">Trajectory Similarity</span>
                  <span className="text-white font-bold">{trajectorySimilarity}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${trajectorySimilarity}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <div className="flex justify-between mb-1">
                  <span className="text-tactical-textMuted">Separation Buffer Consistency</span>
                  <span className="text-white font-bold">14.2m ± 1.8m</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tactical-primary h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                <div className="flex justify-between mb-1">
                  <span className="text-tactical-textMuted">Heading Alignment (Degrees)</span>
                  <span className="text-white font-bold">312° (Coordinated)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tactical-accent h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            {/* Defense doctrine notice */}
            <div className="p-3 rounded bg-red-950/20 border border-red-500/40 text-xs text-tactical-textNormal space-y-1">
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>COUNTER-SWARM TRAINING FOCUS</span>
              </div>
              <p className="text-[10px] text-tactical-textMuted leading-relaxed">
                Modern swarm threats saturate single-beam radars. Trainees learn to identify swarm centroids and recognize formation shifts (pincer vs dispersal) to prioritize area-defense alerts.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModule('DECISION ENGINE')}
                className="w-full py-2.5 rounded bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center justify-center gap-2 transition-all"
              >
                <span>PROCEED TO ROE DECISION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

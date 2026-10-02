import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Radar, 
  Crosshair, 
  Layers, 
  GitFork, 
  Share2, 
  TrendingUp, 
  FileCheck2, 
  BarChart3, 
  BookOpen, 
  Cpu,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<{ onOpenSafetyModal?: () => void }> = ({ onOpenSafetyModal }) => {
  const { activeModule, setActiveModule, tracks, scenario } = useSimulation();

  const navItems: NavItem[] = [
    { id: 'COMMAND CENTER', name: 'COMMAND CENTER', icon: LayoutDashboard },
    { id: 'SCENARIO LAB', name: 'SCENARIO LAB', icon: FlaskConical, badge: 'PROCEDURAL', badgeColor: 'bg-emerald-500/15 text-tactical-primary border-emerald-500/30' },
    { id: 'LIVE SIMULATOR', name: 'LIVE SIMULATOR', icon: Radar, badge: `${tracks.length} OBJ`, badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { id: 'THREAT ANALYSIS', name: 'THREAT ANALYSIS', icon: Crosshair, badge: 'AI-X', badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { id: 'SENSOR FUSION', name: 'SENSOR FUSION', icon: Layers, badge: 'FUSED', badgeColor: 'bg-teal-500/15 text-tactical-accent border-teal-500/30' },
    { id: 'DECISION ENGINE', name: 'DECISION ENGINE', icon: GitFork, badge: 'ROE', badgeColor: 'bg-amber-500/15 text-tactical-amber border-amber-500/30' },
    { id: 'SWARM INTELLIGENCE', name: 'SWARM INTELLIGENCE', icon: Share2, badge: scenario.swarmActive ? 'ACTIVE' : undefined, badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse' },
    { id: 'ADAPTIVE TRAINING', name: 'ADAPTIVE TRAINING', icon: TrendingUp, badge: 'ADAPT', badgeColor: 'bg-emerald-500/15 text-tactical-primary border-emerald-500/30' },
    { id: 'AFTER-ACTION REVIEW', name: 'AFTER-ACTION REVIEW', icon: FileCheck2 },
    { id: 'PERFORMANCE ANALYTICS', name: 'PERFORMANCE ANALYTICS', icon: BarChart3, badge: 'TWIN', badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { id: 'SCENARIO LIBRARY', name: 'SCENARIO LIBRARY', icon: BookOpen, badge: '10 PRESETS', badgeColor: 'bg-slate-700 text-slate-300 border-slate-600' },
    { id: 'SYSTEM / DATA SOURCES', name: 'SYSTEM / DATA SOURCES', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-[#090e17] border-r border-tactical-border flex flex-col justify-between shrink-0 select-none">
      {/* Navigation List */}
      <div className="py-3 px-2 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-wider text-tactical-textMuted uppercase flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <span className="text-tactical-primary font-normal">12/12</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                isActive
                  ? 'bg-tactical-card border border-tactical-primary text-white shadow-glow-green'
                  : 'text-tactical-textNormal hover:bg-tactical-card/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-tactical-primary' : 'text-tactical-textMuted'}`} />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Safety & Defensive Boundary Notice - Clickable for Audit Modal */}
      <div 
        onClick={onOpenSafetyModal}
        className="p-3 border-t border-tactical-border bg-[#070b12]/80 font-mono text-[10px] cursor-pointer hover:bg-tactical-card/60 transition-all group"
        title="Click to view Cryptographic Security & Safety Interlocks"
      >
        <div className="flex items-center justify-between text-tactical-amber mb-1 font-semibold">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SAFETY BOUNDARY</span>
          </div>
          <span className="text-[9px] text-tactical-primary group-hover:underline">AUDIT &gt;</span>
        </div>
        <p className="text-tactical-textMuted leading-tight text-[9px]">
          Software simulation training platform only. Synthetic telemetry; zero live-weapon or kinetic engagement controls.
        </p>

        <div className="mt-2.5 pt-2 border-t border-tactical-border/60 flex items-center justify-between text-[9px] text-tactical-textMuted">
          <span className="flex items-center gap-1 text-tactical-primary">
            <ShieldCheck className="w-3 h-3" /> SECURE DSSC SIM
          </span>
          <span className="font-bold text-white">AIRSPACE-SIM 26247</span>
        </div>
      </div>
    </aside>
  );
};

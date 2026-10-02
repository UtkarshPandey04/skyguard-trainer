import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { PRESET_SCENARIOS, generateSeedString } from '../../utils/scenarioGenerator';
import { ScenarioDefinition } from '../../types/simulation';
import { 
  BookOpen, 
  Search, 
  Play, 
  Copy, 
  Eye, 
  Filter, 
  Sparkles, 
  Clock, 
  Radio, 
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';

export const ScenarioLibraryView: React.FC = () => {
  const { loadPresetScenario, generateNewScenario, setActiveModule, startSimulation } = useSimulation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [selectedInspectScenario, setSelectedInspectScenario] = useState<ScenarioDefinition | null>(null);

  // Filter presets
  const filteredPresets = PRESET_SCENARIOS.filter((sc) => {
    const matchesSearch = 
      sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.environment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.threatType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = difficultyFilter === 'ALL' || sc.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleLoadAndLaunch = (scId: string) => {
    loadPresetScenario(scId);
    setActiveModule('LIVE SIMULATOR');
    startSimulation();
  };

  const handleDuplicate = (sc: ScenarioDefinition) => {
    const newSeed = generateSeedString();
    generateNewScenario(newSeed, {
      ...sc,
      id: `DUP-${newSeed}`,
      name: `Fork: ${sc.name}`,
    });
    setActiveModule('SCENARIO LAB');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              STANDARDIZED SCENARIO LIBRARY
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              10 DEFENSE DRILLS
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Curated simulation scenarios developed for DSSC staff officer calibration across multi-spectral threat environments.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-tactical-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenarios..."
              className="bg-tactical-surface border border-tactical-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-primary w-48 md:w-60"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-tactical-surface border border-tactical-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-primary"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((sc) => {
          let diffColor = 'text-tactical-primary bg-emerald-500/15 border-emerald-500/30';
          if (sc.difficulty === 'Expert') diffColor = 'text-red-400 bg-red-500/15 border-red-500/30';
          else if (sc.difficulty === 'Advanced') diffColor = 'text-tactical-amber bg-amber-500/15 border-amber-500/30';

          return (
            <div
              key={sc.id}
              className="bg-tactical-surface border border-tactical-border rounded-lg p-4 flex flex-col justify-between hover:border-tactical-borderLight transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${diffColor}`}>
                    {sc.difficulty}
                  </span>
                  <span className="text-[10px] text-tactical-textMuted font-mono">
                    {sc.seed}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {sc.name}
                  </h3>
                  <p className="text-[11px] text-tactical-textMuted mt-1 leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-tactical-textNormal pt-1">
                  <div className="p-1.5 rounded bg-[#090e17] border border-tactical-border/60">
                    <span className="text-tactical-textMuted block">ENV / WEATHER</span>
                    <span className="text-white font-semibold truncate block">{sc.environment} ({sc.weather})</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#090e17] border border-tactical-border/60">
                    <span className="text-tactical-textMuted block">THREAT TYPE</span>
                    <span className="text-tactical-accent font-semibold truncate block">{sc.threatType}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#090e17] border border-tactical-border/60">
                    <span className="text-tactical-textMuted block">SENSOR INTEGRITY</span>
                    <span className="text-tactical-amber font-semibold truncate block">{sc.sensorCondition}</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#090e17] border border-tactical-border/60">
                    <span className="text-tactical-textMuted block">EST. DURATION</span>
                    <span className="text-white font-semibold">{sc.estimatedDurationSec}s</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {sc.skillsTested.slice(0, 2).map((sk) => (
                    <span key={sk} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-tactical-textMuted">
                      {sk}
                    </span>
                  ))}
                  {sc.skillsTested.length > 2 && (
                    <span className="px-1 py-0.2 rounded text-[9px] text-tactical-primary">
                      +{sc.skillsTested.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: VIEW, LOAD, DUPLICATE */}
              <div className="mt-4 pt-3 border-t border-tactical-border flex items-center justify-between gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedInspectScenario(sc)}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-tactical-textNormal font-bold text-[11px] flex items-center gap-1 transition-all"
                  title="View Scenario Details"
                >
                  <Eye className="w-3.5 h-3.5 text-tactical-accent" /> VIEW
                </button>

                <button
                  onClick={() => handleDuplicate(sc)}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-tactical-textNormal font-bold text-[11px] flex items-center gap-1 transition-all"
                  title="Duplicate to Procedural Lab"
                >
                  <Copy className="w-3.5 h-3.5 text-tactical-amber" /> FORK
                </button>

                <button
                  onClick={() => handleLoadAndLaunch(sc.id)}
                  className="px-3 py-1.5 rounded bg-tactical-primary text-black font-extrabold text-[11px] hover:bg-tactical-primaryDark shadow-glow-green flex items-center gap-1 transition-all"
                  title="Load and Launch into Simulator"
                >
                  <Play className="w-3 h-3 fill-current" /> LOAD
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Scenario Modal */}
      {selectedInspectScenario && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-tactical-surface border border-tactical-primary rounded-lg p-5 space-y-4 shadow-glow-green font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs text-tactical-primary font-bold">
                SCENARIO DOSSIER: {selectedInspectScenario.seed}
              </span>
              <button
                onClick={() => setSelectedInspectScenario(null)}
                className="text-tactical-textMuted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-white">{selectedInspectScenario.name}</h2>
              <p className="text-xs text-tactical-textMuted mt-1 leading-relaxed">
                {selectedInspectScenario.description}
              </p>
            </div>

            <div className="p-3 rounded bg-tactical-card border border-tactical-border space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-tactical-textMuted font-bold block">OPERATIONAL OBJECTIVE</span>
                <p className="text-white mt-0.5">{selectedInspectScenario.objective}</p>
              </div>
              <div className="pt-2 border-t border-tactical-border/60">
                <span className="text-[10px] text-tactical-amber font-bold block">RULES OF ENGAGEMENT</span>
                <p className="text-tactical-textNormal text-[11px] mt-0.5">{selectedInspectScenario.rulesOfEngagement}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-tactical-border">
              <button
                onClick={() => setSelectedInspectScenario(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-tactical-textNormal text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedInspectScenario.id;
                  setSelectedInspectScenario(null);
                  handleLoadAndLaunch(id);
                }}
                className="px-4 py-1.5 rounded bg-tactical-primary text-black font-extrabold text-xs shadow-glow-green"
              >
                Launch Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

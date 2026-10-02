import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  EnvironmentType, 
  TimeOfDay, 
  WeatherType, 
  ThreatCategory, 
  SensorConditionType, 
  DifficultyLevel 
} from '../../types/simulation';
import { generateSeedString } from '../../utils/scenarioGenerator';
import { 
  FlaskConical, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  Wind, 
  Sun, 
  CloudRain, 
  Radio,
  Target,
  FileCode,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const ENVIRONMENTS: EnvironmentType[] = ['Urban', 'Rural', 'Industrial', 'Border-like terrain', 'Open terrain'];
const TIMES: TimeOfDay[] = ['Day', 'Night', 'Dawn', 'Low visibility'];
const WEATHERS: WeatherType[] = ['Clear', 'Fog', 'Rain', 'Dust/haze', 'Wind disturbance'];
const THREAT_TYPES: ThreatCategory[] = ['Single drone', 'Multiple drones', 'Swarm', 'Unknown aerial object'];
const SENSOR_CONDITIONS: SensorConditionType[] = ['Normal', 'Reduced visibility', 'Intermittent sensor', 'Noisy sensor', 'Partial sensor failure'];
const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

interface ScriptedMission {
  id: string;
  name: string;
  codename: string;
  objective: string;
  environment: EnvironmentType;
  difficulty: DifficultyLevel;
  weather: WeatherType;
  threatType: ThreatCategory;
  injects: { timeSec: number; title: string; description: string; impact: string }[];
}

const SCRIPTED_MISSIONS: ScriptedMission[] = [
  {
    id: 'SCRIPT-01',
    name: 'Operation Trishul: Mountain Valley Breach',
    codename: 'OP-TRISHUL-26',
    objective: 'Counter low-altitude penetration along river corridor with mid-flight electronic jamming and decoy separation.',
    environment: 'Border-like terrain',
    difficulty: 'Advanced',
    weather: 'Fog',
    threatType: 'Multiple drones',
    injects: [
      { timeSec: 10, title: 'T+10s: Low-Altitude Terrain Masking', description: 'Drone ducks below radar horizon along river canyon.', impact: 'Radar confidence drops to 20%.' },
      { timeSec: 25, title: 'T+25s: Active C2 Frequency Jamming', description: 'RF noise pulse hits 2.4 GHz control band.', impact: 'Sensors shift to EO/IR thermal.' },
      { timeSec: 40, title: 'T+40s: Corner-Reflector Decoy Ejection', description: 'Target releases passive radar foil decoy.', impact: 'Trainee must avoid false alarm.' },
    ]
  },
  {
    id: 'SCRIPT-02',
    name: 'Operation Silent Dawn: Night Optical Stealth',
    codename: 'OP-SILENT-DAWN',
    objective: 'Identify dark-coated fixed-wing surveillance drone operating in dark-mode glide profile over cantonment perimeter.',
    environment: 'Urban',
    difficulty: 'Expert',
    weather: 'Clear',
    threatType: 'Single drone',
    injects: [
      { timeSec: 12, title: 'T+12s: Motor Power-Cut Gliding Profile', description: 'UAV cuts electric motors to suppress acoustic signature.', impact: 'Acoustic confidence falls < 15%.' },
      { timeSec: 30, title: 'T+30s: Asymmetric Thermal Plume Bloom', description: 'Avionics cooling vents open emitting thermal infrared signature.', impact: 'FLIR White-Hot acquisition window opens.' },
    ]
  },
  {
    id: 'SCRIPT-03',
    name: 'Operation Swarm Blitz: 12-Node Saturation Assault',
    codename: 'OP-SWARM-BLITZ',
    objective: 'Defend High Value Ammunition Depot from synchronized 12-drone saturation split into dual flanking pincers.',
    environment: 'Industrial',
    difficulty: 'Expert',
    weather: 'Rain',
    threatType: 'Swarm',
    injects: [
      { timeSec: 15, title: 'T+15s: Flocking Dispersion Trigger', description: 'Swarm expands inter-node separation from 15m to 45m.', impact: 'Cohesion index drops, area defense alert required.' },
      { timeSec: 35, title: 'T+35s: Centroid Split into Pincer Vectors', description: 'Swarm bisects into North and South vectors.', impact: 'Trainee must prioritize lead navigation drone.' },
    ]
  }
];

export const ScenarioLabView: React.FC = () => {
  const { scenario, generateNewScenario, setActiveModule, startSimulation } = useSimulation();

  const [mode, setMode] = useState<'PROCEDURAL' | 'SCRIPTED'>('PROCEDURAL');
  const [selectedScripted, setSelectedScripted] = useState<ScriptedMission>(SCRIPTED_MISSIONS[0]);

  // Procedural states
  const [environment, setEnvironment] = useState<EnvironmentType>(scenario.environment);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(scenario.timeOfDay);
  const [weather, setWeather] = useState<WeatherType>(scenario.weather);
  const [threatType, setThreatType] = useState<ThreatCategory>(scenario.threatType);
  const [sensorCondition, setSensorCondition] = useState<SensorConditionType>(scenario.sensorCondition);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(scenario.difficulty);
  const [customSeed, setCustomSeed] = useState<string>(scenario.seed);
  const [copied, setCopied] = useState<boolean>(false);

  // Anti-Rote Randomization state
  const [antiRoteEnabled, setAntiRoteEnabled] = useState<boolean>(true);
  const [trajectoryJitter, setTrajectoryJitter] = useState<number>(35);

  const handleGenerate = () => {
    const seed = customSeed.trim() || generateSeedString();
    setCustomSeed(seed);
    generateNewScenario(seed, {
      environment,
      timeOfDay,
      weather,
      threatType,
      sensorCondition,
      difficulty
    });
  };

  const handleRandomize = () => {
    const newSeed = generateSeedString();
    setCustomSeed(newSeed);
    generateNewScenario(newSeed);
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(scenario.seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchScenario = () => {
    if (mode === 'PROCEDURAL') {
      handleGenerate();
    } else {
      generateNewScenario(selectedScripted.codename, {
        name: selectedScripted.name,
        environment: selectedScripted.environment,
        weather: selectedScripted.weather,
        threatType: selectedScripted.threatType,
        difficulty: selectedScripted.difficulty,
        objective: selectedScripted.objective
      });
    }
    setActiveModule('LIVE SIMULATOR');
    startSimulation();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-5 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              PROCEDURAL & SCRIPTED SCENARIO LAB
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tactical-primary/15 text-tactical-primary border border-tactical-primary/30">
              ANTI-ROTE ENGINE
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Toggle between dynamic pseudo-random threat generation and structured scripted tactical missions with timed doctrinal injects.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-tactical-card p-1 rounded-lg border border-tactical-border text-xs">
            <button
              onClick={() => setMode('PROCEDURAL')}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                mode === 'PROCEDURAL' ? 'bg-tactical-primary text-black' : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              PROCEDURAL GENERATOR
            </button>
            <button
              onClick={() => setMode('SCRIPTED')}
              className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all ${
                mode === 'SCRIPTED' ? 'bg-tactical-accent text-black' : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SCRIPTED MISSIONS</span>
            </button>
          </div>

          {mode === 'PROCEDURAL' && (
            <button
              onClick={handleRandomize}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-tactical-accent" />
              <span>RANDOMIZE</span>
            </button>
          )}
        </div>
      </div>

      {/* SCRIPTED MISSIONS MODE */}
      {mode === 'SCRIPTED' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Scripted Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs text-tactical-textMuted font-bold uppercase block">
              SELECT SCRIPTED DEFENSE DOCTRINE MISSION
            </span>

            {SCRIPTED_MISSIONS.map((msn) => (
              <div
                key={msn.id}
                onClick={() => setSelectedScripted(msn)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedScripted.id === msn.id
                    ? 'border-tactical-accent bg-tactical-card shadow-glow-teal'
                    : 'border-tactical-border bg-tactical-surface hover:border-tactical-borderLight'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-tactical-accent font-bold">{msn.codename}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-white">
                    {msn.difficulty}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{msn.name}</div>
                <div className="text-[11px] text-tactical-textMuted mt-1 leading-relaxed">
                  {msn.objective}
                </div>
              </div>
            ))}
          </div>

          {/* Scripted Injects Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-tactical-surface border border-tactical-border rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedScripted.name}</h3>
                  <span className="text-xs text-tactical-accent">{selectedScripted.environment} • {selectedScripted.weather}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-tactical-primary">
                  {selectedScripted.injects.length} TIMED INJECTS
                </span>
              </div>

              {/* Injects List */}
              <div className="space-y-3">
                {selectedScripted.injects.map((inj, idx) => (
                  <div key={idx} className="p-3 rounded bg-tactical-card border border-tactical-border text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="flex items-center gap-1.5 text-tactical-amber">
                        <Clock className="w-3.5 h-3.5" />
                        {inj.title}
                      </span>
                    </div>
                    <p className="text-tactical-textNormal text-[11px] leading-relaxed">
                      {inj.description}
                    </p>
                    <div className="text-[10px] text-tactical-accent pt-0.5">
                      Tactical Impact: {inj.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-tactical-border">
              <button
                onClick={handleLaunchScenario}
                className="w-full py-3 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH SCRIPTED MISSION WITH TIMED INJECTS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROCEDURAL GENERATOR MODE */}
      {mode === 'PROCEDURAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Configuration Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Seed Input & Reproducibility Bar */}
            <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
              <div className="flex items-center justify-between text-xs text-tactical-textMuted mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-tactical-primary" />
                  SCENARIO REPRODUCIBILITY SEED
                </span>
                <span className="text-[10px] text-tactical-accent">DETERMINISTIC PSEUDO-RANDOM</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value.toUpperCase())}
                  placeholder="e.g. SG-URBN-2026"
                  className="flex-1 bg-[#090e17] border border-tactical-border rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-tactical-primary"
                />
                <button
                  onClick={handleCopySeed}
                  className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-tactical-textNormal text-xs flex items-center gap-1.5 border border-tactical-border"
                  title="Copy Seed to Clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-tactical-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* Anti-Rote Learning Safeguard Box */}
            <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-tactical-amber" />
                  ANTI-ROTE RANDOMIZATION CONTROLS
                </span>
                <button
                  onClick={() => setAntiRoteEnabled(!antiRoteEnabled)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    antiRoteEnabled ? 'bg-emerald-500/20 text-tactical-primary border-emerald-500/40' : 'bg-slate-800 text-tactical-textMuted'
                  }`}
                >
                  {antiRoteEnabled ? 'PROTECTION ACTIVE' : 'DISABLED'}
                </button>
              </div>
              <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                Applies dynamic trajectory jitter, micro-Doppler clutter, and unexpected decoy drift so trainees cannot pass through memorization.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-tactical-textNormal">
                <span>Trajectory Jitter:</span>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={trajectoryJitter}
                  onChange={(e) => setTrajectoryJitter(Number(e.target.value))}
                  className="flex-1 accent-tactical-primary h-1 bg-slate-800 rounded"
                />
                <span className="w-8 text-right font-bold text-tactical-primary">{trajectoryJitter}%</span>
              </div>
            </div>

            {/* Config Matrix Grid */}
            <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-4 text-xs">
              {/* 1. Environment */}
              <div>
                <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                  1. ENVIRONMENT SECTOR
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ENVIRONMENTS.map((env) => (
                    <button
                      key={env}
                      onClick={() => setEnvironment(env)}
                      className={`px-3 py-2 rounded border text-left transition-all ${
                        environment === env
                          ? 'bg-tactical-primary/20 border-tactical-primary text-white shadow-glow-green'
                          : 'bg-[#090e17] border-tactical-border text-tactical-textMuted hover:border-tactical-borderLight'
                      }`}
                    >
                      <div className="font-bold">{env}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Threat Type */}
              <div>
                <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                  2. THREAT PROFILE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THREAT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setThreatType(t)}
                      className={`px-3 py-2 rounded border text-left transition-all ${
                        threatType === t
                          ? 'bg-tactical-accent/20 border-tactical-accent text-white shadow-glow-teal'
                          : 'bg-[#090e17] border-tactical-border text-tactical-textMuted hover:border-tactical-borderLight'
                      }`}
                    >
                      <div className="font-bold">{t}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Weather & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                    3. WEATHER CONDITIONS
                  </label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value as WeatherType)}
                    className="w-full bg-[#090e17] border border-tactical-border rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-tactical-primary"
                  >
                    {WEATHERS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                    4. DIFFICULTY TIER
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`py-2 rounded border text-center text-[10px] font-bold transition-all ${
                          difficulty === d
                            ? d === 'Expert' ? 'bg-red-500/20 border-red-500 text-red-400'
                              : d === 'Advanced' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-[#090e17] border-tactical-border text-tactical-textMuted'
                        }`}
                      >
                        {d.slice(0, 3).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scenario Preview Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-tactical-surface border border-tactical-border rounded-lg p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
                <span className="text-[10px] text-tactical-primary font-bold tracking-wider">
                  GENERATED SCENARIO PREVIEW
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-xs font-bold">
                  {scenario.seed}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white leading-snug">
                  {scenario.name}
                </h2>
                <p className="text-xs text-tactical-textMuted mt-1 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              {/* Parameter badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">ENVIRONMENT</span>
                  <span className="text-white font-bold">{scenario.environment}</span>
                </div>
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">ATMOSPHERE</span>
                  <span className="text-tactical-accent font-bold">{scenario.weather} / {scenario.timeOfDay}</span>
                </div>
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">SENSOR INTEGRITY</span>
                  <span className="text-tactical-primary font-bold">{scenario.sensorCondition}</span>
                </div>
                <div className="p-2 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted block">EST. DURATION</span>
                  <span className="text-white font-bold">{scenario.estimatedDurationSec} Seconds</span>
                </div>
              </div>

              {/* Objective & ROE */}
              <div className="p-3 rounded bg-[#090e17] border border-tactical-border space-y-2">
                <div>
                  <span className="text-[10px] text-tactical-textMuted font-bold block">OPERATIONAL OBJECTIVE</span>
                  <p className="text-xs text-white leading-relaxed">{scenario.objective}</p>
                </div>
                <div className="pt-2 border-t border-tactical-border/60">
                  <span className="text-[10px] text-tactical-amber font-bold block">RULES OF ENGAGEMENT (ROE)</span>
                  <p className="text-[11px] text-tactical-textMuted leading-relaxed">{scenario.rulesOfEngagement}</p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="mt-5 pt-4 border-t border-tactical-border">
              <button
                onClick={handleLaunchScenario}
                className="w-full py-3 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LAUNCH SCENARIO INTO SIMULATOR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

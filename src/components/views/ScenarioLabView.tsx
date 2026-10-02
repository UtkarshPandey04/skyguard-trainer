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
  Target
} from 'lucide-react';

const ENVIRONMENTS: EnvironmentType[] = ['Urban', 'Rural', 'Industrial', 'Border-like terrain', 'Open terrain'];
const TIMES: TimeOfDay[] = ['Day', 'Night', 'Dawn', 'Low visibility'];
const WEATHERS: WeatherType[] = ['Clear', 'Fog', 'Rain', 'Dust/haze', 'Wind disturbance'];
const THREAT_TYPES: ThreatCategory[] = ['Single drone', 'Multiple drones', 'Swarm', 'Unknown aerial object'];
const SENSOR_CONDITIONS: SensorConditionType[] = ['Normal', 'Reduced visibility', 'Intermittent sensor', 'Noisy sensor', 'Partial sensor failure'];
const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const ScenarioLabView: React.FC = () => {
  const { scenario, generateNewScenario, setActiveModule, startSimulation } = useSimulation();

  const [environment, setEnvironment] = useState<EnvironmentType>(scenario.environment);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(scenario.timeOfDay);
  const [weather, setWeather] = useState<WeatherType>(scenario.weather);
  const [threatType, setThreatType] = useState<ThreatCategory>(scenario.threatType);
  const [sensorCondition, setSensorCondition] = useState<SensorConditionType>(scenario.sensorCondition);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(scenario.difficulty);
  const [customSeed, setCustomSeed] = useState<string>(scenario.seed);
  const [copied, setCopied] = useState<boolean>(false);

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
    handleGenerate();
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
              PROCEDURAL SCENARIO LAB
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tactical-primary/15 text-tactical-primary border border-tactical-primary/30">
              NOVEL FEATURE #1
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Generate unlimited combinations of environment, weather, sensor degradation, and threat compositions using reproducible deterministic seeds.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomize}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-tactical-accent" />
            <span>RANDOMIZE SEED</span>
          </button>

          <button
            onClick={handleGenerate}
            className="px-4 py-2 rounded-lg bg-tactical-primary text-black font-extrabold text-xs hover:bg-tactical-primaryDark shadow-glow-green flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERATE SCENARIO</span>
          </button>
        </div>
      </div>

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
                    <div className="text-[10px] text-tactical-textMuted mt-0.5">
                      {t === 'Swarm' ? '8-12 coordinated nodes' : t === 'Multiple drones' ? '3-5 asymmetric tracks' : 'Single track inspection'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Weather & Time */}
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
                  4. TIME OF ENGAGEMENT
                </label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                  className="w-full bg-[#090e17] border border-tactical-border rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-tactical-primary"
                >
                  {TIMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Sensor Condition & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                  5. SENSOR DEGRADATION
                </label>
                <select
                  value={sensorCondition}
                  onChange={(e) => setSensorCondition(e.target.value as SensorConditionType)}
                  className="w-full bg-[#090e17] border border-tactical-border rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-tactical-primary"
                >
                  {SENSOR_CONDITIONS.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-tactical-textMuted font-bold text-[11px] mb-1.5">
                  6. DIFFICULTY LEVEL
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
                <span className={`font-bold ${scenario.sensorCondition === 'Normal' ? 'text-tactical-primary' : 'text-tactical-amber'}`}>
                  {scenario.sensorCondition}
                </span>
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

            {/* Skills Tested */}
            <div>
              <span className="text-[10px] text-tactical-textMuted font-bold block mb-1.5">SKILLS EVALUATED</span>
              <div className="flex flex-wrap gap-1.5">
                {scenario.skillsTested.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 rounded text-[10px] bg-tactical-primary/10 text-tactical-primary border border-tactical-primary/30">
                    {sk}
                  </span>
                ))}
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
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  ScenarioDefinition, 
  DroneTrack, 
  SimulationEvent, 
  TrainingScores, 
  TraineeProfile, 
  SkillHeatmapCell,
  TraineeDecisionChoice,
  DecisionEvaluation,
  SensorStatusState,
  DroneClassType
} from '../types/simulation';
import { 
  generateProceduralScenario, 
  generateTracksForScenario, 
  PRESET_SCENARIOS, 
  generateSeedString 
} from '../utils/scenarioGenerator';
import { tacticalAudio } from '../utils/audio';

interface SimulationContextType {
  // Navigation & View
  activeModule: string;
  setActiveModule: (mod: string) => void;

  // Session & Scenario
  scenario: ScenarioDefinition;
  setScenario: (sc: ScenarioDefinition) => void;
  loadPresetScenario: (id: string) => void;
  generateNewScenario: (seed?: string, overrides?: Partial<ScenarioDefinition>) => void;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSec: number;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  completeScenario: () => void;

  // Drone Tracks
  tracks: DroneTrack[];
  selectedTrackId: string | null;
  setSelectedTrackId: (id: string | null) => void;
  selectedTrack: DroneTrack | null;
  classifyTrack: (trackId: string, classification: DroneClassType) => void;
  makeDecision: (trackId: string, choice: TraineeDecisionChoice) => void;

  // Sensors
  sensors: {
    EO: SensorStatusState;
    IR: SensorStatusState;
    Radar: SensorStatusState;
    Acoustic: SensorStatusState;
  };
  setSensorStatus: (sensor: 'EO' | 'IR' | 'Radar' | 'Acoustic', status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE') => void;

  // Scoring & Metrics
  scores: TrainingScores;
  events: SimulationEvent[];

  // Trainee & Adaptive Engine
  trainee: TraineeProfile;
  heatmapData: SkillHeatmapCell[];
  adaptiveRecommendation: {
    targetLevel: number;
    trend: 'Improving' | 'Stable' | 'Needs Review';
    reason: string;
    nextScenarioSeed: string;
  };

  // Demo Mode
  isDemoActive: boolean;
  demoStep: number;
  startDemo: () => void;
  stopDemo: () => void;

  // Audio Toggle
  soundEnabled: boolean;
  toggleSound: () => void;

  // AAR selected event
  aarSelectedEvent: SimulationEvent | null;
  setAarSelectedEvent: (ev: SimulationEvent | null) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Initial Trainee profile for ALPHA-07 (Defence Services Staff College)
const INITIAL_TRAINEE: TraineeProfile = {
  callsign: 'ALPHA-07',
  id: 'DSSC-TRN-2026-07',
  rank: 'Major',
  organization: 'Ministry of Defence (MoD)',
  department: 'Defence Services Staff College (DSSC)',
  sessionsCompleted: 24,
  averageScore: 86,
  detectionAccuracy: 91,
  classificationAccuracy: 84,
  decisionAccuracy: 82,
  avgReactionTimeSec: 4.8,
  falsePositiveRate: 4.2,
  currentLevel: 3,
  performanceTrend: 'Improving',
  weakestArea: 'Decision Under Uncertainty',
  strongestArea: 'Sensor Fusion',
  recommendedNextTraining: 'Night + degraded sensor + swarm scenario'
};

const INITIAL_HEATMAP: SkillHeatmapCell[] = [
  { scenarioType: 'Urban Area', detection: 92, classification: 81, decision: 73, sensorFusion: 88, overall: 83.5 },
  { scenarioType: 'Rural Perimeter', detection: 96, classification: 89, decision: 91, sensorFusion: 94, overall: 92.5 },
  { scenarioType: 'Night Ops', detection: 78, classification: 72, decision: 65, sensorFusion: 81, overall: 74.0 },
  { scenarioType: 'Swarm Attack', detection: 81, classification: 69, decision: 61, sensorFusion: 77, overall: 72.0 },
  { scenarioType: 'Degraded Sensor', detection: 71, classification: 63, decision: 58, sensorFusion: 75, overall: 66.8 },
  { scenarioType: 'Decoy/Deception', detection: 85, classification: 78, decision: 69, sensorFusion: 84, overall: 79.0 },
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<string>('COMMAND CENTER');
  const setActiveModule = (mod: string) => {
    React.startTransition(() => {
      setActiveModuleState(mod);
    });
  };
  const [scenario, setScenario] = useState<ScenarioDefinition>(() => PRESET_SCENARIOS[0]);
  const [tracks, setTracks] = useState<DroneTrack[]>(() => generateTracksForScenario(PRESET_SCENARIOS[0]));
  const tracksRef = useRef<DroneTrack[]>(tracks);
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(() => tracks[0]?.id || null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  const [sensors, setSensors] = useState<{
    EO: SensorStatusState;
    IR: SensorStatusState;
    Radar: SensorStatusState;
    Acoustic: SensorStatusState;
  }>({
    EO: { status: 'ACTIVE', healthPercent: 96, noiseLevel: 5, effectiveRangeKm: 12 },
    IR: { status: 'ACTIVE', healthPercent: 92, noiseLevel: 8, effectiveRangeKm: 8 },
    Radar: { status: 'ACTIVE', healthPercent: 98, noiseLevel: 4, effectiveRangeKm: 30 },
    Acoustic: { status: 'ACTIVE', healthPercent: 88, noiseLevel: 12, effectiveRangeKm: 4 },
  });

  const [scores, setScores] = useState<TrainingScores>({
    detectionTime: 92,
    classificationAccuracy: 86,
    threatAssessment: 90,
    decisionQuality: 84,
    responseTiming: 88,
    falseAlarmRate: 94,
    sensorUtilization: 94,
    situationalAwareness: 87,
    overallScore: 89,
    scoreBreakdownLog: [
      { category: 'Baseline Calibration', delta: +80, reason: 'Initial simulation parameters loaded' },
      { category: 'Sensor Fusion', delta: +9, reason: 'Multi-spectral sensor weights balanced correctly' }
    ]
  });

  const [events, setEvents] = useState<SimulationEvent[]>([
    {
      id: 'EVT-INIT',
      timestampSec: 0,
      timeString: '09:41:20',
      category: 'SYSTEM',
      level: 'info',
      title: 'SKYGUARD Tactical Core Initialized',
      details: 'Synthetic radar environment loaded with 360° virtual coverage.'
    }
  ]);

  const [trainee, setTrainee] = useState<TraineeProfile>(INITIAL_TRAINEE);
  const [heatmapData] = useState<SkillHeatmapCell[]>(INITIAL_HEATMAP);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState<{
    targetLevel: number;
    trend: 'Improving' | 'Stable' | 'Needs Review';
    reason: string;
    nextScenarioSeed: string;
  }>({
    targetLevel: 4,
    trend: 'Improving',
    reason: 'Classification accuracy exceeded target threshold (86% vs 80%). Increasing trajectory uncertainty and sensor noise.',
    nextScenarioSeed: 'SG-ADAPT-X4'
  });

  // Demo mode states
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [aarSelectedEvent, setAarSelectedEvent] = useState<SimulationEvent | null>(null);

  const timerRef = useRef<number | null>(null);
  const demoTimerRef = useRef<number | null>(null);

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    tacticalAudio.enabled = next;
    if (next) tacticalAudio.playBlip(1400);
  };

  // Helper to format time string
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `09:${(41 + mins).toString().padStart(2, '0')}:${(20 + s).toString().padStart(2, '0')}`;
  };

  // Add event
  const addEvent = useCallback((event: Omit<SimulationEvent, 'id' | 'timeString'>) => {
    const id = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timeString = formatTime(event.timestampSec);
    const newEv: SimulationEvent = { ...event, id, timeString };
    setEvents(prev => [newEv, ...prev].slice(0, 80));
    return newEv;
  }, []);

  // Sensor state switcher
  const setSensorStatus = (sensor: 'EO' | 'IR' | 'Radar' | 'Acoustic', status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE') => {
    tacticalAudio.playBlip(900);
    setSensors(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        status,
        healthPercent: status === 'ACTIVE' ? 95 : status === 'DEGRADED' ? 45 : 0,
        noiseLevel: status === 'ACTIVE' ? 6 : status === 'DEGRADED' ? 48 : 95
      }
    }));
    addEvent({
      timestampSec: elapsedSec,
      category: 'SENSOR_ALERT',
      level: status === 'ACTIVE' ? 'info' : status === 'DEGRADED' ? 'warning' : 'critical',
      title: `${sensor} Sensor Switched to ${status}`,
      details: `Health: ${status === 'ACTIVE' ? '95%' : status === 'DEGRADED' ? '45%' : '0%'}. Multi-sensor weights recalibrated.`
    });
  };

  // Select track
  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0] || null;

  // Load a preset scenario
  const loadPresetScenario = (id: string) => {
    tacticalAudio.playBlip(1100);
    const target = PRESET_SCENARIOS.find(s => s.id === id) || PRESET_SCENARIOS[0];
    setScenario(target);
    const newTracks = generateTracksForScenario(target);
    setTracks(newTracks);
    setSelectedTrackId(newTracks[0]?.id || null);
    setElapsedSec(0);
    setIsRunning(false);
    setIsPaused(false);
    addEvent({
      timestampSec: 0,
      category: 'SYSTEM',
      level: 'info',
      title: `Scenario Loaded: ${target.name}`,
      details: target.description
    });
  };

  // Generate procedurally
  const generateNewScenario = (seedInput?: string, overrides?: Partial<ScenarioDefinition>) => {
    tacticalAudio.playBlip(1300);
    const newSc = generateProceduralScenario(seedInput || generateSeedString(), overrides);
    setScenario(newSc);
    const newTracks = generateTracksForScenario(newSc);
    setTracks(newTracks);
    setSelectedTrackId(newTracks[0]?.id || null);
    setElapsedSec(0);
    setIsRunning(false);
    setIsPaused(false);
    addEvent({
      timestampSec: 0,
      category: 'SYSTEM',
      level: 'info',
      title: `Procedural Scenario Generated [${newSc.seed}]`,
      details: `${newSc.environment} | ${newSc.weather} | ${newSc.threatType} | ${newSc.difficulty}`
    });
  };

  // Classify a track (Trainee classification action)
  const classifyTrack = (trackId: string, classification: DroneClassType) => {
    const target = tracksRef.current.find(t => t.id === trackId) || tracks.find(t => t.id === trackId);
    if (!target) return;

    const isCorrect = target.groundTruth === classification;
    tacticalAudio.playBlip(isCorrect ? 1500 : 700);

    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          traineeClassification: classification,
          status: 'CLASSIFYING'
        };
      }
      return t;
    }));

    const delta = isCorrect ? +5 : -6;
    setScores(prev => ({
      ...prev,
      classificationAccuracy: Math.min(100, Math.max(30, prev.classificationAccuracy + (isCorrect ? 2 : -4))),
      overallScore: Math.min(100, Math.max(20, Math.round(prev.overallScore + (isCorrect ? 2 : -3)))),
      scoreBreakdownLog: [
        {
          category: 'Classification',
          delta,
          reason: isCorrect 
            ? `Accurately identified ${classification} on Track ${target.callsign}`
            : `Miscalibrated classification (${classification} vs actual ${target.groundTruth})`
        },
        ...prev.scoreBreakdownLog
      ]
    }));

    addEvent({
      timestampSec: elapsedSec,
      category: 'CLASSIFICATION',
      level: isCorrect ? 'success' : 'warning',
      title: `Track ${target.callsign} Classified as ${classification}`,
      details: isCorrect 
        ? `Trainee classification confirmed correct with multi-sensor confidence (${target.fusedConfidence}%).`
        : `Discrepancy detected: Ground truth profile is ${target.groundTruth}.`,
      trackId
    });
  };

  // Trainee Decision Action
  const makeDecision = (trackId: string, choice: TraineeDecisionChoice) => {
    const target = tracksRef.current.find(t => t.id === trackId) || tracks.find(t => t.id === trackId);
    if (!target) return;

    // Evaluate decision quality
    let quality: DecisionEvaluation['quality'] = 'ACCEPTABLE';
    let expectedAction: TraineeDecisionChoice = 'CONTINUE_OBSERVATION';
    let delta = 0;
    let rationale = '';

    if (target.isDecoy || target.isNonThreat) {
      expectedAction = 'MARK_NON_THREAT';
      if (choice === 'MARK_NON_THREAT') {
        quality = 'OPTIMAL';
        delta = +15;
        rationale = 'Optimal ROE judgment: Correctly identified decoy/non-threat without triggering high-alert protocols.';
      } else if (choice === 'INITIATE_RESPONSE_PROTOCOL') {
        quality = 'CRITICAL_ERROR';
        delta = -25;
        rationale = 'False Alarm Violation: Triggered active response protocol against a harmless decoy/avian object!';
      } else {
        quality = 'ACCEPTABLE';
        delta = +5;
        rationale = 'Prudent caution: Sustained observation prevented premature false alert.';
      }
    } else if (target.threatLevel === 'HIGH') {
      expectedAction = 'INITIATE_RESPONSE_PROTOCOL';
      if (choice === 'INITIATE_RESPONSE_PROTOCOL') {
        quality = 'OPTIMAL';
        delta = +20;
        rationale = 'Decisive command response: High-threat aerial intrusion countered within critical perimeter window.';
      } else if (choice === 'REQUEST_SENSOR_CONFIRMATION' && target.sensorDisagreement === 'HIGH') {
        quality = 'OPTIMAL';
        delta = +18;
        rationale = 'Superb situational awareness: Identified high sensor disagreement and verified before escalation.';
      } else if (choice === 'MARK_NON_THREAT') {
        quality = 'CRITICAL_ERROR';
        delta = -35;
        rationale = 'Critical Breach: Dismissed an incoming hostile UAV as non-threat!';
      } else {
        quality = 'ACCEPTABLE';
        delta = +8;
        rationale = 'Supervisor escalation initiated according to standard operating doctrine.';
      }
    } else {
      // Medium or uncertain threat
      expectedAction = 'REQUEST_SENSOR_CONFIRMATION';
      if (choice === 'REQUEST_SENSOR_CONFIRMATION' || choice === 'ESCALATE_SUPERVISOR') {
        quality = 'OPTIMAL';
        delta = +15;
        rationale = 'Sound doctrine: Resolved threat ambiguity using secondary telemetry confirmation.';
      } else if (choice === 'INITIATE_RESPONSE_PROTOCOL') {
        quality = 'SUB-OPTIMAL';
        delta = -10;
        rationale = 'Premature escalation: Initiated response before cross-spectral sensor confirmation.';
      } else {
        quality = 'ACCEPTABLE';
        delta = +5;
        rationale = 'Continued observation maintains track continuity.';
      }
    }

    if (quality === 'OPTIMAL') tacticalAudio.playSuccess();
    else if (quality === 'CRITICAL_ERROR') tacticalAudio.playThreatAlert();
    else tacticalAudio.playBlip(1000);

    const decisionEval: DecisionEvaluation = {
      action: choice,
      timestamp: formatTime(elapsedSec),
      timeTakenSec: Math.max(2.1, Math.round((elapsedSec % 15 + 2) * 10) / 10),
      quality,
      scoreDelta: delta,
      rationale,
      expectedAction,
      contextAwarenessScore: quality === 'OPTIMAL' ? 95 : quality === 'ACCEPTABLE' ? 78 : 45
    };

    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          status: choice === 'INITIATE_RESPONSE_PROTOCOL' ? 'ENGAGED' : 'RESOLVED',
          traineeActionTaken: choice
        };
      }
      return t;
    }));

    setScores(prev => {
      const newDecisionQ = Math.min(100, Math.max(30, prev.decisionQuality + (delta > 0 ? 3 : -6)));
      const newOverall = Math.min(100, Math.max(20, Math.round(prev.overallScore + (delta > 0 ? 3 : -5))));
      const newFalseAlarm = (quality === 'CRITICAL_ERROR' && choice === 'INITIATE_RESPONSE_PROTOCOL') 
        ? Math.max(50, prev.falseAlarmRate - 15) 
        : prev.falseAlarmRate;

      return {
        ...prev,
        decisionQuality: newDecisionQ,
        falseAlarmRate: newFalseAlarm,
        overallScore: newOverall,
        scoreBreakdownLog: [
          {
            category: 'Decision Engine',
            delta,
            reason: `Action: ${choice.replace(/_/g, ' ')} on ${target.callsign} (${quality})`
          },
          ...prev.scoreBreakdownLog
        ]
      };
    });

    const newEv = addEvent({
      timestampSec: elapsedSec,
      category: 'TRAINEE_ACTION',
      level: quality === 'OPTIMAL' ? 'success' : quality === 'CRITICAL_ERROR' ? 'critical' : 'warning',
      title: `Trainee Decision: ${choice.replace(/_/g, ' ')}`,
      details: rationale,
      trackId,
      decisionEval
    });

    setAarSelectedEvent(newEv);
  };

  // Complete scenario
  const completeScenario = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    tacticalAudio.playSuccess();
    addEvent({
      timestampSec: elapsedSec,
      category: 'SYSTEM',
      level: 'success',
      title: 'Simulation Scenario Completed',
      details: `All tracks resolved. Generating After-Action Review (AAR) and updating Adaptive Readiness Profile.`
    });

    // Update Adaptive Recommendation
    const passed = scores.overallScore >= 80;
    if (passed) {
      setAdaptiveRecommendation({
        targetLevel: Math.min(5, trainee.currentLevel + 1),
        trend: 'Improving',
        reason: `Overall performance of ${scores.overallScore}/100 exceeds promotion threshold. Advancing to higher swarm velocity and intermittent sensor degradation.`,
        nextScenarioSeed: generateSeedString()
      });
      setTrainee(prev => ({
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
        averageScore: Math.round((prev.averageScore * prev.sessionsCompleted + scores.overallScore) / (prev.sessionsCompleted + 1)),
        currentLevel: Math.min(5, prev.currentLevel + 1),
        performanceTrend: 'Improving'
      }));
    } else {
      setAdaptiveRecommendation({
        targetLevel: trainee.currentLevel,
        trend: 'Needs Review',
        reason: `Score of ${scores.overallScore}/100 indicates vulnerability in false positive discrimination. Scheduling focused Decoy Identification drill.`,
        nextScenarioSeed: 'SG-DECOY-REMEDY'
      });
    }

    setActiveModule('AFTER-ACTION REVIEW');
  };

  // Start / pause simulation loop
  const startSimulation = () => {
    tacticalAudio.playBlip(1200);
    setIsRunning(true);
    setIsPaused(false);
    addEvent({
      timestampSec: elapsedSec,
      category: 'SYSTEM',
      level: 'info',
      title: 'Simulation Timer Started',
      details: 'Virtual sensor scanning active. Trajectory prediction engine online.'
    });
  };

  const pauseSimulation = () => {
    tacticalAudio.playBlip(800);
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    tacticalAudio.playBlip(900);
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSec(0);
    const newTracks = generateTracksForScenario(scenario);
    setTracks(newTracks);
    setSelectedTrackId(newTracks[0]?.id || null);
    addEvent({
      timestampSec: 0,
      category: 'SYSTEM',
      level: 'info',
      title: 'Simulation Reset',
      details: 'All tracks and virtual sensor buffers restored to initial state.'
    });
  };

  // Simulation physics & movement loop
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedSec(prev => {
        const next = prev + 1;

        // Periodic radar ping every 4 seconds
        if (next % 4 === 0) {
          tacticalAudio.playRadarPing();
        }

        // Check if scenario should end
        if (next >= scenario.estimatedDurationSec && next > 20) {
          completeScenario();
        }

        return next;
      });

      // Update positions of tracks
      setTracks(prevTracks => {
        return prevTracks.map(trk => {
          let nx = trk.x + trk.vx * 1.5;
          let ny = trk.y + trk.vy * 1.5;

          // Bounce or wrap gracefully within 100-900 bounds
          let nvx = trk.vx;
          let nvy = trk.vy;

          if (nx < 80 || nx > 920) {
            nvx = -trk.vx;
            nx = Math.max(80, Math.min(920, nx));
          }
          if (ny < 80 || ny > 920) {
            nvy = -trk.vy;
            ny = Math.max(80, Math.min(920, ny));
          }

          // Append to history (keep last 12 points)
          const newHistory: [number, number][] = [...trk.history, [nx, ny] as [number, number]].slice(-12);

          // Update heading
          const headingDeg = Math.round((Math.atan2(nvy, nvx) * 180 / Math.PI + 360) % 360);

          return {
            ...trk,
            x: nx,
            y: ny,
            vx: nvx,
            vy: nvy,
            headingDeg,
            history: newHistory
          };
        });
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, scenario.estimatedDurationSec]);

  // DEMO MODE - 60-90 second guided walkthrough across 10 steps
  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    tacticalAudio.playSuccess();

    // Step 1: Generate randomized scenario
    generateNewScenario('SG-DEMO-2026', {
      environment: 'Urban',
      timeOfDay: 'Night',
      weather: 'Fog',
      threatType: 'Swarm',
      difficulty: 'Advanced'
    });
    setActiveModule('COMMAND CENTER');
    startSimulation();

    // Step sequence with timers
    let step = 1;
    demoTimerRef.current = window.setInterval(() => {
      step++;
      setDemoStep(step);

      if (step === 2) {
        setActiveModule('LIVE SIMULATOR');
        tacticalAudio.playBlip(1200);
      } else if (step === 3) {
        tacticalAudio.playRadarPing();
        setActiveModule('THREAT ANALYSIS');
      } else if (step === 4) {
        tacticalAudio.playBlip(1400);
        setActiveModule('SENSOR FUSION');
      } else if (step === 5) {
        // Sensor degradation occurs
        setSensorStatus('Radar', 'DEGRADED');
        tacticalAudio.playThreatAlert();
      } else if (step === 6) {
        setActiveModule('SWARM INTELLIGENCE');
        tacticalAudio.playBlip(1100);
      } else if (step === 7) {
        setActiveModule('DECISION ENGINE');
        tacticalAudio.playBlip(1300);
      } else if (step === 8) {
        // Automatic optimal decision demo
        makeDecision(tracks[0]?.id || 'TRK-001', 'REQUEST_SENSOR_CONFIRMATION');
      } else if (step === 9) {
        // End scenario and show AAR
        completeScenario();
      } else if (step >= 10) {
        if (demoTimerRef.current) clearInterval(demoTimerRef.current);
      }
    }, 6000);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setDemoStep(0);
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
  };

  return (
    <SimulationContext.Provider
      value={{
        activeModule,
        setActiveModule,
        scenario,
        setScenario,
        loadPresetScenario,
        generateNewScenario,
        isRunning,
        isPaused,
        elapsedSec,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        completeScenario,
        tracks,
        selectedTrackId,
        setSelectedTrackId,
        selectedTrack,
        classifyTrack,
        makeDecision,
        sensors,
        setSensorStatus,
        scores,
        events,
        trainee,
        heatmapData,
        adaptiveRecommendation,
        isDemoActive,
        demoStep,
        startDemo,
        stopDemo,
        soundEnabled,
        toggleSound,
        aarSelectedEvent,
        setAarSelectedEvent,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export type EnvironmentType = 'Urban' | 'Rural' | 'Industrial' | 'Border-like terrain' | 'Open terrain';
export type TimeOfDay = 'Day' | 'Night' | 'Dawn' | 'Low visibility';
export type WeatherType = 'Clear' | 'Fog' | 'Rain' | 'Dust/haze' | 'Wind disturbance';
export type ThreatCategory = 'Single drone' | 'Multiple drones' | 'Swarm' | 'Unknown aerial object';
export type SensorConditionType = 'Normal' | 'Reduced visibility' | 'Intermittent sensor' | 'Noisy sensor' | 'Partial sensor failure';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type DroneClassType = 
  | 'Small UAV'
  | 'Large UAV'
  | 'Multi-object swarm'
  | 'Unknown aerial object'
  | 'Non-threat object'
  | 'Decoy';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNCERTAIN';

export type SensorType = 'EO' | 'IR' | 'Radar' | 'Acoustic';
export type SensorStatus = 'ACTIVE' | 'DEGRADED' | 'OFFLINE';

export interface SensorStatusState {
  status: SensorStatus;
  healthPercent: number;
  noiseLevel: number; // 0 - 100
  effectiveRangeKm: number;
}

export interface SensorReadings {
  eo: number; // confidence %
  ir: number;
  radar: number;
  acoustic: number;
}

export interface DroneTrack {
  id: string;
  callsign: string;
  x: number; // 0 - 1000 coordinate on tactical map
  y: number;
  altitudeM: number; // altitude in meters
  vx: number;
  vy: number;
  headingDeg: number;
  speedMps: number;
  history: [number, number][]; // past trajectory points
  
  // Intelligence classification
  groundTruth: DroneClassType;
  aiClassification: DroneClassType;
  traineeClassification?: DroneClassType;
  classificationConfidence: number; // 0 - 100
  confidenceDistribution: Record<DroneClassType, number>;
  
  // Signatures
  shapeSignature: string; // e.g. "Quad-rotor Micro (0.4m RCS)"
  motionPattern: string; // e.g. "Linear Loitering with high angular twitch"
  speedCategory: 'Low (<15 m/s)' | 'Medium (15-35 m/s)' | 'High (>35 m/s)';
  altitudeCategory: 'Ultra-low (<50m)' | 'Low (50-200m)' | 'Medium (>200m)';
  trajectoryPattern: string; // "Vector towards Restricted Zone A"

  // Threat & Explainability
  threatLevel: ThreatLevel;
  threatScore: number; // 0 - 100
  anomalyFactors: {
    factor: string;
    weight: number;
    description: string;
  }[];
  isRestrictedZoneApproach: boolean;
  isDecoy: boolean;
  isNonThreat: boolean;

  // Sensor Fusion
  sensors: SensorReadings;
  fusedConfidence: number;
  sensorDisagreement: 'LOW' | 'MEDIUM' | 'HIGH';
  disagreementExplanation: string;

  // Swarm coordination
  swarmId?: string;
  swarmRole?: 'Lead' | 'Follower' | 'Flanker' | 'Decoy';

  // Lifecycle
  detectionTimeSec: number;
  status: 'DETECTED' | 'CLASSIFYING' | 'ASSESSED' | 'ENGAGED' | 'NEUTRALIZED' | 'RESOLVED';
  traineeActionTaken?: TraineeDecisionChoice;
}

export type TraineeDecisionChoice = 
  | 'CONTINUE_OBSERVATION'
  | 'REQUEST_SENSOR_CONFIRMATION'
  | 'ESCALATE_SUPERVISOR'
  | 'MARK_NON_THREAT'
  | 'INITIATE_RESPONSE_PROTOCOL'
  | 'END_TRACKING';

export interface DecisionEvaluation {
  action: TraineeDecisionChoice;
  timestamp: string;
  timeTakenSec: number;
  quality: 'OPTIMAL' | 'ACCEPTABLE' | 'SUB-OPTIMAL' | 'CRITICAL_ERROR';
  scoreDelta: number;
  rationale: string;
  expectedAction: TraineeDecisionChoice;
  contextAwarenessScore: number;
}

export interface ScenarioDefinition {
  id: string;
  seed: string;
  name: string;
  description: string;
  environment: EnvironmentType;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  threatType: ThreatCategory;
  sensorCondition: SensorConditionType;
  difficulty: DifficultyLevel;
  objective: string;
  rulesOfEngagement: string;
  threatCount: number;
  decoyCount: number;
  swarmActive: boolean;
  estimatedDurationSec: number;
  skillsTested: string[];
}

export interface SimulationEvent {
  id: string;
  timestampSec: number;
  timeString: string;
  category: 'DETECTION' | 'CLASSIFICATION' | 'ASSESSMENT' | 'SENSOR_ALERT' | 'TRAINEE_ACTION' | 'SWARM_EVENT' | 'SYSTEM';
  level: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  details: string;
  trackId?: string;
  decisionEval?: DecisionEvaluation;
}

export interface TrainingScores {
  detectionTime: number; // 0-100
  classificationAccuracy: number; // 0-100
  threatAssessment: number; // 0-100
  decisionQuality: number; // 0-100
  responseTiming: number; // 0-100
  falseAlarmRate: number; // 0-100 (lower is better, mapped to score)
  sensorUtilization: number; // 0-100
  situationalAwareness: number; // 0-100
  overallScore: number; // 0-100
  scoreBreakdownLog: { category: string; delta: number; reason: string }[];
}

export interface TraineeProfile {
  callsign: string;
  id: string;
  rank: string;
  organization: string;
  department: string;
  sessionsCompleted: number;
  averageScore: number;
  detectionAccuracy: number;
  classificationAccuracy: number;
  decisionAccuracy: number;
  avgReactionTimeSec: number;
  falsePositiveRate: number;
  currentLevel: number;
  performanceTrend: 'Improving' | 'Stable' | 'Needs Review';
  weakestArea: string;
  strongestArea: string;
  recommendedNextTraining: string;
}

export interface SkillHeatmapCell {
  scenarioType: string;
  detection: number;
  classification: number;
  decision: number;
  sensorFusion: number;
  overall: number;
}

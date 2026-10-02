import { 
  ScenarioDefinition, 
  EnvironmentType, 
  TimeOfDay, 
  WeatherType, 
  ThreatCategory, 
  SensorConditionType, 
  DifficultyLevel,
  DroneTrack,
  DroneClassType,
  ThreatLevel
} from '../types/simulation';

// Deterministic Mulberry32 PRNG for reproducible seeds
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeedString(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'SG-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const ENVIRONMENTS: EnvironmentType[] = ['Urban', 'Rural', 'Industrial', 'Border-like terrain', 'Open terrain'];
const TIMES: TimeOfDay[] = ['Day', 'Night', 'Dawn', 'Low visibility'];
const WEATHERS: WeatherType[] = ['Clear', 'Fog', 'Rain', 'Dust/haze', 'Wind disturbance'];
const THREAT_TYPES: ThreatCategory[] = ['Single drone', 'Multiple drones', 'Swarm', 'Unknown aerial object'];
const SENSOR_CONDITIONS: SensorConditionType[] = ['Normal', 'Reduced visibility', 'Intermittent sensor', 'Noisy sensor', 'Partial sensor failure'];
const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function generateProceduralScenario(
  seedInput?: string, 
  overrides?: Partial<ScenarioDefinition>
): ScenarioDefinition {
  const seed = seedInput || generateSeedString();
  const rand = mulberry32(hashSeed(seed));

  const environment = overrides?.environment || ENVIRONMENTS[Math.floor(rand() * ENVIRONMENTS.length)];
  const timeOfDay = overrides?.timeOfDay || TIMES[Math.floor(rand() * TIMES.length)];
  const weather = overrides?.weather || WEATHERS[Math.floor(rand() * WEATHERS.length)];
  const threatType = overrides?.threatType || THREAT_TYPES[Math.floor(rand() * THREAT_TYPES.length)];
  const sensorCondition = overrides?.sensorCondition || SENSOR_CONDITIONS[Math.floor(rand() * SENSOR_CONDITIONS.length)];
  const difficulty = overrides?.difficulty || DIFFICULTIES[Math.floor(rand() * DIFFICULTIES.length)];

  let threatCount = 1;
  let decoyCount = 0;
  let swarmActive = false;

  if (threatType === 'Swarm') {
    swarmActive = true;
    threatCount = difficulty === 'Expert' ? 12 : difficulty === 'Advanced' ? 8 : 6;
    decoyCount = difficulty === 'Expert' ? 3 : 1;
  } else if (threatType === 'Multiple drones') {
    threatCount = difficulty === 'Expert' ? 6 : difficulty === 'Advanced' ? 4 : 3;
    decoyCount = (difficulty === 'Advanced' || difficulty === 'Expert') ? 2 : 1;
  } else if (threatType === 'Unknown aerial object') {
    threatCount = 2;
    decoyCount = 1;
  } else {
    // Single drone
    threatCount = 1;
    decoyCount = (weather === 'Fog' || sensorCondition === 'Noisy sensor') ? 1 : 0;
  }

  const name = overrides?.name || `${environment} Sector ${seed} Defense Trial`;
  const objective = overrides?.objective || `Detect and assess ${threatCount} aerial track(s)${decoyCount > 0 ? ` including ${decoyCount} decoy/ambiguous object(s)` : ''} under ${weather.toLowerCase()} ${timeOfDay.toLowerCase()} conditions without unverified escalation.`;

  return {
    id: `SCENARIO-${seed}`,
    seed,
    name,
    description: `Procedurally generated defense training operation simulating ${threatType.toLowerCase()} infiltration across ${environment.toLowerCase()} airspace. Evaluates sensor fusion confidence and response judgment under ${sensorCondition.toLowerCase()}.`,
    environment,
    timeOfDay,
    weather,
    threatType,
    sensorCondition,
    difficulty,
    objective,
    rulesOfEngagement: 'Safe simulated protocol only. Confirm sensor agreement before escalating. Avoid targeting ambiguous decoys or wildlife.',
    threatCount,
    decoyCount,
    swarmActive,
    estimatedDurationSec: swarmActive ? 90 : 60,
    skillsTested: [
      'Multi-Sensor Fusion',
      'Threat Ambiguity Resolution',
      'Rules of Engagement Decision',
      swarmActive ? 'Swarm Kinematics Tracking' : 'Rapid Track Classification'
    ]
  };
}

// 10 Preset Scenarios from Requirement #19
export const PRESET_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'PRESET-01',
    seed: 'SG-URBN-NIGHT',
    name: '1. Urban Night Infiltration',
    description: 'High-density urban area during night ops with limited EO visual capability and heavy RF ground clutter.',
    environment: 'Urban',
    timeOfDay: 'Night',
    weather: 'Clear',
    threatType: 'Single drone',
    sensorCondition: 'Reduced visibility',
    difficulty: 'Intermediate',
    objective: 'Detect low-RCS quadcopter maneuvering between skyline high-rises and assess intent towards Government Complex.',
    rulesOfEngagement: 'Verify IR thermal signature before issuing classification. Maintain civilian safety buffer.',
    threatCount: 2,
    decoyCount: 1,
    swarmActive: false,
    estimatedDurationSec: 60,
    skillsTested: ['Night IR Fusion', 'Urban Clutter Discrimination', 'Proximity Assessment']
  },
  {
    id: 'PRESET-02',
    seed: 'SG-RURL-DAY',
    name: '2. Rural Day Perimeter Recon',
    description: 'Broad rural terrain with clear visibility. Trainee baseline calibration for high-speed fixed-wing UAV.',
    environment: 'Rural',
    timeOfDay: 'Day',
    weather: 'Clear',
    threatType: 'Single drone',
    sensorCondition: 'Normal',
    difficulty: 'Beginner',
    objective: 'Track long-range high-speed UAV approach across open farmland boundary.',
    rulesOfEngagement: 'Continuous radar lock and rapid classification within 15 seconds of boundary crossing.',
    threatCount: 1,
    decoyCount: 0,
    swarmActive: false,
    estimatedDurationSec: 45,
    skillsTested: ['Radar Vectoring', 'Baseline Classification', 'Reaction Speed']
  },
  {
    id: 'PRESET-03',
    seed: 'SG-FOG-DEGRADED',
    name: '3. Fog + Sensor Degradation',
    description: 'Dense fog severely blunts optical cameras. Trainee must lean on simulated acoustic arrays and millimeter radar.',
    environment: 'Border-like terrain',
    timeOfDay: 'Dawn',
    weather: 'Fog',
    threatType: 'Single drone',
    sensorCondition: 'Intermittent sensor',
    difficulty: 'Advanced',
    objective: 'Triangulate concealed UAV navigating through thick mountain valley fog despite flickering radar returns.',
    rulesOfEngagement: 'Do not escalate on single-sensor spikes; require fused acoustic and radar correlation.',
    threatCount: 2,
    decoyCount: 1,
    swarmActive: false,
    estimatedDurationSec: 75,
    skillsTested: ['Acoustic Triangulation', 'Sensor Disagreement Handling', 'Uncertainty Mitigation']
  },
  {
    id: 'PRESET-04',
    seed: 'SG-UNKNOWN-UAV',
    name: '4. Single Unknown Aerial Object',
    description: 'An atypical radar cross-section exhibiting anomalous loiter vectors near an ammunition depot.',
    environment: 'Industrial',
    timeOfDay: 'Day',
    weather: 'Wind disturbance',
    threatType: 'Unknown aerial object',
    sensorCondition: 'Normal',
    difficulty: 'Intermediate',
    objective: 'Classify whether the radar anomaly is an improvised commercial micro-drone, weather balloon, or stray delivery UAV.',
    rulesOfEngagement: 'Request additional sensor confirmation prior to activating alert protocols.',
    threatCount: 2,
    decoyCount: 1,
    swarmActive: false,
    estimatedDurationSec: 60,
    skillsTested: ['Anomaly Assessment', 'Kinematic Profiling', 'Decoy Separation']
  },
  {
    id: 'PRESET-05',
    seed: 'SG-MULTI-UAV',
    name: '5. Multi-UAV Coordinated Approach',
    description: 'Three synchronized autonomous drones approaching from divergent vectors to saturate defenses.',
    environment: 'Industrial',
    timeOfDay: 'Night',
    weather: 'Clear',
    threatType: 'Multiple drones',
    sensorCondition: 'Normal',
    difficulty: 'Advanced',
    objective: 'Prioritize simultaneous tracks, identify lead navigation drone, and stagger response recommendations.',
    rulesOfEngagement: 'Prioritize tracks closest to Restricted Zone A without losing secondary vector telemetry.',
    threatCount: 3,
    decoyCount: 1,
    swarmActive: false,
    estimatedDurationSec: 80,
    skillsTested: ['Multi-Target Tracking', 'Threat Prioritization', 'Task Saturation Management']
  },
  {
    id: 'PRESET-06',
    seed: 'SG-SWARM-8NODE',
    name: '6. Swarm Detection & Kinematics',
    description: 'Coordinated 8-drone micro-swarm exhibiting flocking algorithms and dynamic dispersion.',
    environment: 'Open terrain',
    timeOfDay: 'Day',
    weather: 'Clear',
    threatType: 'Swarm',
    sensorCondition: 'Normal',
    difficulty: 'Advanced',
    objective: 'Map swarm centroid, detect leader node, and predict dispersion pattern toward perimeter.',
    rulesOfEngagement: 'Observe swarm clustering density. Log formation shifts and maintain centroid lock.',
    threatCount: 8,
    decoyCount: 1,
    swarmActive: true,
    estimatedDurationSec: 90,
    skillsTested: ['Swarm Pattern Recognition', 'Centroid Tracking', 'Flocking Analysis']
  },
  {
    id: 'PRESET-07',
    seed: 'SG-DECOY-DISCRIM',
    name: '7. Deception & Decoy Identification',
    description: 'Complex electronic warfare noise and decoy corner reflectors designed to trigger false positive alerts.',
    environment: 'Border-like terrain',
    timeOfDay: 'Dawn',
    weather: 'Dust/haze',
    threatType: 'Unknown aerial object',
    sensorCondition: 'Noisy sensor',
    difficulty: 'Advanced',
    objective: 'Differentiate between migratory bird flock, sensor ghost artifact, and genuine payload-bearing drone.',
    rulesOfEngagement: 'Strict penalty for false alarms. Examine multi-sensor disagreement scores.',
    threatCount: 2,
    decoyCount: 2,
    swarmActive: false,
    estimatedDurationSec: 70,
    skillsTested: ['False Positive Avoidance', 'Acoustic Signature Validation', 'Ghost Rejection']
  },
  {
    id: 'PRESET-08',
    seed: 'SG-FAIL-PARTIAL',
    name: '8. Partial Sensor Failure Recovery',
    description: 'Primary radar sensor goes offline mid-operation due to jamming; trainee must switch to EO/IR and Acoustic.',
    environment: 'Urban',
    timeOfDay: 'Night',
    weather: 'Rain',
    threatType: 'Single drone',
    sensorCondition: 'Partial sensor failure',
    difficulty: 'Expert',
    objective: 'Maintain continuity of tracking when Primary Radar enters offline state.',
    rulesOfEngagement: 'Utilize thermal optics and sound signature to re-acquire target position.',
    threatCount: 2,
    decoyCount: 0,
    swarmActive: false,
    estimatedDurationSec: 65,
    skillsTested: ['Graceful Degradation Operation', 'Backup Sensor Fusion', 'Rapid Re-acquisition']
  },
  {
    id: 'PRESET-09',
    seed: 'SG-MIXED-COMPLEX',
    name: '9. Mixed Threat Environment',
    description: 'High-intensity scenario featuring a high-altitude surveillance UAV, a low-level kamikaze micro-drone, and civilian decoy.',
    environment: 'Industrial',
    timeOfDay: 'Low visibility',
    weather: 'Rain',
    threatType: 'Multiple drones',
    sensorCondition: 'Reduced visibility',
    difficulty: 'Expert',
    objective: 'Simultaneously assess dual asymmetric aerial threats under adverse weather.',
    rulesOfEngagement: 'Identify non-threat civilian quadcopter immediately to avoid false response protocol.',
    threatCount: 4,
    decoyCount: 2,
    swarmActive: false,
    estimatedDurationSec: 90,
    skillsTested: ['Asymmetric Threat Assessment', 'High-Stress ROE Enforcement', 'Sensor Weight Balancing']
  },
  {
    id: 'PRESET-10',
    seed: 'SG-EXPERT-RANDOM',
    name: '10. Expert Randomized Infiltration',
    description: 'Fully randomized dynamic threat composition with unpredictable wind gusts and intermittent telemetry drops.',
    environment: 'Border-like terrain',
    timeOfDay: 'Night',
    weather: 'Wind disturbance',
    threatType: 'Swarm',
    sensorCondition: 'Intermittent sensor',
    difficulty: 'Expert',
    objective: 'Mastery challenge for senior staff officers: track dynamic swarm splitting into flanking pincers.',
    rulesOfEngagement: 'Exercise autonomous situational awareness and prompt supervisor escalation.',
    threatCount: 10,
    decoyCount: 3,
    swarmActive: true,
    estimatedDurationSec: 100,
    skillsTested: ['Advanced Swarm Pincer Recognition', 'Intermittent Signal Recovery', 'Executive Decision Quality']
  }
];

// Generate dynamic tracks for a given scenario
export function generateTracksForScenario(scenario: ScenarioDefinition): DroneTrack[] {
  const rand = mulberry32(hashSeed(scenario.seed + '_tracks'));
  const tracks: DroneTrack[] = [];

  const totalObjects = scenario.threatCount + scenario.decoyCount;
  const isSwarm = scenario.swarmActive;
  const swarmId = isSwarm ? 'SWARM-ALPHA' : undefined;

  // Swarm base location & heading if active
  const swarmBaseX = 120 + rand() * 150;
  const swarmBaseY = 150 + rand() * 100;
  const swarmBaseVx = 1.2 + rand() * 0.8;
  const swarmBaseVy = 1.0 + rand() * 0.7;

  for (let i = 0; i < totalObjects; i++) {
    const isDecoy = i >= scenario.threatCount;
    const trackNum = (i + 1).toString().padStart(3, '0');
    const callsign = isDecoy 
      ? `ECHO-${trackNum}` 
      : isSwarm 
        ? `SWARM-${trackNum}` 
        : `TGT-${trackNum}`;

    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;

    if (isSwarm && !isDecoy) {
      // Swarm formation layout (clustered around centroid)
      const angle = (i / scenario.threatCount) * Math.PI * 2;
      const radius = 25 + rand() * 35;
      x = swarmBaseX + Math.cos(angle) * radius;
      y = swarmBaseY + Math.sin(angle) * radius;
      vx = swarmBaseVx + (rand() - 0.5) * 0.3;
      vy = swarmBaseVy + (rand() - 0.5) * 0.3;
    } else {
      // Spread entry angles (usually approaching perimeter from edges)
      const edge = Math.floor(rand() * 4);
      if (edge === 0) { // Top
        x = 150 + rand() * 700;
        y = 50 + rand() * 80;
        vx = (rand() - 0.5) * 1.2;
        vy = 1.0 + rand() * 1.5;
      } else if (edge === 1) { // Left
        x = 60 + rand() * 80;
        y = 150 + rand() * 700;
        vx = 1.0 + rand() * 1.5;
        vy = (rand() - 0.5) * 1.2;
      } else if (edge === 2) { // Right
        x = 880 + rand() * 60;
        y = 150 + rand() * 700;
        vx = -(1.0 + rand() * 1.5);
        vy = (rand() - 0.5) * 1.2;
      } else { // Top-Right corner approach
        x = 800 + rand() * 100;
        y = 80 + rand() * 80;
        vx = -(1.2 + rand() * 1.0);
        vy = 1.2 + rand() * 1.0;
      }
    }

    const altitudeM = Math.round(30 + rand() * 350);
    const speedMps = Math.round(10 + Math.sqrt(vx * vx + vy * vy) * 12);
    const headingDeg = Math.round((Math.atan2(vy, vx) * 180 / Math.PI + 360) % 360);

    // Ground truth definition
    let groundTruth: DroneClassType = 'Small UAV';
    if (isDecoy) {
      groundTruth = rand() > 0.5 ? 'Decoy' : 'Non-threat object';
    } else if (isSwarm) {
      groundTruth = 'Multi-object swarm';
    } else {
      const typeRoll = rand();
      if (typeRoll < 0.55) groundTruth = 'Small UAV';
      else if (typeRoll < 0.85) groundTruth = 'Large UAV';
      else groundTruth = 'Unknown aerial object';
    }

    // AI Classification confidence & distribution
    // Sensor conditions affect baseline confidence
    let baseConfidence = 85 + Math.round(rand() * 12);
    if (scenario.sensorCondition === 'Reduced visibility') baseConfidence -= 18;
    if (scenario.sensorCondition === 'Noisy sensor') baseConfidence -= 25;
    if (scenario.sensorCondition === 'Intermittent sensor') baseConfidence -= 22;
    if (scenario.weather === 'Fog' || scenario.weather === 'Rain') baseConfidence -= 14;
    baseConfidence = Math.max(38, Math.min(96, baseConfidence));

    // Confidence distribution across 6 classes
    const otherConf = (100 - baseConfidence) / 5;
    const confidenceDistribution: Record<DroneClassType, number> = {
      'Small UAV': Math.round(otherConf * (0.8 + rand() * 0.4)),
      'Large UAV': Math.round(otherConf * (0.8 + rand() * 0.4)),
      'Multi-object swarm': Math.round(otherConf * (0.8 + rand() * 0.4)),
      'Unknown aerial object': Math.round(otherConf * (0.8 + rand() * 0.4)),
      'Non-threat object': Math.round(otherConf * (0.8 + rand() * 0.4)),
      'Decoy': Math.round(otherConf * (0.8 + rand() * 0.4)),
    };
    confidenceDistribution[groundTruth] = baseConfidence;

    // Sensor readings per sensor modality
    const eoBase = scenario.timeOfDay === 'Night' || scenario.weather === 'Fog' 
      ? Math.round(30 + rand() * 30) 
      : Math.round(75 + rand() * 20);
    const irBase = Math.round(70 + rand() * 25);
    const radarBase = scenario.sensorCondition === 'Partial sensor failure'
      ? 15
      : scenario.sensorCondition === 'Noisy sensor'
        ? Math.round(45 + rand() * 25)
        : Math.round(85 + rand() * 12);
    const acousticBase = altitudeM > 200 ? Math.round(25 + rand() * 30) : Math.round(65 + rand() * 25);

    const sensors = {
      eo: isDecoy ? Math.round(eoBase * 0.6) : eoBase,
      ir: irBase,
      radar: radarBase,
      acoustic: acousticBase
    };

    // Calculate Sensor Fusion
    const fusedConfidence = Math.round((sensors.eo * 0.25) + (sensors.ir * 0.3) + (sensors.radar * 0.35) + (sensors.acoustic * 0.1));
    const maxSensor = Math.max(sensors.eo, sensors.ir, sensors.radar, sensors.acoustic);
    const minSensor = Math.min(sensors.eo, sensors.ir, sensors.radar, sensors.acoustic);
    const sensorSpread = maxSensor - minSensor;

    let sensorDisagreement: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let disagreementExplanation = 'Sensors in close agreement across optical, RF, and thermal spectra.';
    if (sensorSpread > 45) {
      sensorDisagreement = 'HIGH';
      disagreementExplanation = 'High disparity: Radar indicates solid metallic return while optical/thermal confidence is severely attenuated.';
    } else if (sensorSpread > 25) {
      sensorDisagreement = 'MEDIUM';
      disagreementExplanation = 'Moderate disparity between radar track and acoustic audio confirmation.';
    }

    // Threat Assessment & Explainability
    let threatLevel: ThreatLevel = 'LOW';
    let threatScore = 20;
    const anomalyFactors: DroneTrack['anomalyFactors'] = [];

    if (!isDecoy && groundTruth !== 'Non-threat object') {
      threatScore = 65 + Math.round(rand() * 30);
      anomalyFactors.push({
        factor: 'Direct Approach Vector',
        weight: 30,
        description: 'Track heading directly correlates with Military Restricted Zone perimeter.'
      });
      anomalyFactors.push({
        factor: 'Autonomous Loiter Twitch',
        weight: 25,
        description: 'Micro-corrections indicate waypoint navigation without human remote RF link.'
      });
      if (isSwarm) {
        threatScore = Math.min(98, threatScore + 15);
        anomalyFactors.push({
          factor: 'Coordinated Swarm Kinematics',
          weight: 35,
          description: 'Flocking cohesion index > 0.88 with synchronized evasive spacing.'
        });
      }
      if (sensors.radar > 80 && speedMps > 25) {
        anomalyFactors.push({
          factor: 'High Energy Kinematics',
          weight: 20,
          description: 'Velocity profile exceeds standard civilian consumer quadcopter limits.'
        });
      }
      threatLevel = threatScore >= 75 ? 'HIGH' : 'MEDIUM';
    } else if (isDecoy) {
      threatScore = 40 + Math.round(rand() * 20);
      threatLevel = 'UNCERTAIN';
      anomalyFactors.push({
        factor: 'RCS Fluctuation Inconsistency',
        weight: 30,
        description: 'Radar cross-section exhibits artificial corner-reflector blooming without thermal plume.'
      });
      anomalyFactors.push({
        factor: 'Passive Float Profile',
        weight: 20,
        description: 'Drifting with ambient wind vector; minimal active motor acoustic signature.'
      });
    } else {
      // Non-threat (e.g. bird or civilian delivery)
      threatScore = 15 + Math.round(rand() * 15);
      threatLevel = 'LOW';
      anomalyFactors.push({
        factor: 'Biological/Civilian Bio-signature',
        weight: 15,
        description: 'Acoustic harmonics show wing-beat or standard broadcast FAA Remote ID transponder beacon.'
      });
    }

    tracks.push({
      id: `TRK-${trackNum}`,
      callsign,
      x,
      y,
      altitudeM,
      vx,
      vy,
      headingDeg,
      speedMps,
      history: [[x - vx * 10, y - vy * 10], [x - vx * 5, y - vy * 5], [x, y]],
      groundTruth,
      aiClassification: groundTruth,
      classificationConfidence: baseConfidence,
      confidenceDistribution,
      shapeSignature: isSwarm 
        ? 'Distributed Distributed Nodes (8-12 units)' 
        : isDecoy 
          ? 'Passive Foil Reflector / Micro-Balloon' 
          : groundTruth === 'Large UAV'
            ? 'Fixed-Wing Carbon Composite (2.4m Wingspan)'
            : groundTruth === 'Non-threat object'
              ? 'Civilian Quad-Rotor / Avian Wildlife'
              : 'Class-1 Quad-Rotor (0.4m Diameter)',
      motionPattern: isSwarm 
        ? 'Flocking formation with dynamic centroid shifts' 
        : isDecoy 
          ? 'Linear drift with ambient wind deflection' 
          : 'Waypoint navigation with defensive terrain masking',
      speedCategory: speedMps > 35 ? 'High (>35 m/s)' : speedMps > 15 ? 'Medium (15-35 m/s)' : 'Low (<15 m/s)',
      altitudeCategory: altitudeM > 200 ? 'Medium (>200m)' : altitudeM > 50 ? 'Low (50-200m)' : 'Ultra-low (<50m)',
      trajectoryPattern: `Vector heading ${headingDeg}° towards Sector Bravo / Perimeter`,
      threatLevel,
      threatScore,
      anomalyFactors,
      isRestrictedZoneApproach: threatLevel === 'HIGH' || threatLevel === 'MEDIUM',
      isDecoy,
      isNonThreat: groundTruth === 'Non-threat object',
      sensors,
      fusedConfidence,
      sensorDisagreement,
      disagreementExplanation,
      swarmId,
      swarmRole: isSwarm ? (i === 0 ? 'Lead' : i % 2 === 0 ? 'Flanker' : 'Follower') : undefined,
      detectionTimeSec: 0,
      status: 'DETECTED'
    });
  }

  return tracks;
}

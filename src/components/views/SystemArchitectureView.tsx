import React, { useState } from 'react';
import { 
  Cpu, 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Compass, 
  ChevronRight,
  ExternalLink,
  Play,
  CheckCircle2,
  Sliders,
  HelpCircle,
  FileCode,
  Download
} from 'lucide-react';

interface ArchBlock {
  id: string;
  name: string;
  category: 'GENERATION' | 'SENSING' | 'AI_CORE' | 'DECISION' | 'ADAPTIVE';
  description: string;
  inputs: string[];
  outputs: string[];
  technologies: string[];
  mlIntegrationPath: string;
  testFunction: string;
}

const ARCH_BLOCKS: ArchBlock[] = [
  {
    id: 'SCENARIO_GENERATOR',
    name: '1. Procedural Scenario Generator',
    category: 'GENERATION',
    description: 'Deterministic Mulberry32 PRNG seed engine producing reproducible environmental, weather, and adversarial threat configurations.',
    inputs: ['Seed string', 'Difficulty tier (1-5)', 'Sector terrain tags'],
    outputs: ['JSON scenario manifest', 'Initial kinematic vectors', 'Decoy ratios'],
    technologies: ['Mulberry32 PRNG', 'JSON Schema validation'],
    mlIntegrationPath: 'Can integrate Generative Adversarial Networks (GANs) or LLM scenario synthesizers.',
    testFunction: 'Run Seed Permutation Test (Mulberry32 PRNG)'
  },
  {
    id: 'SIMULATION_ENV',
    name: '2. Virtual Airspace Environment',
    category: 'GENERATION',
    description: 'Coordinate-space 2D/3D physics arena modeling terrain elevation, restricted perimeters, and atmospheric drag.',
    inputs: ['Terrain geometry', 'Wind disturbance vector', 'Lighting coefficients'],
    outputs: ['Spatial coordinates (0-1000)', 'Line-of-sight occlusion masks'],
    technologies: ['HTML5 Canvas 2D', 'Vector trigonometry', 'Three.js WebGL'],
    mlIntegrationPath: 'Plug-in ready for NVIDIA Omniverse or Unreal Engine 5 headless telemetry stream.',
    testFunction: 'Simulate 3D Airspace Hemispherical Grid & Wind Drag'
  },
  {
    id: 'SWARM_BEHAVIOUR',
    name: '3. Virtual Drone & Swarm Engine',
    category: 'GENERATION',
    description: 'B-oids flocking dynamics implementing cohesion, separation, and alignment for autonomous multi-agent drone swarms.',
    inputs: ['Target waypoints', 'Inter-agent distance constraints', 'Evasion triggers'],
    outputs: ['Heading velocities', 'Swarm centroid coordinate', 'Dispersion index'],
    technologies: ['Reynolds Flocking Algorithm', 'Markovian waypoint twitch'],
    mlIntegrationPath: 'Multi-Agent Reinforcement Learning (MARL) policy integration via ONNX Runtime.',
    testFunction: 'Calculate Reynolds Flocking Cohesion & Centroid Shift'
  },
  {
    id: 'SIMULATED_SENSORS',
    name: '4. Simulated Multi-Spectral Sensors',
    category: 'SENSING',
    description: 'Electro-Optical (EO), Infrared (IR), 360° Radar, and Acoustic arrays with simulated atmospheric noise and partial degradation.',
    inputs: ['Drone physical cross-section', 'Atmospheric fog/rain density', 'Sensor health %'],
    outputs: ['Noisy synthetic returns', 'Range-Doppler profiles', 'Thermal plume readings'],
    technologies: ['Gaussian noise injection', 'Beer-Lambert optical attenuation'],
    mlIntegrationPath: 'Synthetic Aperture Radar (SAR) simulation models.',
    testFunction: 'Inject Gaussian Noise & Test Degraded RF Telemetry'
  },
  {
    id: 'AI_DETECTION',
    name: '5. AI Object Detection Layer',
    category: 'AI_CORE',
    description: 'Continuous spatial scanning identifying anomalous airborne entities against background clutter.',
    inputs: ['Sensor telemetry streams', 'Restricted zone threshold alerts'],
    outputs: ['Track bounding reticles', 'Kinematic histories', 'Initial detection timestamp'],
    technologies: ['Spatial Clustering (DBSCAN)', 'Kalman Filtering'],
    mlIntegrationPath: 'YOLOv10 / RT-DETR PyTorch microservice container.',
    testFunction: 'Execute Kalman Filter Bounding Reticle Lock'
  },
  {
    id: 'AI_CLASSIFICATION',
    name: '6. AI Threat Classification',
    category: 'AI_CORE',
    description: 'Multi-class classification identifying Small UAV, Large UAV, Swarms, Decoys, and Avian Wildlife with probability distribution.',
    inputs: ['Kinematic signature', 'Speed / Altitude bands', 'RCS fluctuation'],
    outputs: ['Class probabilities (6 classes)', 'Top-1 confidence score'],
    technologies: ['Softmax probability distribution', 'Feature vector heuristic'],
    mlIntegrationPath: 'Convolutional ResNet-50 / Time-series LSTM trained on synthetic micro-Doppler radar signatures.',
    testFunction: 'Run 6-Class Softmax Neural Probability Inference'
  },
  {
    id: 'SENSOR_FUSION',
    name: '7. Multi-Sensor Fusion Layer',
    category: 'AI_CORE',
    description: 'Weighted Dempster-Shafer evidential reasoning combining optical, thermal, RF, and acoustic data to calculate unified confidence.',
    inputs: ['EO %, IR %, Radar %, Acoustic %', 'Sensor disagreement spread'],
    outputs: ['Fused confidence score', 'Disagreement index (Low/Med/High)'],
    technologies: ['Weighted Evidential Fusion', 'Discrepancy anomaly detector'],
    mlIntegrationPath: 'Bayesian Fusion Network / Transformer-based multi-modal fusion.',
    testFunction: 'Compute Dempster-Shafer Multi-Spectral Evidential Fusion'
  },
  {
    id: 'THREAT_ASSESSMENT',
    name: '8. Explainable Threat Assessment',
    category: 'AI_CORE',
    description: 'Factor-based transparent risk scoring engine calculating Threat Level (Low, Medium, High, Uncertain) with human-readable rationale.',
    inputs: ['Fused confidence', 'Perimeter proximity', 'Loiter vector twitch'],
    outputs: ['Threat score (0-100)', 'Itemized anomaly factors list'],
    technologies: ['Explainable AI (XAI) feature attribution', 'Weighted risk tree'],
    mlIntegrationPath: 'SHAP (SHapley Additive exPlanations) values computed from deep models.',
    testFunction: 'Synthesize Additive XAI Risk Factors & SHAP Attribution'
  },
  {
    id: 'TRAINEE_DECISION',
    name: '9. Trainee Decision Engine',
    category: 'DECISION',
    description: 'Safe predefined operational choice interface ensuring personnel follow standardized defence Rules of Engagement without live weapons.',
    inputs: ['Trainee selection (1 of 6 choices)', 'Decision timestamp'],
    outputs: ['Action log item', 'Escalation state update'],
    technologies: ['Finite State Machine (FSM)', 'Doctrinal ROE matrix'],
    mlIntegrationPath: 'Natural language speech-to-text input with prompt evaluation.',
    testFunction: 'Verify ROE Safe Operational Protocol Finite State Machine'
  },
  {
    id: 'DECISION_SCORING',
    name: '10. Decision-Tree Scoring Engine',
    category: 'DECISION',
    description: 'Transparent evaluation comparing trainee action against ground truth and situational context with explicit positive/negative points.',
    inputs: ['Trainee action', 'Ground truth', 'Sensor disagreement state'],
    outputs: ['Score delta (±PTS)', 'Evaluation quality (Optimal / Breach)', 'Rationale log'],
    technologies: ['Rule-based decision tree', 'Penalty attribution system'],
    mlIntegrationPath: 'Expert system benchmarked against DSSC instructor standard logs.',
    testFunction: 'Run Transparent Decision-Tree Scoring Evaluation'
  },
  {
    id: 'AAR_MODULE',
    name: '11. After-Action Review (AAR)',
    category: 'DECISION',
    description: 'Automated debrief generation showing what happened, what trainee decided, what simulator expected, why, and how to improve.',
    inputs: ['Full mission event timeline', 'Final scoring breakdown'],
    outputs: ['Interactive replay timeline', 'Doctrinal remediation advice'],
    technologies: ['Chronological event indexing', 'Comparative debrief generator'],
    mlIntegrationPath: 'LLM tactical debrief narrator generating voice/text summary.',
    testFunction: 'Generate Automated Cognitive Mission Debrief'
  },
  {
    id: 'PERFORMANCE_ANALYTICS',
    name: '12. Performance Analytics & Digital Twin',
    category: 'ADAPTIVE',
    description: 'Persistent cognitive profile tracking reaction latency, false alarm tendencies, and 2D Scenario Type × Skill heatmap.',
    inputs: ['Session scores', 'Skill benchmarks', 'Historical session store'],
    outputs: ['Skill radar bars', '2D Heatmap matrix', 'Weakness/Strength flags'],
    technologies: ['Cumulative statistical modeling', 'LocalStorage persistence'],
    mlIntegrationPath: 'Bayesian Knowledge Tracing (BKT) student model.',
    testFunction: 'Update Trainee Cognitive Digital Twin & Heatmap Matrix'
  },
  {
    id: 'ADAPTIVE_ENGINE',
    name: '13. Adaptive Difficulty Engine',
    category: 'ADAPTIVE',
    description: 'Reinforcement feedback loop adjusting subsequent scenario parameters to target observed friction points and accelerate learning.',
    inputs: ['Trainee weakest area', 'Recent session trend', 'Target level (1-5)'],
    outputs: ['Next scenario seed', 'Calibrated environmental stress flags'],
    technologies: ['Zone of Proximal Development (ZPD) heuristic', 'Adaptive thresholding'],
    mlIntegrationPath: 'Deep Q-Learning adaptive curriculum sequencer.',
    testFunction: 'Execute Reinforcement Learning Difficulty Calibration'
  }
];

export const SystemArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATASET_CATALOG'>('ARCHITECTURE');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('SCENARIO_GENERATOR');
  const [testOutput, setTestOutput] = useState<{ blockId: string; result: string; timestamp: string } | null>(null);

  const selectedBlock = ARCH_BLOCKS.find(b => b.id === selectedBlockId) || ARCH_BLOCKS[0];

  // Live stage execution simulation
  const handleExecuteLiveTest = (block: ArchBlock) => {
    const ts = new Date().toLocaleTimeString();
    let res = '';

    if (block.id === 'SCENARIO_GENERATOR') {
      res = `[EXECUTE SUCCESS]: Mulberry32 PRNG generated seed "SG-TEST-8492". Hash: 0x4F12A8. Output: 8-node swarm + 2 passive decoys under Fog conditions.`;
    } else if (block.id === 'SIMULATED_SENSORS') {
      res = `[EXECUTE SUCCESS]: Gaussian noise injected (σ = 4.2 dB). Primary Radar attenuated by 32%; EO optic contrast down to 45% due to simulated fog.`;
    } else if (block.id === 'AI_CLASSIFICATION') {
      res = `[EXECUTE SUCCESS]: Softmax inference computed across 6 classes: Small UAV (84.2%), Decoy (6.1%), Bird (4.0%), Swarm (3.2%), Large UAV (1.5%), Unknown (1.0%). Top-1 Confidence: 84.2%.`;
    } else if (block.id === 'SENSOR_FUSION') {
      res = `[EXECUTE SUCCESS]: Dempster-Shafer evidential weights: EO (25%), IR (30%), Radar (35%), Acoustic (10%). Fused Confidence = 88.4%. Sensor Disagreement Spread = LOW (12%).`;
    } else if (block.id === 'THREAT_ASSESSMENT') {
      res = `[EXECUTE SUCCESS]: Factor attribution computed: Direct Approach Vector (+30 pts), Autonomous Loiter (+25 pts), RCS Anomaly (+15 pts). Abstract Risk Score: 78/100 (HIGH THREAT).`;
    } else if (block.id === 'ADAPTIVE_ENGINE') {
      res = `[EXECUTE SUCCESS]: Trainee proficiency evaluated at Level 3 (+2.8%). Adaptive Engine elevated difficulty to Level 4; scheduled night fog swarm drill with intermittent jamming.`;
    } else {
      res = `[EXECUTE SUCCESS]: Stage "${block.name}" verified operational. Synthetic telemetry verified non-kinetic with cryptographic hash.`;
    }

    setTestOutput({ blockId: block.id, result: res, timestamp: ts });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              SYSTEM ARCHITECTURE & DEFENSE ML DATA ENGINE
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-tactical-accent border border-teal-500/30">
              13-STAGE FUNCTIONAL PIPELINE
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            Interactive system architecture, live stage execution tests, and synthetic defense dataset schemas for DSSC personnel.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-tactical-card p-1 rounded-lg border border-tactical-border text-xs">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'ARCHITECTURE' ? 'bg-tactical-primary text-black' : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            PIPELINE ARCHITECTURE
          </button>
          <button
            onClick={() => setActiveTab('DATASET_CATALOG')}
            className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'DATASET_CATALOG' ? 'bg-tactical-accent text-black' : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DATASET SPECIFICATIONS</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 13-STAGE ARCHITECTURE WITH FUNCTIONAL TESTING */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Interactive Architecture Diagram Flow (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
              <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                <span>PIPELINE DATA FLOW DIAGRAM</span>
                <span className="text-[10px] text-tactical-accent">CLICK ANY STAGE TO INSPECT & RUN</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {ARCH_BLOCKS.map((blk, idx) => {
                  const isSelected = blk.id === selectedBlock.id;
                  let catBadge = 'bg-slate-800 text-slate-300';
                  if (blk.category === 'AI_CORE') catBadge = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
                  else if (blk.category === 'DECISION') catBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                  else if (blk.category === 'ADAPTIVE') catBadge = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';

                  return (
                    <div key={blk.id}>
                      <button
                        onClick={() => setSelectedBlockId(blk.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-tactical-card border-tactical-primary text-white shadow-glow-green'
                            : 'bg-[#090e17] border-tactical-border text-tactical-textNormal hover:border-tactical-borderLight'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center text-tactical-primary shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs truncate">{blk.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${catBadge}`}>
                            {blk.category}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-tactical-primary' : 'text-tactical-textMuted'}`} />
                        </div>
                      </button>

                      {idx < ARCH_BLOCKS.length - 1 && (
                        <div className="w-0.5 h-2 bg-tactical-border mx-auto my-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Selected Block Deep Dive & Interactive Functional Execution (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-tactical-surface border border-tactical-border rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
                <span className="text-xs text-tactical-primary font-bold uppercase tracking-wider">
                  STAGE SPECIFICATION & LIVE EXECUTION
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-white font-bold">
                  {selectedBlock.category}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">{selectedBlock.name}</h2>
                <p className="text-xs text-tactical-textMuted mt-1 leading-relaxed">
                  {selectedBlock.description}
                </p>
              </div>

              {/* Functional Test Button */}
              <div className="p-3 rounded-lg bg-[#090e17] border border-tactical-primary/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-tactical-primary" />
                    LIVE PIPELINE STAGE TEST
                  </span>
                  <button
                    onClick={() => handleExecuteLiveTest(selectedBlock)}
                    className="px-3 py-1 rounded bg-tactical-primary text-black font-extrabold text-[11px] shadow-glow-green hover:bg-tactical-primaryDark transition-all"
                  >
                    RUN STAGE INFERENCE
                  </button>
                </div>

                {testOutput && testOutput.blockId === selectedBlock.id ? (
                  <div className="p-2.5 rounded bg-[#060a12] border border-tactical-border font-mono text-[11px] text-tactical-primary leading-relaxed">
                    <div className="text-[9px] text-tactical-textMuted mb-0.5">Execution Log at {testOutput.timestamp}:</div>
                    {testOutput.result}
                  </div>
                ) : (
                  <div className="text-[10px] text-tactical-textMuted italic">
                    Click "RUN STAGE INFERENCE" to execute this pipeline node interactively.
                  </div>
                )}
              </div>

              {/* Inputs & Outputs */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-textMuted font-bold block mb-1">INPUT SIGNALS</span>
                  <ul className="list-disc list-inside text-white space-y-0.5 text-[11px]">
                    {selectedBlock.inputs.map((inp, i) => (
                      <li key={i}>{inp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-accent font-bold block mb-1">OUTPUT TELEMETRY</span>
                  <ul className="list-disc list-inside text-white space-y-0.5 text-[11px]">
                    {selectedBlock.outputs.map((out, i) => (
                      <li key={i}>{out}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded bg-[#090e17] border border-tactical-border">
                  <span className="text-[10px] text-tactical-primary font-bold block mb-1">PROTOTYPE ALGORITHMS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBlock.technologies.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-tactical-card border border-tactical-border text-tactical-textNormal text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-purple-950/20 border border-purple-500/30 text-purple-200">
                  <span className="text-[10px] text-purple-400 font-bold block mb-0.5">FUTURE ML / AI UPGRADE PATH</span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedBlock.mlIntegrationPath}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATASET SPECIFICATIONS & FAQ */}
      {activeTab === 'DATASET_CATALOG' && (
        <div className="space-y-4">
          {/* Main Answer to User Question */}
          <div className="p-4 rounded-lg bg-tactical-surface border border-tactical-primary/50 space-y-2 text-xs shadow-glow-green">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Database className="w-4 h-4 text-tactical-primary" />
              <span>IS AN EXTERNAL DATASET REQUIRED TO RUN SKYGUARD?</span>
            </div>
            <p className="text-tactical-textNormal text-xs leading-relaxed">
              <strong className="text-tactical-primary">NO external dataset download or API is required for this prototype.</strong>{' '}
              SKYGUARD is built with a self-contained <strong>Synthetic Procedural Physics & Kinematics Engine</strong>. It deterministically generates high-fidelity radar cross-sections, micro-Doppler time-series returns, 3D B-oids flocking dynamics, FLIR thermal blooms, and acoustic blade pass frequency (BPF) harmonics on-the-fly entirely in-memory.
            </p>
            <p className="text-tactical-textMuted text-[11px] leading-relaxed">
              This guarantees that the platform operates <strong>100% offline, air-gapped, and with zero external dependencies</strong>, adhering to Ministry of Defence security standards.
            </p>
          </div>

          {/* Planned Synthetic Defense Datasets for Future Production Model Training */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="font-bold text-white text-xs">
                FUTURE PRODUCTION ML BENCHMARK DATASETS (BUILT-IN SPECIFICATIONS)
              </span>
              <span className="text-tactical-accent text-[10px] font-bold">5 DEFENSE MODALITIES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  RF / RADAR
                </span>
                <div className="font-bold text-white text-xs">DSSC-SYNTH-RADAR-10K</div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  10,000 synthetic micro-Doppler radar signatures (X-band 9.4 GHz) modeling rotor RPM, blade count, and RCS fluctuation across quadcopters and fixed-wing UAVs.
                </p>
                <div className="text-[10px] text-tactical-primary">Format: HDF5 / NumPy Spectrograms</div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  COMPUTER VISION
                </span>
                <div className="font-bold text-white text-xs">DSSC-OPTICAL-YOLO-8K</div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  8,500 annotated electro-optical frames capturing small drones against urban clutter, mountain skyboxes, and low-altitude bird decoys.
                </p>
                <div className="text-[10px] text-tactical-primary">Format: YOLOv10 Darknet Annotations</div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  INFRARED FLIR
                </span>
                <div className="font-bold text-white text-xs">DSSC-FLIR-THERMAL-5K</div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  5,000 calibrated Long-Wave Infrared (LWIR 8-14μm) thermal images capturing electric motor coil friction (65°C-78°C) and battery core dissipation.
                </p>
                <div className="text-[10px] text-tactical-primary">Format: 16-bit Grayscale TIFF & Ironbow</div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ACOUSTIC ARRAY
                </span>
                <div className="font-bold text-white text-xs">DSSC-ACOUSTIC-BPF-4K</div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  4,200 acoustic WAV samples capturing blade pass frequencies (200Hz - 1200Hz) to discriminate multi-rotor whine from wind and wildlife.
                </p>
                <div className="text-[10px] text-tactical-primary">Format: 48kHz / 24-bit PCM WAV</div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  COGNITIVE LOGS
                </span>
                <div className="font-bold text-white text-xs">DSSC-TRAINEE-TRACE-1K</div>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  1,200 longitudinal decision trace logs recording trainee reaction latency, false alarm triggers, and ROE compliance for adaptive modeling.
                </p>
                <div className="text-[10px] text-tactical-primary">Format: JSON Lines (JSONL)</div>
              </div>

              <div className="p-3 rounded-lg bg-tactical-card border border-tactical-primary/40 flex flex-col justify-between">
                <div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-tactical-primary border border-emerald-500/30">
                    BENCHMARK READY
                  </span>
                  <div className="font-bold text-white text-xs mt-1">Export Synthetic Benchmark Schema</div>
                  <p className="text-[11px] text-tactical-textMuted mt-1">
                    Download sample JSON data telemetry format for testing local PyTorch/ONNX ML models.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const sampleData = {
                      dataset: "DSSC-SYNTH-RADAR-10K",
                      trackId: "TRK-001",
                      rcsDbsm: -15.4,
                      dopplerFreqHz: 340.2,
                      speedMps: 24.8,
                      altitudeM: 120,
                      harmonics: [340, 680, 1020],
                      groundTruth: "Small UAV (Quadcopter)",
                      watermark: "AIRSPACE-SIM-26247-SYNTHETIC"
                    };
                    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "dssc_synthetic_sample_schema.json";
                    a.click();
                  }}
                  className="mt-2 w-full py-1.5 rounded bg-tactical-primary/20 text-tactical-primary border border-tactical-primary/40 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-tactical-primary/30"
                >
                  <Download className="w-3 h-3" />
                  <span>DOWNLOAD SAMPLE JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

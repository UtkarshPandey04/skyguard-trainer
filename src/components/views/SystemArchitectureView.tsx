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
  ExternalLink
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
    mlIntegrationPath: 'Can integrate Generative Adversarial Networks (GANs) or LLM scenario synthesizers.'
  },
  {
    id: 'SIMULATION_ENV',
    name: '2. Virtual Airspace Environment',
    category: 'GENERATION',
    description: 'Coordinate-space 2D/3D physics arena modeling terrain elevation, restricted perimeters, and atmospheric drag.',
    inputs: ['Terrain geometry', 'Wind disturbance vector', 'Lighting coefficients'],
    outputs: ['Spatial coordinates (0-1000)', 'Line-of-sight occlusion masks'],
    technologies: ['HTML5 Canvas 2D', 'Vector trigonometry'],
    mlIntegrationPath: 'Plug-in ready for NVIDIA Omniverse or Unreal Engine 5 headless telemetry stream.'
  },
  {
    id: 'SWARM_BEHAVIOUR',
    name: '3. Virtual Drone & Swarm Engine',
    category: 'GENERATION',
    description: 'B-oids flocking dynamics implementing cohesion, separation, and alignment for autonomous multi-agent drone swarms.',
    inputs: ['Target waypoints', 'Inter-agent distance constraints', 'Evasion triggers'],
    outputs: ['Heading velocities', 'Swarm centroid coordinate', 'Dispersion index'],
    technologies: ['Reynolds Flocking Algorithm', 'Markovian waypoint twitch'],
    mlIntegrationPath: 'Multi-Agent Reinforcement Learning (MARL) policy integration via ONNX Runtime.'
  },
  {
    id: 'SIMULATED_SENSORS',
    name: '4. Simulated Multi-Spectral Sensors',
    category: 'SENSING',
    description: 'Electro-Optical (EO), Infrared (IR), 360° Radar, and Acoustic arrays with simulated atmospheric noise and partial degradation.',
    inputs: ['Drone physical cross-section', 'Atmospheric fog/rain density', 'Sensor health %'],
    outputs: ['Noisy synthetic returns', 'Range-Doppler profiles', 'Thermal plume readings'],
    technologies: ['Gaussian noise injection', 'Beer-Lambert optical attenuation'],
    mlIntegrationPath: 'Synthetic Aperture Radar (SAR) simulation models.'
  },
  {
    id: 'AI_DETECTION',
    name: '5. AI Object Detection Layer',
    category: 'AI_CORE',
    description: 'Continuous spatial scanning identifying anomalous airborne entities against background clutter.',
    inputs: ['Sensor telemetry streams', 'Restricted zone threshold alerts'],
    outputs: ['Track bounding reticles', 'Kinematic histories', 'Initial detection timestamp'],
    technologies: ['Spatial Clustering (DBSCAN)', 'Kalman Filtering'],
    mlIntegrationPath: 'YOLOv10 / RT-DETR PyTorch microservice container.'
  },
  {
    id: 'AI_CLASSIFICATION',
    name: '6. AI Threat Classification',
    category: 'AI_CORE',
    description: 'Multi-class classification identifying Small UAV, Large UAV, Swarms, Decoys, and Avian Wildlife with probability distribution.',
    inputs: ['Kinematic signature', 'Speed / Altitude bands', 'RCS fluctuation'],
    outputs: ['Class probabilities (6 classes)', 'Top-1 confidence score'],
    technologies: ['Softmax probability distribution', 'Feature vector heuristic'],
    mlIntegrationPath: 'Convolutional ResNet-50 / Time-series LSTM trained on synthetic micro-Doppler radar signatures.'
  },
  {
    id: 'SENSOR_FUSION',
    name: '7. Multi-Sensor Fusion Layer',
    category: 'AI_CORE',
    description: 'Weighted Dempster-Shafer evidential reasoning combining optical, thermal, RF, and acoustic data to calculate unified confidence.',
    inputs: ['EO %, IR %, Radar %, Acoustic %', 'Sensor disagreement spread'],
    outputs: ['Fused confidence score', 'Disagreement index (Low/Med/High)'],
    technologies: ['Weighted Evidential Fusion', 'Discrepancy anomaly detector'],
    mlIntegrationPath: 'Bayesian Fusion Network / Transformer-based multi-modal fusion.'
  },
  {
    id: 'THREAT_ASSESSMENT',
    name: '8. Explainable Threat Assessment',
    category: 'AI_CORE',
    description: 'Factor-based transparent risk scoring engine calculating Threat Level (Low, Medium, High, Uncertain) with human-readable rationale.',
    inputs: ['Fused confidence', 'Perimeter proximity', 'Loiter vector twitch'],
    outputs: ['Threat score (0-100)', 'Itemized anomaly factors list'],
    technologies: ['Explainable AI (XAI) feature attribution', 'Weighted risk tree'],
    mlIntegrationPath: 'SHAP (SHapley Additive exPlanations) values computed from deep models.'
  },
  {
    id: 'TRAINEE_DECISION',
    name: '9. Trainee Decision Engine',
    category: 'DECISION',
    description: 'Safe predefined operational choice interface ensuring personnel follow standardized defence Rules of Engagement without live weapons.',
    inputs: ['Trainee selection (1 of 6 choices)', 'Decision timestamp'],
    outputs: ['Action log item', 'Escalation state update'],
    technologies: ['Finite State Machine (FSM)', 'Doctrinal ROE matrix'],
    mlIntegrationPath: 'Natural language speech-to-text input with prompt evaluation.'
  },
  {
    id: 'DECISION_SCORING',
    name: '10. Decision-Tree Scoring Engine',
    category: 'DECISION',
    description: 'Transparent evaluation comparing trainee action against ground truth and situational context with explicit positive/negative points.',
    inputs: ['Trainee action', 'Ground truth', 'Sensor disagreement state'],
    outputs: ['Score delta (±PTS)', 'Evaluation quality (Optimal / Breach)', 'Rationale log'],
    technologies: ['Rule-based decision tree', 'Penalty attribution system'],
    mlIntegrationPath: 'Expert system benchmarked against DSSC instructor standard logs.'
  },
  {
    id: 'AAR_MODULE',
    name: '11. After-Action Review (AAR)',
    category: 'DECISION',
    description: 'Automated debrief generation showing what happened, what trainee decided, what simulator expected, why, and how to improve.',
    inputs: ['Full mission event timeline', 'Final scoring breakdown'],
    outputs: ['Interactive replay timeline', 'Doctrinal remediation advice'],
    technologies: ['Chronological event indexing', 'Comparative debrief generator'],
    mlIntegrationPath: 'LLM tactical debrief narrator generating voice/text summary.'
  },
  {
    id: 'PERFORMANCE_ANALYTICS',
    name: '12. Performance Analytics & Digital Twin',
    category: 'ADAPTIVE',
    description: 'Persistent cognitive profile tracking reaction latency, false alarm tendencies, and 2D Scenario Type × Skill heatmap.',
    inputs: ['Session scores', 'Skill benchmarks', 'Historical session store'],
    outputs: ['Skill radar bars', '2D Heatmap matrix', 'Weakness/Strength flags'],
    technologies: ['Cumulative statistical modeling', 'LocalStorage persistence'],
    mlIntegrationPath: 'Bayesian Knowledge Tracing (BKT) student model.'
  },
  {
    id: 'ADAPTIVE_ENGINE',
    name: '13. Adaptive Difficulty Engine',
    category: 'ADAPTIVE',
    description: 'Reinforcement feedback loop adjusting subsequent scenario parameters to target observed friction points and accelerate learning.',
    inputs: ['Trainee weakest area', 'Recent session trend', 'Target level (1-5)'],
    outputs: ['Next scenario seed', 'Calibrated environmental stress flags'],
    technologies: ['Zone of Proximal Development (ZPD) heuristic', 'Adaptive thresholding'],
    mlIntegrationPath: 'Deep Q-Learning adaptive curriculum sequencer.'
  }
];

export const SystemArchitectureView: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('SCENARIO_GENERATOR');
  const selectedBlock = ARCH_BLOCKS.find(b => b.id === selectedBlockId) || ARCH_BLOCKS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-tactical-bg p-5 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-tactical-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-tactical-primary" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              SYSTEM ARCHITECTURE & METHODOLOGY
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-tactical-accent border border-teal-500/30">
              REQS #21 & #22
            </span>
          </div>
          <p className="text-xs text-tactical-textMuted mt-1">
            End-to-end pipeline design combining computer vision, evidential sensor fusion, procedural threat synthesis, and explainable AI.
          </p>
        </div>

        {/* Tag */}
        <div className="flex items-center gap-2 text-xs bg-tactical-card px-3 py-1.5 rounded-lg border border-tactical-border">
          <Database className="w-3.5 h-3.5 text-tactical-primary" />
          <span className="text-white font-bold">13 INTERCONNECTED MODULES</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Architecture Diagram Flow (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4">
            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
              <span>PIPELINE DATA FLOW DIAGRAM</span>
              <span className="text-[10px] text-tactical-accent">CLICK ANY STAGE TO INSPECT ROLE</span>
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

        {/* Right: Selected Block Deep Dive & Research Methodology (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Block Deep Dive Card */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-tactical-border">
              <span className="text-xs text-tactical-primary font-bold uppercase tracking-wider">
                STAGE SPECIFICATION & ML INTEGRATION
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

          {/* Research & Methodology Panel */}
          <div className="bg-tactical-surface border border-tactical-border rounded-lg p-4 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5 pb-2 border-b border-tactical-border">
              <BookOpen className="w-3.5 h-3.5 text-tactical-primary" />
              <span>RESEARCH & METHODOLOGY FRAMEWORK</span>
            </div>

            <p className="text-[11px] text-tactical-textMuted leading-relaxed">
              SKYGUARD is architected according to principles established in cognitive defense simulation:
            </p>

            <div className="space-y-1 text-[11px] text-tactical-textNormal">
              <div>• Computer Vision & Kinematic Micro-Doppler Feature Extraction</div>
              <div>• Dempster-Shafer Multi-Spectral Evidential Sensor Fusion</div>
              <div>• Procedural Scenario Synthesis for Cognitive Desensitization Prevention</div>
              <div>• Explainable Artificial Intelligence (XAI) Attribution for Staff Officers</div>
              <div>• Zone of Proximal Development (ZPD) Adaptive Training Feedback Loop</div>
            </div>

            {/* Verified reference notice */}
            <div className="pt-2 text-[10px] text-tactical-amber italic">
              Notice: Research references to be populated with verified peer-reviewed DSSC defence publications upon system induction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

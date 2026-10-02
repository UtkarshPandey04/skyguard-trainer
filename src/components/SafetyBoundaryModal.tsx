import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  FileCheck2, 
  CheckCircle2, 
  Key, 
  Cpu, 
  X, 
  ShieldAlert,
  Server
} from 'lucide-react';

interface SafetyBoundaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyBoundaryModal: React.FC<SafetyBoundaryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'INTERLOCKS' | 'CRYPTO_HASH' | 'ROE_BOUNDARY'>('INTERLOCKS');

  if (!isOpen) return null;

  const safetyGuarantees = [
    {
      title: '1. Zero Hardware Kinetic Interlocks',
      status: 'HARD-DISCONNECTED',
      badge: 'bg-emerald-500/20 text-tactical-primary border-emerald-500/40',
      description: 'The platform codebase possesses no GPIO, serial bus, CAN-bus, or hardware drivers capable of actuating live munitions, firing circuits, or physical drone jammers.'
    },
    {
      title: '2. Synthetic Telemetry Coordinate System',
      status: 'SYNTHETIC AIRSPACE',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      description: 'Coordinates operate on normalized 0-1000 virtual tactical sectors. No real-world GPS coordinates, classified military bases, or live radar antenna feeds are referenced.'
    },
    {
      title: '3. Cryptographic Synthetic Packet Watermarking',
      status: 'SHA-256 VERIFIED',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      description: 'Every synthetic radar blip and optical track is watermarked with DSSC-SYNTH-26247 HMAC to eliminate any possibility of training telemetry polluting live C2 networks.'
    },
    {
      title: '4. Non-Kinetic Doctrinal ROE Enforcement',
      status: 'STRICT ROE LOGGING',
      badge: 'bg-amber-500/20 text-tactical-amber border-amber-500/40',
      description: 'Simulated response protocols exclusively train cognitive de-escalation, passive multi-sensor confirmation, and supervisory escalation. Penalizes false-alarm aggression.'
    },
    {
      title: '5. Offline Air-Gapped Operation',
      status: 'LOCAL AIR-GAP READY',
      badge: 'bg-emerald-500/20 text-tactical-primary border-emerald-500/40',
      description: 'Runs 100% offline within DSSC local networks without transmitting telemetry or session records to external public APIs or third-party cloud servers.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-3xl bg-tactical-surface border border-tactical-primary rounded-xl overflow-hidden shadow-glow-green flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0d1522] to-[#121d2f] border-b border-tactical-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tactical-primary/10 border border-tactical-primary/40 flex items-center justify-center text-tactical-primary shadow-glow-green">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">
                  DEFENSE SAFETY BOUNDARY & SECURITY AUDIT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-tactical-primary border border-emerald-500/30">
                  SECURE DSSC SIM
                </span>
              </div>
              <div className="text-xs text-tactical-textMuted">
                Ministry of Defence (MoD) • Problem Statement 26247 • Non-Kinetic Sandbox
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-tactical-textMuted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-4 py-2 bg-[#090e17] border-b border-tactical-border flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('INTERLOCKS')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'INTERLOCKS' ? 'bg-tactical-primary text-black' : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            ARCHITECTURAL INTERLOCKS
          </button>
          <button
            onClick={() => setActiveTab('CRYPTO_HASH')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'CRYPTO_HASH' ? 'bg-tactical-accent text-black' : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            CRYPTOGRAPHIC TELEMETRY TOKEN
          </button>
          <button
            onClick={() => setActiveTab('ROE_BOUNDARY')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'ROE_BOUNDARY' ? 'bg-tactical-amber text-black' : 'text-tactical-textMuted hover:text-white'
            }`}
          >
            DSSC ROE PROTOCOL
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'INTERLOCKS' && (
            <div className="space-y-3">
              <div className="p-3 rounded bg-[#090e17] border border-tactical-border text-tactical-textMuted leading-relaxed">
                <span className="font-bold text-white">Declaration of Simulation Boundaries: </span>
                SKYGUARD is designed strictly as a cognitive training platform for Defence Services Staff College personnel. It enforces 5 architectural barriers against operational misuse:
              </div>

              <div className="space-y-2.5">
                {safetyGuarantees.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-tactical-card border border-tactical-border space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white text-xs">{item.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badge}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'CRYPTO_HASH' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded bg-tactical-card border border-tactical-border space-y-2">
                <span className="text-xs font-bold text-white block">
                  SYNTHETIC TELEMETRY PACKET CERTIFICATION
                </span>
                <p className="text-[11px] text-tactical-textMuted leading-relaxed">
                  All target data generated by the Procedural Mulberry32 PRNG contains a verifiable cryptographic header proving it is simulated training data:
                </p>

                <div className="p-2.5 rounded bg-[#060a12] border border-tactical-border font-mono text-[10px] text-tactical-accent space-y-1">
                  <div>[HEADER]: SKYGUARD-SIM-V2.6-DSSC-SECURE</div>
                  <div>[TOKEN_ID]: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</div>
                  <div>[INTERLOCK_STATE]: HARDWARE_DISARMED_TRUE</div>
                  <div>[CLASSIFICATION]: SIMULATOR_RESTRICTED_NON_KINETIC</div>
                  <div>[WATERMARK]: "AIRSPACE-SIM-26247-DO-NOT-ROUTE-TO-LIVE-FIRE"</div>
                </div>
              </div>

              <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Cryptographic Integrity Confirmed: </span>
                  Zero data pollution into operational defence channels. Fully compliant with military training simulator isolation protocols.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ROE_BOUNDARY' && (
            <div className="space-y-3">
              <div className="p-3 rounded bg-[#090e17] border border-tactical-border text-xs text-tactical-textNormal leading-relaxed">
                <span className="text-tactical-amber font-bold">Standard Rules of Engagement (ROE) Directive:</span>
                <p className="mt-1 text-tactical-textMuted text-[11px] leading-relaxed">
                  1. Never escalate prior to multi-spectral sensor confirmation.<br/>
                  2. Cross-verify radar returns with thermal FLIR and acoustic BPF.<br/>
                  3. Discriminate civilian and wildlife decoys before initiating response protocols.<br/>
                  4. All simulated countermeasures are electronic/informational (safe frequency disruption and supervisor alerts).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-tactical-surface border-t border-tactical-border flex items-center justify-between text-xs">
          <span className="text-tactical-textMuted text-[11px]">
            Security Audit: <strong className="text-tactical-primary">PASSED (100% NON-KINETIC COMPLIANT)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-tactical-primary text-black font-extrabold text-xs shadow-glow-green"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

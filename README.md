# SKYGUARD
### AI-Enabled Drone & Counter-Drone Threat Simulation Trainer
**"Train for the Threat Before the Threat Becomes Real."**

---

### **Project Metadata**
- **Smart India Hackathon 2026** — Problem Statement ID: **26247**
- **Organization:** Ministry of Defence (MoD)
- **Department:** Defence Services Staff College (DSSC)
- **Theme:** Robotics and Drones
- **Category:** Software
- **Team Name:** Team Six_Seven
- **Team ID:** 175920

---

## 1. Executive Summary & Core Concept

**SKYGUARD** is a military-grade, software-based threat simulation trainer designed for personnel at the **Defence Services Staff College (DSSC)** and broader Armed Forces establishments. It delivers an end-to-end cognitive loop:

$$\text{Detect} \longrightarrow \text{Classify} \longrightarrow \text{Assess} \longrightarrow \text{Decide} \longrightarrow \text{Respond} \longrightarrow \text{Review}$$

> [!IMPORTANT]
> **SAFETY & DEFENSE BOUNDARY:**
> SKYGUARD is strictly a **Software Training and Simulation Platform**, NOT a real-world weapon control or kinetic engagement system. All trajectories, sensor signatures, target data, and airspace coordinates are completely synthetic.

---

## 2. Platform Modules (12 Modules)

| # | Module | Purpose |
|---|---|---|
| **1** | **COMMAND CENTER** | High-level situational awareness dashboard displaying active training session metadata, real-time detection & classification metrics, 360° synthetic radar display, and live event stream. |
| **2** | **SCENARIO LAB** | Procedural threat generator configuring environment, time of day, weather, threat profiles, sensor degradation, and deterministic seeds (`SG-XXXX`). |
| **3** | **LIVE SIMULATOR** | Central 2D/3D tactical airspace HUD with 4 active sensor panels (EO, IR, Radar, Acoustic), real-time threat queue, and standardized 6-step doctrine pipeline. |
| **4** | **THREAT ANALYSIS** | Deep neural classification inspection displaying shape signature, kinematics, speed/altitude bands, 6-class confidence distribution, and explainable risk factor weights. |
| **5** | **SENSOR FUSION** | Multi-spectral evidential reasoning engine calculating fused confidence, sensor disagreement index (Low/Med/High), and interactive sensor weight sliders. |
| **6** | **DECISION ENGINE** | Predefined safe Rules of Engagement (ROE) action panel with real-time decision quality evaluation, timing latency tracking, and transparent decision-tree score logs. |
| **7** | **SWARM INTELLIGENCE** | Multi-agent network topology viewer modeling B-oids flocking dynamics, centroid movement, and formation states (Formation, Dispersion, Regrouping). |
| **8** | **ADAPTIVE TRAINING** | Dynamic difficulty calibration engine analyzing trainee friction to automatically scale subsequent scenarios (Level 1–5). |
| **9** | **AFTER-ACTION REVIEW** | Mission debrief module featuring chronological event replay timeline, expected vs actual decision matrix, doctrinal rationale, and targeted improvement guidelines. |
| **10** | **PERFORMANCE ANALYTICS** | Trainee Digital Twin readiness profile (Callsign: ALPHA-07) and 2D Scenario Type × Skill Heatmap. |
| **11** | **SCENARIO LIBRARY** | Searchable repository containing 10 curated preset defence scenarios with View, Load, and Fork/Duplicate triggers. |
| **12** | **SYSTEM / DATA SOURCES** | End-to-end 13-stage interactive data flow pipeline diagram, research methodology framework, and future ML integration upgrade paths. |

---

## 3. Platform Novelties

1. **★ Procedural Threat Scenario Generator:** Scalable, deterministic pseudo-random scenario synthesis with reproducible alphanumeric seeds (`SG-XXXX`).
2. **★ Multi-Sensor Fusion Engine:** Evidential fusion across EO, IR Thermal, 360° Radar, and Acoustic arrays with real-time sensor disagreement alerts.
3. **★ AI Threat Classification:** 6-class distribution (Small UAV, Large UAV, Swarms, Decoys, Avian Wildlife, Unknown) with trainee verification logging.
4. **★ Explainable Threat Assessment (XAI):** Additive risk scoring decomposing abstract threats into transparent kinematic and perimeter factors ("Why?").
5. **★ Swarm Kinematics & Flocking Dynamics:** Multi-agent network topology modeling cohesion, separation, alignment, and centroid shifts.
6. **★ Safe Decision Engine:** Predefined doctrinal options enforcing Rules of Engagement without real-world weapon controls.
7. **★ Transparent Decision-Tree Scoring:** Positive and negative score attribution with explicit reasons.
8. **★ Adaptive Difficulty Engine:** Continuous progression calibration matching the trainee's individual learning curve.
9. **★ Deception & Decoy Training:** Realistic decoy corner reflectors and wildlife artifacts to reduce false alarms.
10. **★ After-Action Replay Timeline:** Interactive rewind and comparative debriefing of every decision moment.
11. **★ Trainee Digital Twin:** Cognitive competency profiling across all defense skill domains.
12. **★ 2D Training Heatmap:** Scenario Type × Skill matrix pinpointing tactical blind spots.

---

## 4. Technology Stack

- **Frontend Core:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Tactical Defense HUD Theme
- **Tactical Graphics:** HTML5 Canvas (60 FPS rotating radar sweep, range rings, kinematic trails, swarm node mesh)
- **Audio Feedback:** Web Audio API Procedural Tactical Synthesizer (radar pings, blips, threat alarms)
- **Icons:** Lucide React

---

## 5. Getting Started & Running Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run
```bash
# Clone or navigate to the directory
cd d:/Drone-project

# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser
# http://localhost:5173/
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Demonstration Sequence for Judges (60s Guided Demo)

1. Open `http://localhost:5173/`.
2. Inspect the **Official Mission Entry Briefing** with system status pills and novelty highlights.
3. Click **"START GUIDED DEMO (60s)"** or click **"ENTER TRAINING"**.
4. The guided demo automatically navigates across:
   - **Step 1:** Procedural Scenario Generation
   - **Step 2:** Drone Entry into Tactical Radar Airspace
   - **Step 3:** Multi-Sensor Acquisition
   - **Step 4:** AI Classification Confidence Distribution
   - **Step 5:** Radar Degradation & Multi-Spectral Recalibration
   - **Step 6:** Swarm Flocking Formation & Topology
   - **Step 7:** Trainee ROE Decision Selection
   - **Step 8:** Transparent Scoring Evaluation
   - **Step 9:** After-Action Review (AAR) Chronological Debrief
   - **Step 10:** Adaptive Engine Difficulty Synthesis
   - **Conclusion:** `"TRAIN → ASSESS → LEARN → ADAPT → TRAIN AGAIN"`

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSimulation } from '../context/SimulationContext';
import { 
  Glasses, 
  Eye, 
  Maximize2, 
  Crosshair, 
  Compass, 
  Layers, 
  Radio, 
  RefreshCw,
  Video,
  Sliders
} from 'lucide-react';

interface Tactical3DAndVRViewportProps {
  className?: string;
}

export const Tactical3DAndVRViewport: React.FC<Tactical3DAndVRViewportProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { tracks, selectedTrackId, setSelectedTrackId, scenario, sensors } = useSimulation();

  // VR & Camera display modes
  const [isVRMode, setIsVRMode] = useState<boolean>(false);
  const [ipdMm, setIpdMm] = useState<number>(64); // Interpupillary distance in mm (58 - 72)
  const [cameraMode, setCameraMode] = useState<'TACTICAL_ORBIT' | 'BASE_DEFENSE' | 'FOLLOW_TARGET'>('TACTICAL_ORBIT');
  const [showAirspaceDome, setShowAirspaceDome] = useState<boolean>(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const droneMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const swarmLinesRef = useRef<THREE.LineSegments | null>(null);
  const radarSweepMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leftEyeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rightEyeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Mouse interaction state for orbital camera
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.5,
    radius: 450
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Create Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060a12);
    scene.fog = new THREE.FogExp2(0x060a12, 0.0015);

    // 2. Setup Cameras
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 2500);
    cameraRef.current = camera;

    // Stereoscopic cameras for VR dual-eye rendering
    const leftCam = new THREE.PerspectiveCamera(50, (width / 2) / height, 1, 2500);
    const rightCam = new THREE.PerspectiveCamera(50, (width / 2) / height, 1, 2500);
    leftEyeCameraRef.current = leftCam;
    rightEyeCameraRef.current = rightCam;

    // 3. Renderer with high performance settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00e5a3, 0.8);
    dirLight.position.set(200, 400, 200);
    scene.add(dirLight);

    const centerPointLight = new THREE.PointLight(0x00c3ff, 1.5, 600);
    centerPointLight.position.set(0, 50, 0);
    scene.add(centerPointLight);

    // 5. Tactical Ground Grid & Terrain Rings
    const gridHelper = new THREE.GridHelper(800, 40, 0x00e5a3, 0x1f334d);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Concentric Range Rings on Ground
    [100, 200, 300, 400].forEach((r) => {
      const ringGeo = new THREE.RingGeometry(r - 0.8, r, 64);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0x00e5a3, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.25 
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.5;
      scene.add(ringMesh);
    });

    // 6. Base Command Defense Center (Center Landmark)
    const baseGeo = new THREE.CylinderGeometry(15, 20, 10, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x121d2f, roughness: 0.4 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 5;
    scene.add(baseMesh);

    // 3D Geodesic Radar Dome
    const domeGeo = new THREE.SphereGeometry(12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({ color: 0x00e5a3, wireframe: true, transparent: true, opacity: 0.7 });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 10;
    scene.add(domeMesh);

    // 7. Restricted Defense Airspace Dome (Transparent Hemispherical Boundary)
    const restrictedDomeGeo = new THREE.SphereGeometry(180, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const restrictedDomeMat = new THREE.MeshBasicMaterial({ 
      color: 0xef4444, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.18 
    });
    const restrictedDomeMesh = new THREE.Mesh(restrictedDomeGeo, restrictedDomeMat);
    restrictedDomeMesh.name = 'RESTRICTED_DOME';
    scene.add(restrictedDomeMesh);

    // 8. 3D Radar Sweep Arc
    const sweepGeo = new THREE.CylinderGeometry(400, 400, 2, 32, 1, true, 0, Math.PI / 5);
    const sweepMat = new THREE.MeshBasicMaterial({ 
      color: 0x00e5a3, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.15 
    });
    const sweepMesh = new THREE.Mesh(sweepGeo, sweepMat);
    sweepMesh.position.y = 1;
    scene.add(sweepMesh);
    radarSweepMeshRef.current = sweepMesh;

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      rendererRef.current.setSize(w, h);
      if (cameraRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
      if (leftEyeCameraRef.current && rightEyeCameraRef.current) {
        leftEyeCameraRef.current.aspect = (w / 2) / h;
        leftEyeCameraRef.current.updateProjectionMatrix();
        rightEyeCameraRef.current.aspect = (w / 2) / h;
        rightEyeCameraRef.current.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate radar sweep
      if (radarSweepMeshRef.current && sensors.Radar.status !== 'OFFLINE') {
        radarSweepMeshRef.current.rotation.y += 0.02;
      }

      // Rotate quadcopter rotors on active drone meshes
      droneMeshesRef.current.forEach(droneGroup => {
        droneGroup.traverse(child => {
          if (child.name.startsWith('ROTOR')) {
            child.rotation.y += 0.45;
          }
        });
      });

      // Update Camera Position based on mode
      const { theta, phi, radius } = cameraAngleRef.current;
      const cam = cameraRef.current;

      if (cam) {
        if (cameraMode === 'TACTICAL_ORBIT') {
          cam.position.x = radius * Math.sin(phi) * Math.sin(theta);
          cam.position.y = radius * Math.cos(phi);
          cam.position.z = radius * Math.sin(phi) * Math.cos(theta);
          cam.lookAt(0, 30, 0);
        } else if (cameraMode === 'BASE_DEFENSE') {
          // Standing atop command tower looking outward
          cam.position.set(0, 25, 0);
          cam.lookAt(200 * Math.sin(theta), 60, 200 * Math.cos(theta));
        }

        // Render
        const ren = rendererRef.current;
        if (ren && sceneRef.current) {
          if (isVRMode) {
            // Stereoscopic Dual-Eye Viewport Rendering
            ren.setScissorTest(true);

            // Left Eye
            const halfIpd = (ipdMm / 1000) * 15; // scaled IPD offset
            const leftCam = leftEyeCameraRef.current;
            if (leftCam) {
              leftCam.position.copy(cam.position);
              leftCam.translateX(-halfIpd);
              leftCam.rotation.copy(cam.rotation);

              ren.setViewport(0, 0, width / 2, height);
              ren.setScissor(0, 0, width / 2, height);
              ren.render(sceneRef.current, leftCam);
            }

            // Right Eye
            const rightCam = rightEyeCameraRef.current;
            if (rightCam) {
              rightCam.position.copy(cam.position);
              rightCam.translateX(halfIpd);
              rightCam.rotation.copy(cam.rotation);

              ren.setViewport(width / 2, 0, width / 2, height);
              ren.setScissor(width / 2, 0, width / 2, height);
              ren.render(sceneRef.current, rightCam);
            }

            ren.setScissorTest(false);
          } else {
            // Standard Single-Screen 3D Tactical Display
            ren.setViewport(0, 0, width, height);
            ren.render(sceneRef.current, cam);
          }
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update 3D Drone Entities whenever tracks state changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Helper to map 0-1000 simulation space to 3D world space (-350 to +350)
    const mapTo3D = (v: number) => ((v - 500) / 500) * 350;

    tracks.forEach(trk => {
      let droneGroup = droneMeshesRef.current.get(trk.id);

      if (!droneGroup) {
        // Build 3D Quadcopter Drone Model with Rotors and Projection Stem
        droneGroup = new THREE.Group();

        // 1. Drone Central Fuselage
        const bodyGeo = new THREE.BoxGeometry(7, 2.5, 7);
        const bodyColor = trk.threatLevel === 'HIGH' ? 0xef4444 : trk.threatLevel === 'MEDIUM' ? 0xf59e0b : 0x00e5a3;
        const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.6, roughness: 0.2 });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        droneGroup.add(bodyMesh);

        // 2. Cross Arms (Quadcopter Frame)
        const armMat = new THREE.MeshBasicMaterial({ color: 0x829bb5 });
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 1.2), armMat);
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 16), armMat);
        droneGroup.add(arm1);
        droneGroup.add(arm2);

        // 3. 4x Rotors
        const rotorPositions = [
          [-8, 1.2, 0],
          [8, 1.2, 0],
          [0, 1.2, -8],
          [0, 1.2, 8],
        ];
        rotorPositions.forEach((pos, idx) => {
          const rotorGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.3, 8);
          const rotorMat = new THREE.MeshBasicMaterial({ 
            color: 0x00c3ff, 
            transparent: true, 
            opacity: 0.6 
          });
          const rotorMesh = new THREE.Mesh(rotorGeo, rotorMat);
          rotorMesh.name = `ROTOR_${idx}`;
          rotorMesh.position.set(pos[0], pos[1], pos[2]);
          droneGroup!.add(rotorMesh);
        });

        // 4. Altitude Projection Line (Stem down to ground)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -100, 0)
        ]);
        const lineMat = new THREE.LineDashedMaterial({ 
          color: bodyColor, 
          dashSize: 3, 
          gapSize: 2, 
          transparent: true, 
          opacity: 0.5 
        });
        const stemLine = new THREE.Line(lineGeo, lineMat);
        stemLine.name = 'STEM_LINE';
        droneGroup.add(stemLine);

        // 5. Ground Shadow Reticle
        const shadowRing = new THREE.Mesh(
          new THREE.RingGeometry(4, 5, 16),
          new THREE.MeshBasicMaterial({ color: bodyColor, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
        );
        shadowRing.rotation.x = Math.PI / 2;
        shadowRing.name = 'GROUND_RETICLE';
        droneGroup.add(shadowRing);

        scene.add(droneGroup);
        droneMeshesRef.current.set(trk.id, droneGroup);
      }

      // Position update
      const worldX = mapTo3D(trk.x);
      const worldZ = mapTo3D(trk.y);
      const worldY = Math.max(15, (trk.altitudeM / 400) * 160); // scale altitude

      droneGroup.position.set(worldX, worldY, worldZ);
      droneGroup.rotation.y = -trk.headingDeg * (Math.PI / 180);

      // Update stem line down to exact ground plane (y = 0)
      const stem = droneGroup.getObjectByName('STEM_LINE') as THREE.Line;
      if (stem) {
        stem.scale.set(1, worldY / 100, 1);
      }

      // Update ground reticle at y = -worldY
      const groundReticle = droneGroup.getObjectByName('GROUND_RETICLE');
      if (groundReticle) {
        groundReticle.position.set(0, -worldY + 0.5, 0);
      }
    });

    // Update 3D Swarm interconnect lines
    const swarmTracks = tracks.filter(t => t.swarmId);
    if (swarmTracks.length > 1) {
      if (swarmLinesRef.current) {
        scene.remove(swarmLinesRef.current);
      }

      const points: THREE.Vector3[] = [];
      for (let i = 0; i < swarmTracks.length; i++) {
        for (let j = i + 1; j < swarmTracks.length; j++) {
          const t1 = swarmTracks[i];
          const t2 = swarmTracks[j];
          const p1 = new THREE.Vector3(mapTo3D(t1.x), (t1.altitudeM / 400) * 160, mapTo3D(t1.y));
          const p2 = new THREE.Vector3(mapTo3D(t2.x), (t2.altitudeM / 400) * 160, mapTo3D(t2.y));
          if (p1.distanceTo(p2) < 140) {
            points.push(p1, p2);
          }
        }
      }

      if (points.length > 0) {
        const swarmLineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const swarmLineMat = new THREE.LineBasicMaterial({ 
          color: 0xef4444, 
          transparent: true, 
          opacity: 0.6 
        });
        const lines = new THREE.LineSegments(swarmLineGeo, swarmLineMat);
        scene.add(lines);
        swarmLinesRef.current = lines;
      }
    }
  }, [tracks]);

  // Mouse drag handler for 3D Camera Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    cameraAngleRef.current.theta -= dx * 0.006;
    cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.1, cameraAngleRef.current.phi - dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    cameraAngleRef.current.radius = Math.max(120, Math.min(800, cameraAngleRef.current.radius + e.deltaY * 0.3));
  };

  return (
    <div className={`relative w-full h-full bg-[#060a12] border border-tactical-border rounded-lg overflow-hidden flex flex-col font-mono select-none ${className}`}>
      {/* 3D / VR Controls Overlay Header */}
      <div className="absolute top-2.5 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Tag */}
        <div className="flex items-center gap-2 bg-[#0d1522]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-tactical-border/70 text-xs pointer-events-auto">
          <span className="flex items-center gap-1.5 text-tactical-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-tactical-primary animate-pulse" />
            {isVRMode ? 'VR STEREOSCOPIC HUD (DUAL-EYE)' : '3D TACTICAL AIRSPACE SIMULATOR'}
          </span>
          <span className="text-tactical-border">|</span>
          <span className="text-tactical-textNormal text-[11px]">{scenario.environment.toUpperCase()} SECTOR</span>
        </div>

        {/* Right Action Switchers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Camera View Switcher */}
          <div className="flex items-center bg-[#0d1522]/90 backdrop-blur p-1 rounded-lg border border-tactical-border text-xs">
            <button
              onClick={() => setCameraMode('TACTICAL_ORBIT')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                cameraMode === 'TACTICAL_ORBIT' ? 'bg-tactical-primary text-black' : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              ORBIT 360°
            </button>
            <button
              onClick={() => setCameraMode('BASE_DEFENSE')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                cameraMode === 'BASE_DEFENSE' ? 'bg-tactical-accent text-black' : 'text-tactical-textMuted hover:text-white'
              }`}
            >
              DEFENSE TOWER
            </button>
          </div>

          {/* VR Stereoscopic Toggle */}
          <button
            onClick={() => setIsVRMode(!isVRMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all shadow-glow-green ${
              isVRMode 
                ? 'bg-tactical-primary text-black border-tactical-primary' 
                : 'bg-[#0d1522]/90 backdrop-blur text-tactical-primary border-tactical-primary/40 hover:bg-tactical-primary/20'
            }`}
            title="Toggle VR Dual-Eye Stereoscopic View"
          >
            <Glasses className="w-4 h-4" />
            <span>{isVRMode ? 'VR ACTIVE (DUAL-EYE)' : 'ENTER VR MODE'}</span>
          </button>
        </div>
      </div>

      {/* VR HUD Center Divider and Reticles when in VR mode */}
      {isVRMode && (
        <div className="absolute inset-0 pointer-events-none z-10 flex">
          {/* Left Eye Reticle & HUD */}
          <div className="w-1/2 h-full border-r-2 border-dashed border-tactical-primary/40 flex flex-col items-center justify-center relative">
            <Crosshair className="w-8 h-8 text-tactical-primary/60" />
            <div className="absolute top-12 left-4 text-[10px] text-tactical-primary font-mono bg-black/60 px-2 py-0.5 rounded border border-tactical-primary/40">
              LEFT EYE (FOV 95° • IPD {ipdMm}mm)
            </div>
            <div className="absolute bottom-8 text-[10px] text-tactical-textMuted font-mono">
              TARGET LOCK: {selectedTrackId || 'ACQUIRING'}
            </div>
          </div>

          {/* Right Eye Reticle & HUD */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
            <Crosshair className="w-8 h-8 text-tactical-primary/60" />
            <div className="absolute top-12 left-4 text-[10px] text-tactical-primary font-mono bg-black/60 px-2 py-0.5 rounded border border-tactical-primary/40">
              RIGHT EYE (STEREO PARALLAX 3.2°)
            </div>
            <div className="absolute bottom-8 text-[10px] text-tactical-textMuted font-mono">
              PERIMETER: RESTRICTED SECTOR A
            </div>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Footer Controls & Instructions */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between text-[11px] font-mono bg-[#0d1522]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-tactical-border/70">
        <div className="flex items-center gap-3 text-tactical-textMuted">
          <span className="hidden sm:inline">Left-Click Drag: Rotate 3D View</span>
          <span>•</span>
          <span className="hidden sm:inline">Scroll: Zoom Range</span>
          <span>•</span>
          <span className="text-tactical-primary font-semibold">Active 3D Tracks: {tracks.length}</span>
        </div>

        {isVRMode && (
          <div className="flex items-center gap-2 text-[10px] text-tactical-textNormal">
            <span>IPD:</span>
            <input
              type="range"
              min="58"
              max="72"
              value={ipdMm}
              onChange={(e) => setIpdMm(Number(e.target.value))}
              className="w-20 accent-tactical-primary h-1 bg-slate-800 rounded"
            />
            <span className="w-8 font-bold text-tactical-primary">{ipdMm}mm</span>
          </div>
        )}
      </div>
    </div>
  );
};

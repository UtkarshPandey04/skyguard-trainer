import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { LandingModal } from './components/LandingModal';

// Views
import { CommandCenterView } from './components/views/CommandCenterView';
import { ScenarioLabView } from './components/views/ScenarioLabView';
import { LiveSimulatorView } from './components/views/LiveSimulatorView';
import { ThreatAnalysisView } from './components/views/ThreatAnalysisView';
import { SensorFusionView } from './components/views/SensorFusionView';
import { DecisionEngineView } from './components/views/DecisionEngineView';
import { SwarmIntelligenceView } from './components/views/SwarmIntelligenceView';
import { AdaptiveTrainingView } from './components/views/AdaptiveTrainingView';
import { AfterActionReviewView } from './components/views/AfterActionReviewView';
import { PerformanceAnalyticsView } from './components/views/PerformanceAnalyticsView';
import { ScenarioLibraryView } from './components/views/ScenarioLibraryView';
import { SystemArchitectureView } from './components/views/SystemArchitectureView';

const MainContent: React.FC = () => {
  const { activeModule } = useSimulation();

  switch (activeModule) {
    case 'COMMAND CENTER':
      return <CommandCenterView />;
    case 'SCENARIO LAB':
      return <ScenarioLabView />;
    case 'LIVE SIMULATOR':
      return <LiveSimulatorView />;
    case 'THREAT ANALYSIS':
      return <ThreatAnalysisView />;
    case 'SENSOR FUSION':
      return <SensorFusionView />;
    case 'DECISION ENGINE':
      return <DecisionEngineView />;
    case 'SWARM INTELLIGENCE':
      return <SwarmIntelligenceView />;
    case 'ADAPTIVE TRAINING':
      return <AdaptiveTrainingView />;
    case 'AFTER-ACTION REVIEW':
      return <AfterActionReviewView />;
    case 'PERFORMANCE ANALYTICS':
      return <PerformanceAnalyticsView />;
    case 'SCENARIO LIBRARY':
      return <ScenarioLibraryView />;
    case 'SYSTEM / DATA SOURCES':
      return <SystemArchitectureView />;
    default:
      return <CommandCenterView />;
  }
};

const AppInner: React.FC = () => {
  // Show landing modal on first load so judges see the official mission briefing
  const [showLanding, setShowLanding] = useState<boolean>(true);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-tactical-bg text-tactical-textNormal font-sans tactical-grid-bg">
      <Header />
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <MainContent />
        </main>
      </div>

      <LandingModal isOpen={showLanding} onClose={() => setShowLanding(false)} />
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <AppInner />
    </SimulationProvider>
  );
}

export default App;

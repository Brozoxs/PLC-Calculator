import React, { useState } from 'react';
import { Project, ProjectConveyor, SystemComponents, EfficiencyConfig } from './types';
import { calculateProjectHours, validateConveyorInput } from './calculations';
import { CONVEYOR_TYPES, PROJECT_DEFAULTS, SYSTEM_HOURS_CONFIG, DEFAULT_SYSTEM_COMPONENTS } from './conveyorTypesConfig';
import { ProjectInput } from './components/ProjectInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import './App.css';

/**
 * Hoofdcomponent van de PLC Calculator applicatie
 *
 * Deze component beheert de state van het project en coördineert
 * de communicatie tussen het invoerscherm en het resultaten scherm.
 */
const App = () => {
  // State voor het huidige project
  const [projectName, setProjectName] = useState<string>(PROJECT_DEFAULTS.defaultProjectName);
  const [systemComponents, setSystemComponents] = useState<SystemComponents>(DEFAULT_SYSTEM_COMPONENTS);
  const [projectConveyors, setProjectConveyors] = useState<ProjectConveyor[]>([]);
  const [calculatedProject, setCalculatedProject] = useState<Project | null>(null);
  const [efficiencyConfig, setEfficiencyConfig] = useState<EfficiencyConfig>({
    efficiencyGainFactor: PROJECT_DEFAULTS.efficiencyGainFactor,
    maxEfficiencyUnits: PROJECT_DEFAULTS.maxEfficiencyUnits,
  });

  /**
   * Voeg een conveyor toe aan het project
   */
  const addConveyor = (conveyorTypeId: string, quantity: number) => {
    const conveyorType = CONVEYOR_TYPES.find(type => type.id === conveyorTypeId);
    if (!conveyorType) return;

    // Valideer invoer
    const validation = validateConveyorInput(conveyorType, quantity);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Controleer of dit type al bestaat
    const existingIndex = projectConveyors.findIndex(
      pc => pc.conveyorType.id === conveyorTypeId
    );

    if (existingIndex >= 0) {
      // Update bestaande conveyor
      const updatedConveyors = [...projectConveyors];
      updatedConveyors[existingIndex] = {
        conveyorType,
        quantity: updatedConveyors[existingIndex].quantity + quantity
      };
      setProjectConveyors(updatedConveyors);
    } else {
      // Voeg nieuwe conveyor toe
      setProjectConveyors([...projectConveyors, { conveyorType, quantity }]);
    }
  };

  /**
   * Verwijder een conveyor uit het project
   */
  const removeConveyor = (conveyorTypeId: string) => {
    setProjectConveyors(projectConveyors.filter(
      pc => pc.conveyorType.id !== conveyorTypeId
    ));
  };

  /**
   * Update het aantal voor een conveyor type
   */
  const updateConveyorQuantity = (conveyorTypeId: string, quantity: number) => {
    const conveyorType = CONVEYOR_TYPES.find(type => type.id === conveyorTypeId);
    if (!conveyorType) return;

    // Valideer invoer
    const validation = validateConveyorInput(conveyorType, quantity);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setProjectConveyors(projectConveyors.map(pc =>
      pc.conveyorType.id === conveyorTypeId
        ? { ...pc, quantity }
        : pc
    ));
  };

  /**
   * Bereken alle uren voor het project
   */
  const calculateProject = () => {
    if (projectConveyors.length === 0) {
      alert('Voeg eerst minimaal één conveyor toe aan het project');
      return;
    }

    const project = calculateProjectHours(projectName, systemComponents, projectConveyors, efficiencyConfig, SYSTEM_HOURS_CONFIG);
    setCalculatedProject(project);
  };

  /**
   * Reset het project naar beginstaat
   */
  const resetProject = () => {
    setProjectName(PROJECT_DEFAULTS.defaultProjectName);
    setSystemComponents(DEFAULT_SYSTEM_COMPONENTS);
    setProjectConveyors([]);
    setCalculatedProject(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PLC Programmeer- en Testuren Calculator</h1>
        <p>Automatische berekening van ontwikkeltijd voor conveyor installaties</p>
      </header>

      <main className="app-main">
        <div className="project-section">
          <ProjectInput
            projectName={projectName}
            onProjectNameChange={setProjectName}
            systemComponents={systemComponents}
            onSystemComponentsChange={setSystemComponents}
            projectConveyors={projectConveyors}
            onAddConveyor={addConveyor}
            onRemoveConveyor={removeConveyor}
            onUpdateConveyorQuantity={updateConveyorQuantity}
            onCalculate={calculateProject}
            onReset={resetProject}
            efficiencyConfig={efficiencyConfig}
            onEfficiencyConfigChange={setEfficiencyConfig}
          />
        </div>

        {calculatedProject && (
          <div className="results-section">
            <ResultsDisplay project={calculatedProject} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 - Industriële Automatisering Calculator</p>
      </footer>
    </div>
  );
};

export default App;
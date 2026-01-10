import React, { useState } from 'react';
import { ProjectConveyor, EfficiencyConfig } from '../types';
import { CONVEYOR_TYPES } from '../conveyorTypesConfig';

/**
 * Props interface voor de ProjectInput component
 */
interface ProjectInputProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  projectConveyors: ProjectConveyor[];
  onAddConveyor: (conveyorTypeId: string, quantity: number) => void;
  onRemoveConveyor: (conveyorTypeId: string) => void;
  onUpdateConveyorQuantity: (conveyorTypeId: string, quantity: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  efficiencyConfig: EfficiencyConfig;
  onEfficiencyConfigChange: (config: EfficiencyConfig) => void;
}

/**
 * Component voor het invoeren van projectgegevens
 *
 * Deze component toont:
 * - Project naam invoer
 * - Lijst van beschikbare conveyor types
 * - Toevoegen/verwijderen van conveyors
 * - Aanpassen van aantallen
 * - Efficiëntiewinst configuratie
 * - Berekeningsknoppen
 */
export const ProjectInput: React.FC<ProjectInputProps> = ({
  projectName,
  onProjectNameChange,
  projectConveyors,
  onAddConveyor,
  onRemoveConveyor,
  onUpdateConveyorQuantity,
  onCalculate,
  onReset,
  efficiencyConfig,
  onEfficiencyConfigChange,
}) => {
  // Lokale state voor nieuwe conveyor toevoegen
  const [selectedConveyorType, setSelectedConveyorType] = useState<string>('');
  const [newConveyorQuantity, setNewConveyorQuantity] = useState<number>(1);

  /**
   * Handler voor toevoegen van een conveyor
   */
  const handleAddConveyor = () => {
    if (!selectedConveyorType || newConveyorQuantity < 1) {
      alert('Selecteer een conveyor type en geef een geldig aantal op');
      return;
    }

    onAddConveyor(selectedConveyorType, newConveyorQuantity);
    setSelectedConveyorType('');
    setNewConveyorQuantity(1);
  };

  /**
   * Handler voor wijzigen van efficiëntiewinst configuratie
   */
  const handleEfficiencyChange = (field: keyof EfficiencyConfig, value: number) => {
    onEfficiencyConfigChange({
      ...efficiencyConfig,
      [field]: value,
    });
  };

  return (
    <div className="project-input">
      <div className="card">
        <div className="card-header">
          <h2>Project Instellingen</h2>
        </div>
        <div className="card-body">
          {/* Project naam */}
          <div className="form-group">
            <label htmlFor="projectName">Project Naam:</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              placeholder="Voer project naam in..."
              className="form-control"
            />
          </div>

          {/* Efficiëntiewinst configuratie */}
          <div className="efficiency-config">
            <h3>Efficiëntiewinst Instellingen</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="efficiencyGain">Efficiëntiewinst Factor (%):</label>
                <input
                  type="number"
                  id="efficiencyGain"
                  value={Math.round(efficiencyConfig.efficiencyGainFactor * 100)}
                  onChange={(e) => handleEfficiencyChange('efficiencyGainFactor', parseInt(e.target.value) / 100)}
                  min="0"
                  max="50"
                  step="1"
                  className="form-control"
                />
                <small className="form-text">
                  Percentage besparing per extra conveyor (bijv. 15 = 15% besparing)
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="maxEfficiencyUnits">Max. Efficiëntiewinst Eenheden:</label>
                <input
                  type="number"
                  id="maxEfficiencyUnits"
                  value={efficiencyConfig.maxEfficiencyUnits}
                  onChange={(e) => handleEfficiencyChange('maxEfficiencyUnits', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="form-control"
                />
                <small className="form-text">
                  Maximaal aantal conveyors dat efficiëntiewinst krijgt
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conveyor lijst */}
      <div className="card">
        <div className="card-header">
          <h2>Conveyor Types</h2>
        </div>
        <div className="card-body">
          {/* Toevoegen nieuwe conveyor */}
          <div className="add-conveyor-form">
            <h3>Conveyor Toevoegen</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="conveyorType">Type:</label>
                <select
                  id="conveyorType"
                  value={selectedConveyorType}
                  onChange={(e) => setSelectedConveyorType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Selecteer type...</option>
                  {CONVEYOR_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Aantal:</label>
                <input
                  type="number"
                  id="quantity"
                  value={newConveyorQuantity}
                  onChange={(e) => setNewConveyorQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max="1000"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button
                  onClick={handleAddConveyor}
                  className="btn btn-primary"
                  disabled={!selectedConveyorType}
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>

          {/* Lijst van toegevoegde conveyors */}
          {projectConveyors.length > 0 && (
            <div className="conveyor-list">
              <h3>Project Conveyors</h3>
              <div className="conveyor-items">
                {projectConveyors.map(projectConveyor => (
                  <div key={projectConveyor.conveyorType.id} className="conveyor-item">
                    <div className="conveyor-info">
                      <h4>{projectConveyor.conveyorType.name}</h4>
                      <p>{projectConveyor.conveyorType.description}</p>
                    </div>
                    <div className="conveyor-controls">
                      <div className="quantity-control">
                        <label>Aantal:</label>
                        <input
                          type="number"
                          value={projectConveyor.quantity}
                          onChange={(e) => onUpdateConveyorQuantity(
                            projectConveyor.conveyorType.id,
                            parseInt(e.target.value) || 1
                          )}
                          min="1"
                          max="1000"
                          className="form-control"
                        />
                      </div>
                      <button
                        onClick={() => onRemoveConveyor(projectConveyor.conveyorType.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projectConveyors.length === 0 && (
            <div className="empty-state">
              <p>Geen conveyors toegevoegd aan dit project. Selecteer een type hierboven om te beginnen.</p>
            </div>
          )}
        </div>
      </div>

      {/* Actieknoppen */}
      <div className="action-buttons">
        <button
          onClick={onCalculate}
          className="btn btn-success btn-lg"
          disabled={projectConveyors.length === 0}
        >
          Bereken Uren
        </button>
        <button
          onClick={onReset}
          className="btn btn-secondary btn-lg"
        >
          Reset Project
        </button>
      </div>
    </div>
  );
};
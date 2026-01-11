import React from 'react';
import { Project } from '../types';
import { formatHours } from '../calculations';
import { exportToCSV, exportToExcel, exportToPDF, generateExportSummary } from '../exportUtils';
import { SYSTEM_HOURS_CONFIG } from '../conveyorTypesConfig';

/**
 * Props interface voor de ResultsDisplay component
 */
interface ResultsDisplayProps {
  project: Project;
}

/**
 * Component voor het weergeven van berekeningsresultaten
 *
 * Toont:
 * - Totaal overzicht van alle uren
 * - Gedetailleerde breakdown per conveyor type
 * - Efficiëntiewinst informatie
 * - Export mogelijkheden (placeholder voor toekomst)
 */
export const ResultsDisplay = ({ project }: ResultsDisplayProps) => {
  return (
    <div className="results-display">
      <div className="card">
        <div className="card-header">
          <h2>Berekeningsresultaten - {project.name}</h2>
          <small className="text-muted">
            Berekend op: {project.lastCalculated.toLocaleString()}
          </small>
        </div>
        <div className="card-body">
          {/* Totaal overzicht */}
          <div className="totals-section">
            <h3>Project Totaal</h3>
            <div className="totals-grid">
              <div className="total-item">
                <div className="total-value">
                  {formatHours(project.totalProgrammingHours)}
                </div>
                <div className="total-label">Programmeeruren</div>
                <div className="total-subtext">
                  {formatHours(project.totalProgrammingHours - project.totalSystemHours)} + {formatHours(project.totalSystemHours)}
                </div>
              </div>
              <div className="total-item">
                <div className="total-value">
                  {formatHours(project.totalTestingHours)}
                </div>
                <div className="total-label">Testuren</div>
              </div>
              <div className="total-item">
                <div className="total-value">
                  {formatHours(project.totalSystemHours)}
                </div>
                <div className="total-label">Systeem Uren</div>
              </div>
              <div className="total-item">
                <div className="total-value">
                  {formatHours(project.totalProgrammingHours + project.totalTestingHours)}
                </div>
                <div className="total-label">Totaal Uren</div>
              </div>
              <div className="total-item">
                <div className="total-value">
                  {project.calculations.reduce((sum, calc) => sum + calc.quantity, 0)}
                </div>
                <div className="total-label">Totaal Conveyors</div>
              </div>
              <div className="total-item">
                <div className="total-value">
                  {project.systemComponents.plcCount + project.systemComponents.cabinetHmiCount + project.systemComponents.mobileHmiCount}
                </div>
                <div className="total-label">Systeem Componenten</div>
                <div className="total-subtext">
                  {project.systemComponents.plcCount}P {project.systemComponents.cabinetHmiCount + project.systemComponents.mobileHmiCount}H
                </div>
              </div>
            </div>
          </div>

          {/* Gedetailleerde breakdown per conveyor type */}
          <div className="breakdown-section">
            <h3>Detail per Conveyor Type</h3>
            <div className="breakdown-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Conveyor Type</th>
                    <th>Aantal</th>
                    <th>Gem. Prog. uren</th>
                    <th>Totaal Prog. uren</th>
                    <th>Gem. Test uren</th>
                    <th>Totaal Test uren</th>
                    <th>Totaal per type</th>
                  </tr>
                </thead>
                <tbody>
                  {project.calculations.map(calculation => (
                    <tr key={calculation.conveyorType.id}>
                      <td>
                        <div className="conveyor-name">
                          {calculation.conveyorType.name}
                        </div>
                        <small className="text-muted">
                          {calculation.conveyorType.description}
                        </small>
                      </td>
                      <td className="text-center">
                        <strong>{calculation.quantity}</strong>
                      </td>
                      <td className="text-center">
                        {formatHours(calculation.averageProgrammingHoursPerConveyor)}
                      </td>
                      <td className="text-center">
                        <strong>{formatHours(calculation.totalProgrammingHours)}</strong>
                      </td>
                      <td className="text-center">
                        {formatHours(calculation.averageTestingHoursPerConveyor)}
                      </td>
                      <td className="text-center">
                        <strong>{formatHours(calculation.totalTestingHours)}</strong>
                      </td>
                      <td className="text-center">
                        <strong>
                          {formatHours(calculation.totalProgrammingHours + calculation.totalTestingHours)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>TOTAAL</strong></td>
                    <td className="text-center">
                      <strong>{project.calculations.reduce((sum, calc) => sum + calc.quantity, 0)}</strong>
                    </td>
                    <td colSpan={2} className="text-center">
                      <strong>{formatHours(project.totalProgrammingHours)}</strong>
                    </td>
                    <td colSpan={2} className="text-center">
                      <strong>{formatHours(project.totalTestingHours)}</strong>
                    </td>
                    <td className="text-center">
                      <strong>{formatHours(project.totalProgrammingHours + project.totalTestingHours)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Systeem uitleg */}
          <div className="efficiency-info">
            <h3>Systeem Uren Uitleg</h3>
            <div className="info-content">
              <p>
                Naast conveyor-specifieke uren worden ook systeemcomponenten meegenomen in de berekening:
              </p>
              <ul>
                <li><strong>PLC's:</strong> {SYSTEM_HOURS_CONFIG.hoursPerPlc} uur per PLC voor configuratie en programmering</li>
                <li><strong>Cabinet HMI's:</strong> {SYSTEM_HOURS_CONFIG.hoursPerCabinetHmi} uur per vaste HMI voor interface ontwikkeling</li>
                <li><strong>Mobile HMI's:</strong> {SYSTEM_HOURS_CONFIG.hoursPerMobileHmi} uur per mobiele HMI voor app ontwikkeling</li>
                <li><strong>Host Systeem:</strong> {SYSTEM_HOURS_CONFIG.hostSystemHoursPerConveyor} uur per conveyor voor integratie met host systemen</li>
                <li><strong>Externe Bedrijven:</strong> Handmatig ingevoerde uren voor subcontractors</li>
              </ul>

              <h4>Efficiëntiewinst bij Conveyors</h4>
              <p>
                Bij meerdere identieke conveyors van hetzelfde type wordt een efficiëntiewinst toegepast.
                Dit betekent dat de programmeer- en testtijd per extra conveyor afneemt omdat:
              </p>
              <ul>
                <li>Herbruikbare code componenten kunnen worden gebruikt</li>
                <li>Test procedures gestandaardiseerd kunnen worden</li>
                <li>Ervaring met het systeem toeneemt tijdens het project</li>
              </ul>
              <p>
                <strong>Voorbeeld:</strong> Bij 3 identieke conveyors van een type met 10 basis programmeeruren
                krijgt de eerste conveyor alle 10 uren, maar elke volgende conveyor krijgt 15% minder tijd
                (effectief 8.5 uur per conveyor), met een minimum van 3 uur per conveyor.
              </p>

              <h4>Totaal Berekening</h4>
              <p>
                <strong>Totaal Programmeeruren = Conveyor Uren + Systeem Uren</strong><br/>
                De systeem uren worden opgeteld bij de conveyor programmeeruren om het totaal te krijgen.
              </p>
            </div>
          </div>

          {/* Export functionaliteit */}
          <div className="export-section">
            <h3>Export Resultaten</h3>
            <p>
              Exporteer uw projectresultaten naar verschillende formaten voor rapportage en archivering:
            </p>

            <div className="export-buttons">
              <button
                onClick={() => exportToCSV(project)}
                className="btn btn-primary export-btn"
                title="Exporteer naar CSV (Comma-Separated Values)"
              >
                <span className="export-icon">📊</span>
                Export CSV
              </button>

              <button
                onClick={() => exportToExcel(project)}
                className="btn btn-success export-btn"
                title="Exporteer naar Excel werkblad (.xlsx)"
              >
                <span className="export-icon">📈</span>
                Export Excel
              </button>

              <button
                onClick={() => exportToPDF(project)}
                className="btn btn-danger export-btn"
                title="Exporteer naar PDF rapport"
              >
                <span className="export-icon">📄</span>
                Export PDF
              </button>
            </div>

            <div className="export-info">
              <h4>Project Samenvatting</h4>
              <pre className="summary-text">
                {generateExportSummary(project)}
              </pre>
            </div>

            <div className="export-note">
              <small className="text-muted">
                <strong>💡 Tip:</strong> Gebruik Excel voor verdere analyse, PDF voor rapportage,
                en CSV voor import in andere systemen.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
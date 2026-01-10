import React from 'react';
import { Project } from '../types';
import { formatHours } from '../calculations';

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
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ project }) => {
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
              </div>
              <div className="total-item">
                <div className="total-value">
                  {formatHours(project.totalTestingHours)}
                </div>
                <div className="total-label">Testuren</div>
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

          {/* Efficiëntiewinst uitleg */}
          <div className="efficiency-info">
            <h3>Efficiëntiewinst Uitleg</h3>
            <div className="info-content">
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
            </div>
          </div>

          {/* Export placeholder */}
          <div className="export-section">
            <h3>Export (Toekomstige functionaliteit)</h3>
            <p>
              In toekomstige versies kunt u hier de resultaten exporteren naar:
            </p>
            <ul>
              <li>Excel bestand (.xlsx)</li>
              <li>PDF rapport</li>
              <li>CSV bestand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
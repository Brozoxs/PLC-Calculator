import { Project } from './types';
import { formatHours } from './calculations';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export utilities voor de PLC Calculator
 *
 * Deze module bevat alle functies voor het exporteren van projectresultaten
 * naar verschillende formaten: CSV, Excel (.xlsx), en PDF.
 */

/**
 * Converteert een Project naar CSV data
 */
export function convertProjectToCSV(project: Project): string {
  const headers = [
    'Conveyor Type',
    'Description',
    'Aantal',
    'Basis Prog. uren',
    'Basis Test uren',
    'Gem. Prog. uren',
    'Gem. Test uren',
    'Totaal Prog. uren',
    'Totaal Test uren',
    'Totaal per type'
  ];

  const rows = project.calculations.map(calc => [
    calc.conveyorType.name,
    calc.conveyorType.description || '',
    calc.quantity.toString(),
    calc.conveyorType.baseProgrammingHours.toString(),
    calc.conveyorType.baseTestingHours.toString(),
    formatHours(calc.averageProgrammingHoursPerConveyor),
    formatHours(calc.averageTestingHoursPerConveyor),
    formatHours(calc.totalProgrammingHours),
    formatHours(calc.totalTestingHours),
    formatHours(calc.totalProgrammingHours + calc.totalTestingHours)
  ]);

  // Voeg totaalrij toe
  const totalConveyors = project.calculations.reduce((sum, calc) => sum + calc.quantity, 0);
  rows.push([
    'TOTAAL',
    'Project totaal',
    totalConveyors.toString(),
    '',
    '',
    '',
    '',
    formatHours(project.totalProgrammingHours),
    formatHours(project.totalTestingHours),
    formatHours(project.totalProgrammingHours + project.totalTestingHours)
  ]);

  // Voeg systeem componenten toe
  const systemHeaders = [
    'PLC Count', 'PLC Hours', 'Cabinet HMI Count', 'Cabinet HMI Hours',
    'Mobile HMI Count', 'Mobile HMI Hours', 'Host System', 'Host System Hours',
    'External Company Hours', 'Total System Hours'
  ];

  const systemRow = [
    project.systemComponents.plcCount.toString(),
    project.systemCalculation.totalPlcHours.toString(),
    project.systemComponents.cabinetHmiCount.toString(),
    (project.systemComponents.cabinetHmiCount * project.systemCalculation.hoursConfig.hoursPerCabinetHmi).toString(),
    project.systemComponents.mobileHmiCount.toString(),
    (project.systemComponents.mobileHmiCount * project.systemCalculation.hoursConfig.hoursPerMobileHmi).toString(),
    project.systemComponents.hasHostSystem ? 'Ja' : 'Nee',
    project.systemCalculation.totalHostSystemHours.toString(),
    project.systemComponents.externalCompanyHours.toString(),
    project.systemCalculation.totalSystemHours.toString()
  ];

  // Voeg totaalrij toe met systeem uren
  const totalConveyorsForSystem = project.calculations.reduce((sum, calc) => sum + calc.quantity, 0);
  rows.push([
    'TOTAAL',
    'Project totaal',
    totalConveyorsForSystem.toString(),
    '',
    '',
    '',
    '',
    formatHours(project.totalProgrammingHours - project.totalSystemHours),
    formatHours(project.totalTestingHours),
    formatHours(project.totalProgrammingHours - project.totalSystemHours + project.totalTestingHours)
  ]);

  // Combineer alles
  const allHeaders = [...headers, ...systemHeaders];
  const allRows = [
    ...rows.map((row, index) => {
      if (index === rows.length - 1) { // Laatste rij (totaal) - voeg systeem data toe
        return [...row, ...systemRow];
      }
      // Normale rijen - voeg lege systeem cellen toe
      return [...row, '', '', '', '', '', '', '', '', '', ''];
    })
  ];

  const csvContent = [allHeaders, ...allRows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

/**
 * Exporteert project naar CSV bestand
 */
export function exportToCSV(project: Project): void {
  const csvContent = convertProjectToCSV(project);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plc-calculator-${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Exporteert project naar Excel bestand (.xlsx)
 */
export function exportToExcel(project: Project): void {
  // Maak worksheet data
  const headers = [
    'Conveyor Type', 'Description', 'Aantal', 'Basis Prog. uren', 'Basis Test uren',
    'Gem. Prog. uren', 'Gem. Test uren', 'Totaal Prog. uren', 'Totaal Test uren', 'Totaal per type'
  ];

  const data = project.calculations.map(calc => [
    calc.conveyorType.name,
    calc.conveyorType.description || '',
    calc.quantity,
    calc.conveyorType.baseProgrammingHours,
    calc.conveyorType.baseTestingHours,
    calc.averageProgrammingHoursPerConveyor,
    calc.averageTestingHoursPerConveyor,
    calc.totalProgrammingHours,
    calc.totalTestingHours,
    calc.totalProgrammingHours + calc.totalTestingHours
  ]);

  // Voeg totaalrij toe
  const totalConveyors = project.calculations.reduce((sum, calc) => sum + calc.quantity, 0);
  data.push([
    'TOTAAL',
    'Project totaal',
    totalConveyors,
    '',
    '',
    '',
    '',
    project.totalProgrammingHours - project.totalSystemHours, // Alleen conveyor uren
    project.totalTestingHours,
    project.totalProgrammingHours - project.totalSystemHours + project.totalTestingHours
  ]);

  // Voeg lege rij toe voor systeem componenten sectie
  data.push(['', '', '', '', '', '', '', '', '', '']);

  // Voeg systeem componenten sectie toe
  data.push(['SYSTEEM COMPONENTEN', '', '', '', '', '', '', '', '', '']);
  data.push(['PLC Count', project.systemComponents.plcCount, '', '', '', '', '', '', '', '']);
  data.push(['PLC Hours', project.systemCalculation.totalPlcHours, '', '', '', '', '', '', '', '']);
  data.push(['Cabinet HMI Count', project.systemComponents.cabinetHmiCount, '', '', '', '', '', '', '', '']);
  data.push(['Cabinet HMI Hours', project.systemComponents.cabinetHmiCount * project.systemCalculation.hoursConfig.hoursPerCabinetHmi, '', '', '', '', '', '', '', '']);
  data.push(['Mobile HMI Count', project.systemComponents.mobileHmiCount, '', '', '', '', '', '', '', '']);
  data.push(['Mobile HMI Hours', project.systemComponents.mobileHmiCount * project.systemCalculation.hoursConfig.hoursPerMobileHmi, '', '', '', '', '', '', '', '']);
  data.push(['Host System Present', project.systemComponents.hasHostSystem ? 'Ja' : 'Nee', '', '', '', '', '', '', '', '']);
  data.push(['Host System Hours', project.systemCalculation.totalHostSystemHours, '', '', '', '', '', '', '', '']);
  data.push(['External Company Hours', project.systemComponents.externalCompanyHours, '', '', '', '', '', '', '', '']);
  data.push(['Total System Hours', project.systemCalculation.totalSystemHours, '', '', '', '', '', '', '', '']);

  // Maak worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Stel kolombreedtes in
  const colWidths = [
    { wch: 20 }, // Conveyor Type
    { wch: 30 }, // Description
    { wch: 8 },  // Aantal
    { wch: 12 }, // Basis Prog. uren
    { wch: 12 }, // Basis Test uren
    { wch: 12 }, // Gem. Prog. uren
    { wch: 12 }, // Gem. Test uren
    { wch: 12 }, // Totaal Prog. uren
    { wch: 12 }, // Totaal Test uren
    { wch: 12 }  // Totaal per type
  ];
  ws['!cols'] = colWidths;

  // Maak workbook en voeg worksheet toe
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PLC Calculator');

  // Exporteer bestand
  const fileName = `plc-calculator-${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Exporteert project naar PDF bestand
 */
export function exportToPDF(project: Project): void {
  const doc = new jsPDF();

  // Titel
  doc.setFontSize(20);
  doc.text('PLC Calculator - Project Rapport', 20, 20);

  // Project informatie
  doc.setFontSize(12);
  doc.text(`Project: ${project.name}`, 20, 35);
  doc.text(`Datum: ${project.lastCalculated.toLocaleDateString('nl-NL')}`, 20, 45);
  doc.text(`Tijd: ${project.lastCalculated.toLocaleTimeString('nl-NL')}`, 20, 55);

  // Samenvatting
  doc.setFontSize(14);
  doc.text('Project Samenvatting', 20, 75);

  const summaryData = [
    ['Totaal Programmeeruren', formatHours(project.totalProgrammingHours)],
    ['Totaal Testuren', formatHours(project.totalTestingHours)],
    ['Totaal Systeem Uren', formatHours(project.totalSystemHours)],
    ['Totaal Uren', formatHours(project.totalProgrammingHours + project.totalTestingHours)],
    ['Totaal Conveyors', project.calculations.reduce((sum, calc) => sum + calc.quantity, 0).toString()],
    ['Aantal PLC\'s', project.systemComponents.plcCount.toString()],
    ['Aantal HMI\'s', (project.systemComponents.cabinetHmiCount + project.systemComponents.mobileHmiCount).toString()],
    ['Host Systeem', project.systemComponents.hasHostSystem ? 'Ja' : 'Nee']
  ];

  (doc as any).autoTable({
    startY: 85,
    head: [['Parameter', 'Waarde']],
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [220, 53, 69] },
  });

  // Detail per conveyor type
  let finalY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(14);
  doc.text('Detail per Conveyor Type', 20, finalY);

  const tableData = project.calculations.map(calc => [
    calc.conveyorType.name,
    calc.quantity.toString(),
    formatHours(calc.averageProgrammingHoursPerConveyor),
    formatHours(calc.totalProgrammingHours),
    formatHours(calc.averageTestingHoursPerConveyor),
    formatHours(calc.totalTestingHours),
    formatHours(calc.totalProgrammingHours + calc.totalTestingHours)
  ]);

  // Voeg totaalrij toe
  const totalConveyors = project.calculations.reduce((sum, calc) => sum + calc.quantity, 0);
  tableData.push([
    'TOTAAL',
    totalConveyors.toString(),
    '',
    formatHours(project.totalProgrammingHours),
    '',
    formatHours(project.totalTestingHours),
    formatHours(project.totalProgrammingHours + project.totalTestingHours)
  ]);

  (doc as any).autoTable({
    startY: finalY + 10,
    head: [['Conveyor Type', 'Aantal', 'Gem. Prog.', 'Totaal Prog.', 'Gem. Test', 'Totaal Test', 'Totaal']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [220, 53, 69] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 15 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 }
    }
  });

  // Efficiëntiewinst uitleg
  finalY = (doc as any).lastAutoTable.finalY + 20;

  if (finalY > 250) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(12);
  doc.text('Efficiëntiewinst Uitleg', 20, finalY);
  doc.setFontSize(10);

  const explanation = [
    'Bij meerdere identieke conveyors van hetzelfde type wordt een',
    'efficiëntiewinst toegepast. Dit betekent dat de programmeer- en',
    'testtijd per extra conveyor afneemt omdat:',
    '',
    '• Herbruikbare code componenten kunnen worden gebruikt',
    '• Test procedures gestandaardiseerd kunnen worden',
    '• Ervaring met het systeem toeneemt tijdens het project'
  ];

  let yPos = finalY + 10;
  explanation.forEach(line => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 20, yPos);
    yPos += 5;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`PLC Calculator - Pagina ${i} van ${pageCount}`, 20, 290);
    doc.text(`Gegenereerd op: ${new Date().toLocaleString('nl-NL')}`, 120, 290);
  }

  // Opslaan
  const fileName = `plc-calculator-${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Genereert een export samenvatting voor de gebruiker
 */
export function generateExportSummary(project: Project): string {
  const totalHours = project.totalProgrammingHours + project.totalTestingHours;
  const totalConveyors = project.calculations.reduce((sum, calc) => sum + calc.quantity, 0);

  return `Project: ${project.name}
Totaal programmeeruren: ${formatHours(project.totalProgrammingHours)}
Totaal testuren: ${formatHours(project.totalTestingHours)}
Totaal systeem uren: ${formatHours(project.totalSystemHours)}
Totaal uren: ${formatHours(totalHours)}
Totaal conveyors: ${totalConveyors}
Aantal PLC's: ${project.systemComponents.plcCount}
Aantal HMI's: ${project.systemComponents.cabinetHmiCount + project.systemComponents.mobileHmiCount}
Host systeem: ${project.systemComponents.hasHostSystem ? 'Ja' : 'Nee'}
Externe uren: ${formatHours(project.systemComponents.externalCompanyHours)}
Berekend op: ${project.lastCalculated.toLocaleString('nl-NL')}`;
}
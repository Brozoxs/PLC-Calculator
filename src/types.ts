/**
 * Data model voor de PLC programmeer- en testuren calculator
 * Dit bestand bevat alle TypeScript interfaces en types die gebruikt worden
 * in de applicatie voor het berekenen van conveyor uren.
 */

// Basis interface voor een conveyor type
export interface ConveyorType {
  // Unieke identifier voor het conveyor type
  id: string;

  // Beschrijvende naam van het conveyor type
  name: string;

  // Basis programmeeruren voor één conveyor van dit type
  baseProgrammingHours: number;

  // Basis testuren voor één conveyor van dit type
  baseTestingHours: number;

  // Minimum aantal uren waar de berekening niet onder kan vallen
  // vanwege efficiëntiewinst (voorkomt negatieve getallen)
  minimumHours: number;

  // Beschrijving van het conveyor type voor gebruikers
  description?: string;
}

// Interface voor een conveyor in een project
export interface ProjectConveyor {
  // Referentie naar het conveyor type
  conveyorType: ConveyorType;

  // Aantal conveyors van dit type in het project
  quantity: number;
}

// Interface voor de resultaten van een berekening per conveyor type
export interface ConveyorCalculation {
  // Het conveyor type waarvoor de berekening is gemaakt
  conveyorType: ConveyorType;

  // Aantal conveyors van dit type
  quantity: number;

  // Totale programmeeruren voor alle conveyors van dit type
  totalProgrammingHours: number;

  // Totale testuren voor alle conveyors van dit type
  totalTestingHours: number;

  // Gemiddelde programmeeruren per conveyor (na efficiëntiewinst)
  averageProgrammingHoursPerConveyor: number;

  // Gemiddelde testuren per conveyor (na efficiëntiewinst)
  averageTestingHoursPerConveyor: number;
}

// Interface voor het totale project
export interface Project {
  // Naam van het project
  name: string;

  // Lijst van conveyors in het project
  conveyors: ProjectConveyor[];

  // Totaal aantal programmeeruren voor het hele project
  totalProgrammingHours: number;

  // Totaal aantal testuren voor het hele project
  totalTestingHours: number;

  // Gedetailleerde berekeningen per conveyor type
  calculations: ConveyorCalculation[];

  // Datum van laatste berekening
  lastCalculated: Date;
}

// Configuratie voor efficiëntiewinst berekening
export interface EfficiencyConfig {
  // Efficiëntiewinst factor - percentage dat elke extra conveyor bespaart
  // Bijv: 0.1 betekent 10% efficiëntiewinst per extra conveyor
  efficiencyGainFactor: number;

  // Maximum aantal conveyors waar efficiëntiewinst op van toepassing is
  maxEfficiencyUnits: number;
}

// Default configuratie voor efficiëntiewinst
export const DEFAULT_EFFICIENCY_CONFIG: EfficiencyConfig = {
  efficiencyGainFactor: 0.15, // 15% efficiëntiewinst per extra conveyor
  maxEfficiencyUnits: 10, // Maximaal 10 conveyors krijgen efficiëntiewinst
};
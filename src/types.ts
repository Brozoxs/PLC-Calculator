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

// Interface voor systeem componenten (PLC's, HMI's, etc.)
export interface SystemComponents {
  // Aantal PLC's in het project
  plcCount: number;

  // Aantal Cabinet HMI's
  cabinetHmiCount: number;

  // Aantal Mobile HMI's
  mobileHmiCount: number;

  // Of er een host systeem aanwezig is
  hasHostSystem: boolean;

  // Extra uren voor externe bedrijven
  externalCompanyHours: number;
}

// Interface voor systeem componenten uren
export interface SystemComponentHours {
  // Uren per PLC
  hoursPerPlc: number;

  // Uren per Cabinet HMI
  hoursPerCabinetHmi: number;

  // Uren per Mobile HMI
  hoursPerMobileHmi: number;

  // Extra uren per conveyor bij host systeem
  hostSystemHoursPerConveyor: number;
}

// Interface voor systeem componenten berekening
export interface SystemCalculation {
  // De systeem componenten
  components: SystemComponents;

  // De uur configuratie
  hoursConfig: SystemComponentHours;

  // Totaal PLC uren
  totalPlcHours: number;

  // Totaal HMI uren
  totalHmiHours: number;

  // Totaal host systeem uren
  totalHostSystemHours: number;

  // Totaal externe bedrijven uren
  totalExternalHours: number;

  // Totaal systeem uren
  totalSystemHours: number;
}

// Interface voor het totale project
export interface Project {
  // Naam van het project
  name: string;

  // Systeem componenten
  systemComponents: SystemComponents;

  // Lijst van conveyors in het project
  conveyors: ProjectConveyor[];

  // Totaal aantal programmeeruren voor het hele project (inclusief systeem)
  totalProgrammingHours: number;

  // Totaal aantal testuren voor het hele project
  totalTestingHours: number;

  // Totaal aantal systeem uren
  totalSystemHours: number;

  // Gedetailleerde berekeningen per conveyor type
  calculations: ConveyorCalculation[];

  // Systeem componenten berekening
  systemCalculation: SystemCalculation;

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

// Default configuratie voor systeem componenten uren
export const DEFAULT_SYSTEM_HOURS: SystemComponentHours = {
  hoursPerPlc: 12,              // 12 uur per PLC
  hoursPerCabinetHmi: 2,        // 2 uur per Cabinet HMI
  hoursPerMobileHmi: 8,         // 8 uur per Mobile HMI
  hostSystemHoursPerConveyor: 4 // 4 uur per conveyor bij host systeem
};

// Default systeem componenten
export const DEFAULT_SYSTEM_COMPONENTS: SystemComponents = {
  plcCount: 0,
  cabinetHmiCount: 0,
  mobileHmiCount: 0,
  hasHostSystem: false,
  externalCompanyHours: 0,
};
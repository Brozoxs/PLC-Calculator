import {
  ConveyorType,
  ProjectConveyor,
  ConveyorCalculation,
  Project,
  SystemComponents,
  SystemCalculation,
  SystemComponentHours,
  EfficiencyConfig,
  DEFAULT_EFFICIENCY_CONFIG,
  DEFAULT_SYSTEM_COMPONENTS
} from './types';

/**
 * Hoofdberekeningsmodule voor PLC programmeer- en testuren
 *
 * Deze module bevat alle functies voor het berekenen van uren voor conveyor installaties.
 * De berekeningen houden rekening met efficiëntiewinst bij meerdere identieke conveyors.
 */

/**
 * Bereken de efficiëntiewinst factor voor een gegeven aantal conveyors
 *
 * De efficiëntiewinst wordt berekend volgens de formule:
 * efficiency = 1 - (efficiencyGainFactor * min(quantity - 1, maxEfficiencyUnits))
 *
 * Dit betekent dat elke extra conveyor een percentage besparing oplevert,
 * maar niet oneindig doorloopt.
 *
 * @param quantity - Aantal conveyors van hetzelfde type
 * @param config - Configuratie voor efficiëntiewinst (optioneel, gebruikt default als niet opgegeven)
 * @returns Efficiency factor tussen 0 en 1 (hogere efficiency = lagere factor)
 */
export function calculateEfficiencyFactor(
  quantity: number,
  config: EfficiencyConfig = DEFAULT_EFFICIENCY_CONFIG
): number {
  if (quantity <= 1) {
    return 1.0; // Geen efficiëntiewinst voor 1 conveyor
  }

  // Bereken aantal eenheden waar efficiëntiewinst op van toepassing is
  const efficiencyUnits = Math.min(quantity - 1, config.maxEfficiencyUnits);

  // Bereken efficiency factor
  const efficiencyFactor = 1 - (config.efficiencyGainFactor * efficiencyUnits);

  // Zorg ervoor dat de factor niet negatief wordt
  return Math.max(efficiencyFactor, 0.1); // Minimum 10% van oorspronkelijke uren
}

/**
 * Bereken de gemiddelde uren per conveyor na efficiëntiewinst
 *
 * @param baseHours - Basis aantal uren voor één conveyor
 * @param minimumHours - Minimum aantal uren (voorkomt negatieve resultaten)
 * @param quantity - Aantal conveyors van hetzelfde type
 * @param config - Configuratie voor efficiëntiewinst
 * @returns Gemiddelde aantal uren per conveyor
 */
export function calculateAverageHoursPerConveyor(
  baseHours: number,
  minimumHours: number,
  quantity: number,
  config: EfficiencyConfig = DEFAULT_EFFICIENCY_CONFIG
): number {
  const efficiencyFactor = calculateEfficiencyFactor(quantity, config);
  const calculatedHours = baseHours * efficiencyFactor;

  // Zorg ervoor dat het minimum niet wordt onderschreden
  return Math.max(calculatedHours, minimumHours);
}

/**
 * Bereken de totale uren voor een conveyor type met gegeven aantal
 *
 * @param conveyorType - Het conveyor type waarvoor berekend wordt
 * @param quantity - Aantal conveyors van dit type
 * @param config - Configuratie voor efficiëntiewinst
 * @returns Gedetailleerde berekening voor dit conveyor type
 */
export function calculateConveyorHours(
  conveyorType: ConveyorType,
  quantity: number,
  config: EfficiencyConfig = DEFAULT_EFFICIENCY_CONFIG
): ConveyorCalculation {
  // Bereken gemiddelde uren per conveyor
  const avgProgrammingHours = calculateAverageHoursPerConveyor(
    conveyorType.baseProgrammingHours,
    conveyorType.minimumHours,
    quantity,
    config
  );

  const avgTestingHours = calculateAverageHoursPerConveyor(
    conveyorType.baseTestingHours,
    conveyorType.minimumHours,
    quantity,
    config
  );

  // Totale uren = gemiddelde per conveyor * aantal conveyors
  const totalProgrammingHours = avgProgrammingHours * quantity;
  const totalTestingHours = avgTestingHours * quantity;

  return {
    conveyorType,
    quantity,
    totalProgrammingHours,
    totalTestingHours,
    averageProgrammingHoursPerConveyor: avgProgrammingHours,
    averageTestingHoursPerConveyor: avgTestingHours,
  };
}

/**
 * Bereken uren voor systeem componenten
 *
 * @param systemComponents - De systeem componenten configuratie
 * @param hoursConfig - De uren configuratie voor systeem componenten
 * @param totalConveyors - Totaal aantal conveyors (voor host systeem berekening)
 * @returns Gedetailleerde berekening van systeem componenten
 */
export function calculateSystemHours(
  systemComponents: SystemComponents = DEFAULT_SYSTEM_COMPONENTS,
  hoursConfig: SystemComponentHours,
  totalConveyors: number = 0
): SystemCalculation {
  // Bereken PLC uren
  const totalPlcHours = systemComponents.plcCount * hoursConfig.hoursPerPlc;

  // Bereken HMI uren
  const totalCabinetHmiHours = systemComponents.cabinetHmiCount * hoursConfig.hoursPerCabinetHmi;
  const totalMobileHmiHours = systemComponents.mobileHmiCount * hoursConfig.hoursPerMobileHmi;
  const totalHmiHours = totalCabinetHmiHours + totalMobileHmiHours;

  // Bereken host systeem uren (alleen als aanwezig)
  const totalHostSystemHours = systemComponents.hasHostSystem
    ? totalConveyors * hoursConfig.hostSystemHoursPerConveyor
    : 0;

  // Externe bedrijven uren
  const totalExternalHours = systemComponents.externalCompanyHours;

  // Totaal systeem uren
  const totalSystemHours = totalPlcHours + totalHmiHours + totalHostSystemHours + totalExternalHours;

  return {
    components: systemComponents,
    hoursConfig,
    totalPlcHours,
    totalHmiHours,
    totalHostSystemHours,
    totalExternalHours,
    totalSystemHours,
  };
}

/**
 * Bereken alle uren voor een compleet project
 *
 * @param projectName - Naam van het project
 * @param systemComponents - Systeem componenten configuratie
 * @param projectConveyors - Lijst van conveyors in het project
 * @param config - Configuratie voor efficiëntiewinst
 * @param systemHoursConfig - Configuratie voor systeem componenten uren
 * @returns Compleet project met alle berekeningen
 */
export function calculateProjectHours(
  projectName: string,
  systemComponents: SystemComponents,
  projectConveyors: ProjectConveyor[],
  config: EfficiencyConfig = DEFAULT_EFFICIENCY_CONFIG,
  systemHoursConfig: SystemComponentHours
): Project {
  // Bereken voor elk conveyor type
  const calculations = projectConveyors.map(projectConveyor =>
    calculateConveyorHours(projectConveyor.conveyorType, projectConveyor.quantity, config)
  );

  // Tel alle conveyor uren op
  const conveyorProgrammingHours = calculations.reduce(
    (sum, calc) => sum + calc.totalProgrammingHours,
    0
  );

  const conveyorTestingHours = calculations.reduce(
    (sum, calc) => sum + calc.totalTestingHours,
    0
  );

  // Bereken systeem componenten uren
  const totalConveyors = projectConveyors.reduce((sum, pc) => sum + pc.quantity, 0);
  const systemCalculation = calculateSystemHours(systemComponents, systemHoursConfig, totalConveyors);

  // Totale uren = conveyor uren + systeem uren
  const totalProgrammingHours = conveyorProgrammingHours + systemCalculation.totalSystemHours;
  const totalTestingHours = conveyorTestingHours;

  return {
    name: projectName,
    systemComponents,
    conveyors: projectConveyors,
    totalProgrammingHours,
    totalTestingHours,
    totalSystemHours: systemCalculation.totalSystemHours,
    calculations,
    systemCalculation,
    lastCalculated: new Date(),
  };
}

/**
 * Formatteer een aantal uren naar een leesbare string
 *
 * @param hours - Aantal uren (kan een decimaal zijn)
 * @param decimals - Aantal decimalen om weer te geven (default: 1)
 * @returns Geformatteerde string, bijv. "12.5 uur" of "8 uur"
 */
export function formatHours(hours: number, decimals: number = 1): string {
  if (hours % 1 === 0) {
    return `${hours} uur`;
  }

  return `${hours.toFixed(decimals)} uur`;
}

/**
 * Valideer invoer voor conveyor berekening
 *
 * @param conveyorType - Het conveyor type
 * @param quantity - Aantal conveyors
 * @returns Object met isValid boolean en error message indien ongeldig
 */
export function validateConveyorInput(
  conveyorType: ConveyorType,
  quantity: number
): { isValid: boolean; error?: string } {
  if (quantity < 1) {
    return { isValid: false, error: 'Aantal conveyors moet minimaal 1 zijn' };
  }

  if (quantity > 1000) {
    return { isValid: false, error: 'Aantal conveyors mag maximaal 1000 zijn' };
  }

  if (conveyorType.baseProgrammingHours < 0) {
    return { isValid: false, error: 'Basis programmeeruren mogen niet negatief zijn' };
  }

  if (conveyorType.baseTestingHours < 0) {
    return { isValid: false, error: 'Basis testuren mogen niet negatief zijn' };
  }

  if (conveyorType.minimumHours < 0) {
    return { isValid: false, error: 'Minimum uren mogen niet negatief zijn' };
  }

  if (conveyorType.minimumHours > conveyorType.baseProgrammingHours) {
    return { isValid: false, error: 'Minimum programmeeruren mogen niet hoger zijn dan basis programmeeruren' };
  }

  if (conveyorType.minimumHours > conveyorType.baseTestingHours) {
    return { isValid: false, error: 'Minimum testuren mogen niet hoger zijn dan basis testuren' };
  }

  return { isValid: true };
}
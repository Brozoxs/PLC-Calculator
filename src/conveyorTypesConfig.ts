import { ConveyorType, SystemComponentHours, DEFAULT_SYSTEM_HOURS, DEFAULT_SYSTEM_COMPONENTS } from './types';

/**
 * Configuratiebestand voor alle beschikbare conveyor types
 *
 * Dit bestand bevat de standaard configuratie voor verschillende soorten conveyors
 * die gebruikt kunnen worden in projecten. Elke configuratie bevat:
 * - Basis programmeer- en testuren
 * - Minimum uren (voor efficiëntiewinst bescherming)
 * - Beschrijving voor gebruikers
 *
 * Deze waarden zijn gebaseerd op onze eigen standaarden en kunnen aangepast
 * worden per project of klant.
 * momenteel wordt nog geen rekening gehouden met optimalisatie door generatie en emulatie in deze versie.
 */

export const CONVEYOR_TYPES: ConveyorType[] = [
  {
    id: 'straight-conveyor',
    name: 'doorvoer Conveyor',
    baseProgrammingHours: 2,
    baseTestingHours: 2,
    minimumHours: 2,
    description: 'Standaard rechte conveyor voor transport van 1 pallet.'
  },
  {
    id: 'straightx-conveyor',
    name: 'DoorvoerX Conveyor',
    baseProgrammingHours: 2,
    baseTestingHours: 2,
    minimumHours: 2,
    description: 'Standaard rechte conveyor voor transport van meerdere pallets.'
  },
  {
    id: 'Ontact-conveyor',
    name: 'Aftact Conveyor',
    baseProgrammingHours: 3,
    baseTestingHours: 3,
    minimumHours: 2,
    description: 'Standaard rechte conveyor voor transport en ontacten van meerdere pallets 1 voor 1.'
  },
  {
    id: 'accumulation-conveyor',
    name: 'Intact Conveyor',
    baseProgrammingHours: 3,
    baseTestingHours: 3,
    minimumHours: 3,
    description: 'Conveyor met buffermogelijkheid voor het accumuleren van pallets.'
  },
  {
    id: 'Dropoff-conveyor',
    name: 'Dropoff Conveyor',
    baseProgrammingHours: 2,
    baseTestingHours: 1,
    minimumHours: 1,
    description: 'Conveyor voor het afzetten van pallets.'
  },
  {
    id: 'DropoffAGV-conveyor',
    name: 'Dropoff AGV Conveyor',
    baseProgrammingHours: 3,
    baseTestingHours: 1,
    minimumHours: 1,
    description: 'Conveyor voor het afzetten van pallets met AGV.'
  },
  {
    id: 'PickingAGV-conveyor',
    name: 'Picking AGV Conveyor',
    baseProgrammingHours: 3,
    baseTestingHours: 1,
    minimumHours: 1,
    description: 'Conveyor voor het opnemen van pallets met AGV.'
  },
  {
    id: 'Picking-conveyor',
    name: 'pick Conveyor',
    baseProgrammingHours: 2,
    baseTestingHours: 1,
    minimumHours: 1,
    description: 'Conveyor voor het opnemen van pallets.'
  },
  {
    id: 'Chainlifter-conveyor',
    name: 'Chainlifter Conveyor',
    baseProgrammingHours: 4,
    baseTestingHours: 3,
    minimumHours: 3,
    description: 'ketting heffer voor het in of uitsluizen van pallets 1 of meerdere richtingen.'
  },
  {
    id: 'Rollerlifter-conveyor',
    name: 'Rollerlifter Conveyor',
    baseProgrammingHours: 4,
    baseTestingHours: 3,
    minimumHours: 3,
    description: 'roller lifter voor kruispunten 1 of meerdere richtingen.'
  },
  {
    id: 'turntable-conveyor',
    name: 'Draaitafel Conveyor',
    baseProgrammingHours: 6,
    baseTestingHours: 3,
    minimumHours: 3,
    description: 'Conveyor met roterende tafel. Complexere beweging en positiecontrole vereist.'
  },
  {
    id: 'vertical-conveyor',
    name: 'Lift Conveyor',
    baseProgrammingHours: 8,
    baseTestingHours: 8,
    minimumHours: 8,
    description: 'Verticale transport conveyor. Geavanceerde besturing voor hoogte en veiligheid.'
  }, 
  { 
    id: 'Special-conveyor',
    name: 'specials',
    baseProgrammingHours: 8,
    baseTestingHours: 8,
    minimumHours: 8,
    description: 'Specials in het project waar meer uren voor nodig zijn telt me 8 programmerings- en testuren 16 uren per special.'

  } 
];

/**
 * Haal een conveyor type op basis van ID
 *
 * @param id - De unieke identifier van het conveyor type
 * @returns Het conveyor type object of undefined als niet gevonden
 */
export function getConveyorTypeById(id: string): ConveyorType | undefined {
  return CONVEYOR_TYPES.find(type => type.id === id);
}

/**
 * Haal alle beschikbare conveyor types op
 *
 * @returns Array met alle conveyor types
 */
export function getAllConveyorTypes(): ConveyorType[] {
  return [...CONVEYOR_TYPES];
}

/**
 * Groepeer conveyor types op categorie (indien nodig voor UI)
 * Momenteel alle types in één categorie, maar uitbreidbaar
 */
export const CONVEYOR_CATEGORIES = {
  'Alle Types': CONVEYOR_TYPES
};

/**
 * Default efficiëntiewinst configuratie voor projecten
 * Deze waarden kunnen aangepast worden per project type
 */
export const PROJECT_DEFAULTS = {
  efficiencyGainFactor: 0.15, // 15% besparing per extra conveyor
  maxEfficiencyUnits: 10,     // Maximaal 10 conveyors krijgen efficiëntiewinst
  defaultProjectName: 'Nieuw Project'
};

// Systeem componenten uren configuratie
export const SYSTEM_HOURS_CONFIG: SystemComponentHours = {
  hoursPerPlc: 12,              // 12 uur per PLC
  hoursPerCabinetHmi: 2,        // 2 uur per Cabinet HMI
  hoursPerMobileHmi: 8,         // 8 uur per Mobile HMI
  hostSystemHoursPerConveyor: 1 // 1 uur per conveyor bij host systeem
};

// Default systeem componenten
export { DEFAULT_SYSTEM_COMPONENTS };
import { ConveyorType } from './types';

/**
 * Configuratiebestand voor alle beschikbare conveyor types
 *
 * Dit bestand bevat de standaard configuratie voor verschillende soorten conveyors
 * die gebruikt kunnen worden in projecten. Elke configuratie bevat:
 * - Basis programmeer- en testuren
 * - Minimum uren (voor efficiëntiewinst bescherming)
 * - Beschrijving voor gebruikers
 *
 * Deze waarden zijn gebaseerd op industriële standaarden en kunnen aangepast
 * worden per project of klant.
 */

export const CONVEYOR_TYPES: ConveyorType[] = [
  {
    id: 'straight-conveyor',
    name: 'Rechte Conveyor',
    baseProgrammingHours: 8,
    baseTestingHours: 4,
    minimumHours: 3,
    description: 'Standaard rechte conveyor voor transport van producten. Eenvoudige logica met snelheid- en positiecontrole.'
  },
  {
    id: 'curve-conveyor',
    name: 'Kromme Conveyor',
    baseProgrammingHours: 12,
    baseTestingHours: 6,
    minimumHours: 4,
    description: 'Kromme conveyor met bochtmechanisme. Extra programmeertijd voor synchronisatie en positiecorrectie.'
  },
  {
    id: 'inclined-conveyor',
    name: 'Helleinde Conveyor',
    baseProgrammingHours: 15,
    baseTestingHours: 8,
    minimumHours: 5,
    description: 'Conveyor met helling voor hoogteverschil. Complexere besturing voor snelheid en veiligheid.'
  },
  {
    id: 'accumulation-conveyor',
    name: 'Accumulatie Conveyor',
    baseProgrammingHours: 20,
    baseTestingHours: 12,
    minimumHours: 6,
    description: 'Conveyor met buffermogelijkheid. Geavanceerde logica voor product accumulatie en vrijgave.'
  },
  {
    id: 'sorting-conveyor',
    name: 'Sorteer Conveyor',
    baseProgrammingHours: 25,
    baseTestingHours: 15,
    minimumHours: 8,
    description: 'Conveyor met sorteermogelijkheid. Complex algoritme voor productherkenning en routing.'
  },
  {
    id: 'merger-conveyor',
    name: 'Samenvoeg Conveyor',
    baseProgrammingHours: 18,
    baseTestingHours: 10,
    minimumHours: 6,
    description: 'Conveyor die meerdere lijnen samenvoegt. Synchronisatie tussen meerdere invoerlijnen.'
  },
  {
    id: 'diverter-conveyor',
    name: 'Afsplits Conveyor',
    baseProgrammingHours: 16,
    baseTestingHours: 9,
    minimumHours: 5,
    description: 'Conveyor met mogelijkheid om producten af te splitsen naar verschillende richtingen.'
  },
  {
    id: 'turntable-conveyor',
    name: 'Draaitafel Conveyor',
    baseProgrammingHours: 22,
    baseTestingHours: 14,
    minimumHours: 7,
    description: 'Conveyor met roterende tafel. Complexere beweging en positiecontrole vereist.'
  },
  {
    id: 'vertical-conveyor',
    name: 'Verticale Conveyor',
    baseProgrammingHours: 30,
    baseTestingHours: 18,
    minimumHours: 10,
    description: 'Verticale transport conveyor. Geavanceerde besturing voor hoogte en veiligheid.'
  },
  {
    id: 'pallet-conveyor',
    name: 'Pallet Conveyor',
    baseProgrammingHours: 14,
    baseTestingHours: 7,
    minimumHours: 4,
    description: 'Conveyor voor pallet transport. Robuuste besturing voor zware lasten.'
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
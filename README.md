# PLC Programmeer- en Testuren Calculator

Een moderne webapplicatie voor het automatisch berekenen van ontwikkeltijd voor conveyor installaties, gebouwd met React + TypeScript.

## 🎯 Overzicht

Deze applicatie helpt bij het inschatten van de benodigde programmeer- en testuren voor PLC gestuurde conveyor systemen. Het systeem houdt rekening met efficiëntiewinst bij meerdere identieke conveyors en voorkomt dat uren oneindig dalen door een minimum grens.

## ✨ Functionaliteiten

- **Modulaire architectuur** - Duidelijk gescheiden componenten en logica
- **TypeScript** - Volledige typeveiligheid
- **Efficiëntiewinst berekening** - Automatische besparing bij meerdere conveyors
- **Minimum uren bescherming** - Voorkomt negatieve resultaten
- **Responsive design** - Werkt op desktop en mobiel
- **Uitbreidbaar** - Klaar voor export naar Excel/PDF

## 🚀 Snel Starten

### Vereisten
- Node.js (versie 16+)
- npm of yarn

### Installatie
```bash
# Dependencies installeren
npm install

# Ontwikkelserver starten
npm start

# Productie build maken
npm run build
```

De applicatie is dan beschikbaar op `http://localhost:3000`.

## 📊 Hoe het werkt

### 1. Project Opzetten
- Geef je project een naam
- Stel de efficiëntiewinst parameters in (standaard: 15% besparing per extra conveyor)

### 2. Conveyors Toevoegen
- Selecteer een conveyor type uit de lijst
- Geef het aantal conveyors op
- Herhaal voor alle verschillende types in je project

### 3. Uren Berekenen
- Klik op "Bereken Uren" voor resultaten
- Bekijk totaal overzicht en detail per type
- Zie hoe efficiëntiewinst wordt toegepast

## 🔧 Configuratie

### Conveyor Types
De beschikbare conveyor types zijn gedefinieerd in `src/conveyorTypesConfig.ts`:

```typescript
{
  id: 'straight-conveyor',
  name: 'Rechte Conveyor',
  baseProgrammingHours: 8,      // Basis programmeeruren
  baseTestingHours: 4,          // Basis testuren
  minimumHours: 3,              // Minimum grens
  description: '...'           // Beschrijving
}
```

### Efficiëntiewinst
Standaard configuratie in `src/conveyorTypesConfig.ts`:

```typescript
{
  efficiencyGainFactor: 0.15,   // 15% besparing per extra conveyor
  maxEfficiencyUnits: 10        // Maximaal 10 conveyors krijgen winst
}
```

## 🏗️ Architectuur

### Component Structuur
```
src/
├── components/
│   ├── ProjectInput.tsx      # Invoerscherm voor project
│   └── ResultsDisplay.tsx    # Resultaten weergave
├── types.ts                  # TypeScript interfaces
├── calculations.ts           # Berekeningslogica
├── conveyorTypesConfig.ts    # Configuratie
├── App.tsx                   # Hoofdcomponent
├── App.css                   # Styling
└── index.tsx                 # Applicatie entry point
```

### Belangrijke Types

#### `ConveyorType`
Definieert een type conveyor met basis uren en minimum grenzen.

#### `ProjectConveyor`
Koppelt een conveyor type aan een aantal in een project.

#### `ConveyorCalculation`
Bevat de gedetailleerde berekening voor één conveyor type.

#### `Project`
Complete project met alle berekeningen.

## 🔢 Berekeningslogica

### Efficiëntiewinst Formule
```
efficiency_factor = 1 - (efficiency_gain_factor × min(aantal - 1, max_efficiency_units))
gemiddelde_uren = max(basis_uren × efficiency_factor, minimum_uren)
totaal_uren = gemiddelde_uren × aantal
```

### Voorbeeld
Bij 3 conveyors met 10 basis uren en 15% efficiëntiewinst:
- Eerste conveyor: 10 uur
- Tweede conveyor: 10 × (1 - 0.15) = 8.5 uur
- Derde conveyor: 10 × (1 - 0.15 × 2) = 7 uur
- Totaal: 25.5 uur (gemiddeld 8.5 uur per conveyor)

## 🎨 Styling

De applicatie gebruikt moderne CSS met CSS custom properties voor theming:

- **Primaire kleur**: `#2563eb` (Blauw)
- **Responsive design** met CSS Grid en Flexbox
- **Toegankelijkheid** met juiste contrast ratios
- **Moderne UI** met schaduwen en afgeronde hoeken

## 🔮 Toekomstige Uitbreidingen

- **Export functionaliteit** naar Excel/PDF
- **Database integratie** voor opslag
- **Gebruikersbeheer** met rollen
- **Historie** van berekeningen
- **API integratie** met PLC systemen
- **Meerdere talen** ondersteuning

## 🐛 Probleemoplossing

### Veelvoorkomende Issues

1. **"Root element niet gevonden"**
   - Zorg ervoor dat `public/index.html` een `<div id="root"></div>` bevat

2. **TypeScript fouten**
   - Controleer of alle dependencies geïnstalleerd zijn: `npm install`
   - Controleer TypeScript versie: `npx tsc --version`

3. **Build fouten**
   - Wis node_modules: `rm -rf node_modules && npm install`
   - Controleer webpack configuratie

## 📝 Licentie

MIT License - Zie LICENSE bestand voor details.

## 👨‍💻 Bijdragen

1. Fork het project
2. Maak een feature branch: `git checkout -b feature/nieuwe-functie`
3. Commit je wijzigingen: `git commit -am 'Nieuwe functie toegevoegd'`
4. Push naar branch: `git push origin feature/nieuwe-functie`
5. Maak een Pull Request

## 📞 Contact

Voor vragen of ondersteuning, neem contact op met de ontwikkelaar.
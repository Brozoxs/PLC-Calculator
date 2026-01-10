import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Hoofdingangspunt van de React applicatie
 *
 * Deze file initialiseert de React applicatie en mount deze
 * in de DOM op het element met id 'root'.
 */

// Vind het root element in de HTML
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element niet gevonden. Zorg ervoor dat er een div met id="root" in de HTML staat.');
}

// Maak een React root en render de App component
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
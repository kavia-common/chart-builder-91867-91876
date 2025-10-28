import React, { useEffect, useState } from 'react';
import './App.css';
import './theme/theme.css';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ChartCanvas from './components/ChartCanvas';
import DataTable from './components/DataTable';
import { getSampleData } from './utils/sampleData';

/**
 * PUBLIC_INTERFACE
 * App: Base application shell with Ocean Professional theme and layout.
 * - Top navigation
 * - Sidebar placeholder
 * - Main workspace with Chart and Data table
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [data] = useState(getSampleData());

  // Apply theme attribute for CSS variables switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-shell">
      <TopNav theme={theme} onToggleTheme={toggleTheme} />
      <Sidebar />
      <main className="main">
        <div className="panel">
          <ChartCanvas />
          <DataTable data={data} />
        </div>
      </main>
    </div>
  );
}

export default App;

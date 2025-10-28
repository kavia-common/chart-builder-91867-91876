import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './theme/theme.css';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ChartCanvas from './components/ChartCanvas';
import DataTable from './components/DataTable';
import ImportDataModal from './components/ImportDataModal';
import { getSampleData } from './utils/sampleData';
import { parseCsv } from './utils/csv';
import { ChartBuilderProvider, useChartBuilderStore } from './state/useChartBuilderStore';

/**
 * PUBLIC_INTERFACE
 * AppShell: Inner app that assumes a provided store via ChartBuilderProvider.
 */
function AppShell() {
  const [theme, setTheme] = useState('light');

  // Store access via context
  const { state, update } = useChartBuilderStore();
  const { data, chartType, xKey, yKeys, showLegend, colors } = state;

  // Apply theme attribute for CSS variables switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Collapsible table
  const [tableOpen, setTableOpen] = useState(true);
  const toggleTable = () => setTableOpen((v) => !v);

  // Import states
  const [importOpen, setImportOpen] = useState(false);
  const fileInputRef = useRef(null);

  // PUBLIC_INTERFACE
  const triggerImport = () => setImportOpen(true);

  // Keep quick file import support (hidden input) for convenience
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      const rows = parseCsv(String(text || ''));
      if (rows.length) {
        // Guess keys
        const cols = Object.keys(rows[0]);
        const newX = cols[0] || 'x';
        const newY = cols.slice(1).filter(Boolean);
        update({
          data: rows,
          xKey: newX,
          yKeys: newY.length ? newY : ['value'],
        });
        setTableOpen(true);
      }
    };
    reader.readAsText(file);
    // reset input so same file can be selected twice
    e.target.value = '';
  };

  // PUBLIC_INTERFACE
  const handleExportCSV = () => {
    const rows = Array.isArray(data) ? data : [];
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    // Quote fields containing commas or quotes
    const esc = (v) => {
      const s = String(v ?? '');
      if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const csv = [cols.map(esc).join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PUBLIC_INTERFACE
  const loadSample = () => {
    const sample = getSampleData();
    update({ data: sample, xKey: 'category', yKeys: ['value'] });
    setTableOpen(true);
  };

  // Memoized columns for small helpers
  const columns = useMemo(() => (Array.isArray(data) && data[0] ? Object.keys(data[0]) : []), [data]);

  return (
    <div className="app-shell">
      <TopNav
        theme={theme}
        onToggleTheme={toggleTheme}
        onImport={triggerImport}
        onExport={handleExportCSV}
      />

      {/* Retain hidden file input as a secondary import path (not primary) */}
      <input
        type="file"
        accept=".csv,text/csv"
        ref={fileInputRef}
        onChange={handleImportFile}
        style={{ display: 'none' }}
      />

      {/* Import Modal */}
      <ImportDataModal open={importOpen} onClose={() => setImportOpen(false)} />

      <Sidebar
        // Chart Type
        chartType={chartType}
        onChangeChartType={(t) => update({ chartType: t })}
        // Data
        onLoadSample={loadSample}
        // Appearance
        colors={colors}
        onChangeColor={(i, val) => {
          const next = [...colors];
          next[i] = val;
          update({ colors: next });
        }}
        // Axes & legend
        xKey={xKey}
        yKeys={yKeys}
        availableColumns={columns}
        onChangeXKey={(val) => update({ xKey: val })}
        onToggleYKey={(yk) => {
          const set = new Set(yKeys || []);
          if (set.has(yk)) set.delete(yk);
          else set.add(yk);
          update({ yKeys: Array.from(set) });
        }}
        showLegend={showLegend}
        onToggleLegend={() => update({ showLegend: !showLegend })}
      />

      <main className="main">
        <div className="panel">
          <ChartCanvas />
          <div className={`collapsible ${tableOpen ? 'open' : ''}`}>
            <div className="collapsible-header">
              <div className="collapsible-title">Data Table</div>
              <button className="btn btn-ghost" onClick={toggleTable} aria-expanded={tableOpen}>
                {tableOpen ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="collapsible-body">
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * App: Wraps AppShell in ChartBuilderProvider to seed initial state.
 */
function App() {
  return (
    <ChartBuilderProvider
      initial={{
        chartType: 'bar',
        xKey: 'category',
        yKeys: ['value'],
        showLegend: true,
        data: getSampleData(),
        colors: ['#2563EB', '#F59E0B', '#10B981', '#EF4444'],
      }}
    >
      <AppShell />
    </ChartBuilderProvider>
  );
}

export default App;

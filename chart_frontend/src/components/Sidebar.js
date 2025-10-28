import React from 'react';
import ChartTypeSelect from './Controls/ChartTypeSelect';
import ColorPicker from './Controls/ColorPicker';
import AxesSettings from './Controls/AxesSettings';
import LegendToggle from './Controls/LegendToggle';
import { getSampleDatasetNames, getSampleDatasetByName } from '../utils/sampleData';
import { useChartBuilderStore } from '../state/useChartBuilderStore';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Control panel for chart configuration.
 * Props:
 * - chartType: 'bar' | 'line' | 'pie'
 * - onChangeChartType: (t: string) => void
 * - onLoadSample: () => void
 * - colors: string[]
 * - onChangeColor: (index: number, value: string) => void
 * - xKey: string
 * - yKeys: string[]
 * - availableColumns: string[]
 * - onChangeXKey: (val: string) => void
 * - onToggleYKey: (yk: string) => void
 * - showLegend: boolean
 * - onToggleLegend: () => void
 * - open?: boolean                // responsive open/close for mobile
 * - onClose?: () => void          // optional close handler
 */
function Sidebar({
  chartType = 'bar',
  onChangeChartType = () => {},
  onLoadSample = () => {},
  colors = [],
  onChangeColor = () => {},
  xKey = '',
  yKeys = [],
  availableColumns = [],
  onChangeXKey = () => {},
  onToggleYKey = () => {},
  showLegend = true,
  onToggleLegend = () => {},
  open = false,
  onClose = () => {},
}) {
  const { loadDataset } = useChartBuilderStore();
  const sampleNames = getSampleDatasetNames();

  const sectionTitle = (title) => (
    <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>{title}</div>
  );

  return (
    <aside
      id="app-sidebar"
      className={`sidebar scroll-y ${open ? 'open' : ''}`}
      aria-label="Chart configuration sidebar"
      aria-hidden={!open && window.matchMedia && window.matchMedia('(max-width: 900px)').matches}
    >
      <div className="card" style={{ padding: 12, display: 'grid', gap: 14 }}>
        {/* Close for mobile */}
        <div className="sidebar-mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>Settings</div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close sidebar">✕</button>
        </div>

        {/* Chart Type */}
        <section aria-labelledby="sec-chart-type">
          <div id="sec-chart-type" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }}>
            Chart Type
          </div>
          {sectionTitle('Chart Type')}
          <ChartTypeSelect value={chartType} onChange={onChangeChartType} />
        </section>

        {/* Data */}
        <section aria-labelledby="sec-data">
          <div id="sec-data" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }}>
            Data
          </div>
          {sectionTitle('Data')}
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              {sampleNames.map((name) => (
                <button
                  key={name}
                  className="btn btn-secondary"
                  onClick={() => {
                    const ds = getSampleDatasetByName(name);
                    if (ds) loadDataset(ds);
                  }}
                >
                  Load {name}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={onLoadSample} aria-label="Load quick demo dataset">
              Quick Demo Dataset
            </button>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Import CSV from the top bar to use your own data.
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section aria-labelledby="sec-appearance">
          <div id="sec-appearance" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }}>
            Appearance
          </div>
          {sectionTitle('Appearance')}
          <ColorPicker colors={colors} onChangeColor={onChangeColor} />
        </section>

        {/* Axes */}
        {chartType !== 'pie' && (
          <section aria-labelledby="sec-axes">
            <div id="sec-axes" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }}>
              Axes
            </div>
            {sectionTitle('Axes')}
            <AxesSettings
              xKey={xKey}
              yKeys={yKeys}
              availableColumns={availableColumns}
              onChangeXKey={onChangeXKey}
              onToggleYKey={onToggleYKey}
            />
          </section>
        )}

        {/* Legend */}
        <section aria-labelledby="sec-legend">
          <div id="sec-legend" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px,1px,1px,1px)' }}>
            Legend
          </div>
          {sectionTitle('Legend')}
          <LegendToggle value={showLegend} onToggle={onToggleLegend} />
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;

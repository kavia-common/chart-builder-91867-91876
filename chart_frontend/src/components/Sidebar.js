import React from 'react';
import ChartTypeSelect from './Controls/ChartTypeSelect';
import ColorPicker from './Controls/ColorPicker';
import AxesSettings from './Controls/AxesSettings';
import LegendToggle from './Controls/LegendToggle';

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
}) {
  const sectionTitle = (title) => (
    <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>{title}</div>
  );

  return (
    <aside className="sidebar scroll-y">
      <div className="card" style={{ padding: 12, display: 'grid', gap: 14 }}>
        {/* Chart Type */}
        <section>
          {sectionTitle('Chart Type')}
          <ChartTypeSelect value={chartType} onChange={onChangeChartType} />
        </section>

        {/* Data */}
        <section>
          {sectionTitle('Data')}
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onLoadSample}>
              Load Sample
            </button>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Import CSV from the top bar to use your own data.
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          {sectionTitle('Appearance')}
          <ColorPicker colors={colors} onChangeColor={onChangeColor} />
        </section>

        {/* Axes */}
        {chartType !== 'pie' && (
          <section>
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
        <section>
          {sectionTitle('Legend')}
          <LegendToggle value={showLegend} onToggle={onToggleLegend} />
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;

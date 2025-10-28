import React from 'react';

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
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn ${chartType === 'bar' ? '' : 'btn-ghost'}`}
                onClick={() => onChangeChartType('bar')}
                aria-pressed={chartType === 'bar'}
              >
                Bar
              </button>
              <button
                className={`btn ${chartType === 'line' ? '' : 'btn-ghost'}`}
                onClick={() => onChangeChartType('line')}
                aria-pressed={chartType === 'line'}
              >
                Line
              </button>
              <button
                className={`btn ${chartType === 'pie' ? '' : 'btn-ghost'}`}
                onClick={() => onChangeChartType('pie')}
                aria-pressed={chartType === 'pie'}
              >
                Pie
              </button>
            </div>
          </div>
        </section>

        {/* Data */}
        <section>
          {sectionTitle('Data')}
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onLoadSample}>Load Sample</button>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Import CSV from the top bar to use your own data.
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          {sectionTitle('Appearance')}
          <div style={{ display: 'grid', gap: 8 }}>
            {colors.map((c, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Series {i + 1}</div>
                <input
                  type="color"
                  value={c}
                  onChange={(e) => onChangeColor(i, e.target.value)}
                  aria-label={`Color for series ${i + 1}`}
                  style={{
                    height: 28,
                    width: 40,
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    background: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Axes */}
        {chartType !== 'pie' && (
          <section>
            {sectionTitle('Axes')}
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>X Axis</label>
              <select
                value={xKey || ''}
                onChange={(e) => onChangeXKey(e.target.value)}
                className="card"
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                }}
              >
                {availableColumns.map((c) => (
                  <option value={c} key={c}>{c}</option>
                ))}
              </select>

              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Y Series</label>
              <div style={{ display: 'grid', gap: 6 }}>
                {availableColumns.filter((c) => c !== xKey).map((c) => {
                  const checked = yKeys.includes(c);
                  return (
                    <label
                      key={c}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        transition: 'border-color .2s ease, background .2s ease',
                        background: checked ? 'rgba(37,99,235,.06)' : 'var(--color-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleYKey(c)}
                        aria-label={`Toggle series ${c}`}
                      />
                      <span>{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Legend */}
        <section>
          {sectionTitle('Legend')}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Show legend</div>
            <button className="btn btn-ghost" onClick={onToggleLegend} aria-pressed={showLegend}>
              {showLegend ? 'On' : 'Off'}
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;

import React from 'react';

/**
 * PUBLIC_INTERFACE
 * AxesSettings: Controls for selecting xKey and toggling yKeys for Cartesian charts.
 * Props:
 * - xKey: string
 * - yKeys: string[]
 * - availableColumns: string[]
 * - onChangeXKey: (val: string) => void
 * - onToggleYKey: (yk: string) => void
 */
function AxesSettings({
  xKey = '',
  yKeys = [],
  availableColumns = [],
  onChangeXKey = () => {},
  onToggleYKey = () => {},
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label htmlFor="x-axis-select" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>X Axis</label>
      <select
        id="x-axis-select"
        aria-label="Select X axis"
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
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>

      <label style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
        Y Series
      </label>
      <div style={{ display: 'grid', gap: 6 }}>
        {availableColumns
          .filter((c) => c !== xKey)
          .map((c) => {
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
                  border: `1px solid ${
                    checked ? 'var(--color-primary)' : 'var(--color-border)'
                  }`,
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
  );
}

export default AxesSettings;

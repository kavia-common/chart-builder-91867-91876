import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ChartTypeSelect: A compact control to select chart type.
 * Props:
 * - value: 'bar' | 'line' | 'pie'
 * - onChange: (nextType: string) => void
 */
function ChartTypeSelect({ value = 'bar', onChange = () => {} }) {
  const types = [
    { key: 'bar', label: 'Bar' },
    { key: 'line', label: 'Line' },
    { key: 'pie', label: 'Pie' },
  ];

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {types.map((t) => (
        <button
          key={t.key}
          className={`btn ${value === t.key ? '' : 'btn-ghost'}`}
          onClick={() => onChange(t.key)}
          aria-pressed={value === t.key}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default ChartTypeSelect;

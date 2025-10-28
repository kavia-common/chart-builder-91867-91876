import React from 'react';

/**
 * PUBLIC_INTERFACE
 * LegendToggle: Simple on/off toggle for legend visibility.
 * Props:
 * - value: boolean
 * - onToggle: () => void
 */
function LegendToggle({ value = true, onToggle = () => {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Show legend</div>
      <button className="btn btn-ghost" onClick={onToggle} aria-pressed={value}>
        {value ? 'On' : 'Off'}
      </button>
    </div>
  );
}

export default LegendToggle;

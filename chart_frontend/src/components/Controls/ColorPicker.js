import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ColorPicker: Renders a list of color inputs for series colors.
 * Props:
 * - colors: string[]
 * - onChangeColor: (index: number, hex: string) => void
 */
function ColorPicker({ colors = [], onChangeColor = () => {} }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
            Series {i + 1}
          </div>
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
  );
}

export default ColorPicker;

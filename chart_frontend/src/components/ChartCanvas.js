import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ChartCanvas: Placeholder area where the chart will render.
 */
function ChartCanvas() {
  return (
    <div className="workspace">
      <div>
        <div style={{ textAlign: 'center', marginBottom: 6, color: 'var(--color-text)' }}>
          Chart Workspace
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          Your chart will render here.
        </div>
      </div>
    </div>
  );
}

export default ChartCanvas;

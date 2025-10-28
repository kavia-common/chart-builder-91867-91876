import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TopNav: Application top navigation bar with brand and action buttons.
 * Props:
 * - theme: "light" | "dark"
 * - onToggleTheme: () => void
 * - onImport?: () => void
 * - onExport?: () => void
 */
function TopNav({ theme, onToggleTheme, onImport, onExport }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="topnav">
      <div className="brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12c0-4.97 4.03-9 9-9 2.49 0 4.74 1.01 6.36 2.64l-2.12 2.12A6.996 6.996 0 0 0 12 5a7 7 0 1 0 6.76 9h3.07A10 10 0 1 1 3 12z" fill="url(#g)"/>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="24" y2="24">
              <stop stopColor="#2563EB" stopOpacity="0.85"/>
              <stop offset="1" stopColor="#F59E0B" stopOpacity="0.85"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Chart Builder</span>
        <span className="badge">Ocean</span>
      </div>

      <div className="actions">
        <button className="btn btn-ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button className="btn btn-ghost" onClick={onImport} aria-label="Import data">Import</button>

        <div className="menu" style={{ position: 'relative' }}>
          <button
            className="btn"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Export
          </button>
          {open && (
            <div
              role="menu"
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                padding: 8,
                minWidth: 180,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 20,
              }}
            >
              <button className="btn-ghost btn" style={{ width: '100%', marginBottom: 6 }} onClick={onExport}>
                CSV (.csv)
              </button>
              <button className="btn-ghost btn" style={{ width: '100%' }} onClick={() => setOpen(false)}>
                Image (coming soon)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;

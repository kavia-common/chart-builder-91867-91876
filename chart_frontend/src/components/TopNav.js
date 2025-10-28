import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TopNav: Application top navigation bar with brand and action buttons.
 * Props:
 * - theme: "light" | "dark"
 * - onToggleTheme: () => void
 * - onImport?: () => void
 * - onExportCSV?: () => void
 * - onExportPNG?: () => void
 * - onExportJSON?: () => void
 * - onToggleSidebar?: () => void   // Mobile sidebar toggle
 * - isSidebarOpen?: boolean        // Sidebar open state for ARIA
 */
function TopNav({
  theme,
  onToggleTheme,
  onImport,
  onExportCSV,
  onExportPNG,
  onExportJSON,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const [open, setOpen] = useState(false);
  const exportBtnRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  // Close export menu on outside click / Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      const menu = document.getElementById('export-menu');
      if (!menu) return;
      if (
        !menu.contains(e.target) &&
        exportBtnRef.current &&
        !exportBtnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [open]);

  return (
    <header className="topnav" role="banner">
      <div className="brand" aria-label="Application brand">
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

      <div className="actions" role="navigation" aria-label="Top bar controls">
        {/* Mobile sidebar toggle */}
        <button
          className="btn btn-ghost"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-controls="app-sidebar"
          aria-expanded={!!isSidebarOpen}
        >
          ☰ Menu
        </button>

        <button className="btn btn-ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button className="btn btn-ghost" onClick={onImport} aria-label="Import data">Import</button>

        <div className="menu" style={{ position: 'relative' }}>
          <button
            ref={exportBtnRef}
            className="btn"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="export-menu"
          >
            Export
          </button>
          {open && (
            <div
              id="export-menu"
              role="menu"
              aria-label="Export options"
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
              <button
                ref={firstMenuItemRef}
                className="btn-ghost btn"
                style={{ width: '100%', marginBottom: 6 }}
                role="menuitem"
                onClick={() => {
                  onExportCSV?.();
                  setOpen(false);
                }}
              >
                CSV (.csv)
              </button>
              <button
                className="btn-ghost btn"
                style={{ width: '100%', marginBottom: 6 }}
                role="menuitem"
                onClick={() => {
                  onExportPNG?.();
                  setOpen(false);
                }}
              >
                PNG (.png)
              </button>
              <button
                className="btn-ghost btn"
                style={{ width: '100%' }}
                role="menuitem"
                onClick={() => {
                  onExportJSON?.();
                  setOpen(false);
                }}
              >
                JSON (.json)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;

import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Placeholder panel for chart controls, datasets, and properties.
 */
function Sidebar() {
  return (
    <aside className="sidebar scroll-y">
      <div className="card" style={{ padding: 12 }}>
        <h3 style={{ margin: '4px 0 8px 0', fontSize: 14 }}>Controls</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <button className="btn-ghost btn">Add Series</button>
          <button className="btn-ghost btn">Appearance</button>
          <button className="btn-ghost btn">Data</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

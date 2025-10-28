import React from 'react';

/**
 * PUBLIC_INTERFACE
 * DataTable: Minimal table preview for sample dataset.
 * Props:
 * - data: Array<{ [key: string]: string | number }>
 */
function DataTable({ data = [] }) {
  if (!data.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div style={{ color: 'var(--color-text-muted)' }}>No data</div>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="card table">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((c) => (
                <td key={c}>{row[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

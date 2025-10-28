import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopNav from '../TopNav';

describe('TopNav', () => {
  test('shows brand title and theme toggle, import, and export buttons', () => {
    const mock = jest.fn();
    render(
      <TopNav
        theme="light"
        onToggleTheme={mock}
        onImport={mock}
        onExportCSV={mock}
        onExportPNG={mock}
        onExportJSON={mock}
        onToggleSidebar={mock}
        isSidebarOpen={false}
      />
    );

    expect(screen.getByText(/Chart Builder/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  test('opens export menu with CSV/PNG/JSON options', () => {
    const mock = jest.fn();
    render(
      <TopNav
        theme="light"
        onToggleTheme={mock}
        onImport={mock}
        onExportCSV={mock}
        onExportPNG={mock}
        onExportJSON={mock}
        onToggleSidebar={mock}
        isSidebarOpen={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    expect(screen.getByRole('menu', { name: /export options/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /csv/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /png/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /json/i })).toBeInTheDocument();
  });
}

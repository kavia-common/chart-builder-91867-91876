import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';

// Helper to render the app
const renderApp = () => render(<App />);

describe('App smoke tests', () => {
  test('renders without crashing and shows brand title', () => {
    renderApp();
    // Brand title "Chart Builder" is in the TopNav
    expect(screen.getByText(/Chart Builder/i)).toBeInTheDocument();
  });

  test('TopNav is present with Import and Export controls', async () => {
    renderApp();
    // Import button
    const importBtn = screen.getByRole('button', { name: /import data/i });
    expect(importBtn).toBeInTheDocument();

    // Export button (opens menu on click)
    const exportBtn = screen.getByRole('button', { name: /export/i });
    expect(exportBtn).toBeInTheDocument();
  });

  test('Sidebar renders with key sections', () => {
    renderApp();

    // Sidebar is present in the DOM (may be off-canvas on mobile but exists)
    const sidebar = screen.getByLabelText(/chart configuration sidebar/i);
    expect(sidebar).toBeInTheDocument();

    // Within sidebar card, verify visible section titles
    const sidebarCard = within(sidebar).getByText(/Chart Type/i).closest('.card') || sidebar;

    // Check for each section title text (visible headings rendered)
    expect(within(sidebar).getByText(/Chart Type/i)).toBeInTheDocument();
    expect(within(sidebar).getByText(/Data/i)).toBeInTheDocument();
    expect(within(sidebar).getByText(/Appearance/i)).toBeInTheDocument();
    // Axes only for non-pie by default; initial chart type is 'bar'
    expect(within(sidebar).getByText(/Axes/i)).toBeInTheDocument();
    expect(within(sidebar).getByText(/Legend/i)).toBeInTheDocument();
  });

  test('renders a default chart using sample data', () => {
    renderApp();
    // ChartCanvas renders a heading with the chart type uppercased
    expect(screen.getByText('BAR')).toBeInTheDocument();

    // Recharts renders an SVG element inside the ResponsiveContainer; ensure an svg is present
    const svgs = screen.getAllByRole('img', { hidden: true }).filter(el => el.tagName.toLowerCase() === 'svg');
    // Fallback: querySelector for svg if role-based detection is unreliable in jsdom
    const anySvg = document.querySelector('svg');
    expect(svgs.length > 0 || anySvg).toBeTruthy();
  });

  test('Data table is present and shows sample data headers', () => {
    renderApp();
    // The collapsible section contains a "Data Table" title and a table within
    expect(screen.getByText(/Data Table/i)).toBeInTheDocument();

    // Using sample data headers: category, value
    // The table is rendered with th elements
    const headerCategory = screen.getByRole('columnheader', { name: /category/i });
    const headerValue = screen.getByRole('columnheader', { name: /value/i });
    expect(headerCategory).toBeInTheDocument();
    expect(headerValue).toBeInTheDocument();
  });
});

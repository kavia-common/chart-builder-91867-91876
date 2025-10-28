import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  test('renders all key sections for non-pie chart', () => {
    render(
      <Sidebar
        chartType="bar"
        onChangeChartType={() => {}}
        onLoadSample={() => {}}
        colors={['#2563EB']}
        onChangeColor={() => {}}
        xKey="category"
        yKeys={['value']}
        availableColumns={['category', 'value']}
        onChangeXKey={() => {}}
        onToggleYKey={() => {}}
        showLegend={true}
        onToggleLegend={() => {}}
        open={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/Chart Type/i)).toBeInTheDocument();
    expect(screen.getByText(/^Data$/i)).toBeInTheDocument();
    expect(screen.getByText(/Appearance/i)).toBeInTheDocument();
    expect(screen.getByText(/Axes/i)).toBeInTheDocument();
    expect(screen.getByText(/Legend/i)).toBeInTheDocument();
  });
});

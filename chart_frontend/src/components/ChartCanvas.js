import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useChartBuilderStore } from '../state/useChartBuilderStore';

/**
 * PUBLIC_INTERFACE
 * ChartCanvas: Renders a minimal Recharts chart (Line/Bar/Pie) using responsive container.
 * - Uses local store state: chartType, data, xKey, yKeys, colors, showLegend
 * - Provides safe in-file fallback dataset and defaults
 */
function ChartCanvas() {
  // initialize a minimal local store with sensible defaults for first render
  const { state } = useChartBuilderStore({
    chartType: 'bar',
    xKey: 'category',
    yKeys: ['value'],
    colors: ['#2563EB', '#F59E0B', '#10B981', '#EF4444'],
    showLegend: true,
    data: [],
  });

  // local fallback dataset if no external data provided
  const fallbackData = useMemo(
    () => [
      { category: 'Q1', value: 120, value2: 60 },
      { category: 'Q2', value: 180, value2: 90 },
      { category: 'Q3', value: 90, value2: 30 },
      { category: 'Q4', value: 150, value2: 75 },
    ],
    []
  );

  const {
    chartType = 'bar',
    data = [],
    xKey = 'category',
    yKeys = ['value'],
    colors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444'],
    showLegend = true,
  } = state || {};

  const dataset = Array.isArray(data) && data.length ? data : fallbackData;

  const hasValidKeys =
    dataset.length > 0 &&
    typeof xKey === 'string' &&
    Array.isArray(yKeys) &&
    yKeys.length > 0 &&
    Object.prototype.hasOwnProperty.call(dataset[0], xKey);

  // Graceful fallback message if data or keys are not sufficient
  if (!hasValidKeys) {
    return (
      <div className="workspace">
        <div>
          <div style={{ textAlign: 'center', marginBottom: 6, color: 'var(--color-text)' }}>
            Chart Workspace
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            Not enough data to render chart. Please provide data, xKey and yKeys.
          </div>
        </div>
      </div>
    );
  }

  // Helpers to render series based on chartType
  const renderCartesianAxes = () => (
    <>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      {showLegend ? <Legend /> : null}
    </>
  );

  const renderLineSeries = () =>
    yKeys.map((k, idx) => (
      <Line
        key={k}
        type="monotone"
        dataKey={k}
        stroke={colors[idx % colors.length]}
        dot={false}
        strokeWidth={2}
        activeDot={{ r: 6 }}
      />
    ));

  const renderBarSeries = () =>
    yKeys.map((k, idx) => (
      <Bar key={k} dataKey={k} fill={colors[idx % colors.length]} radius={[6, 6, 0, 0]} />
    ));

  // Pie uses first yKey only for a simple minimal rendering
  const renderPieSeries = () => {
    const valueKey = yKeys[0];
    return (
      <Pie
        data={dataset}
        dataKey={valueKey}
        nameKey={xKey}
        cx="50%"
        cy="50%"
        outerRadius="75%"
        label
      >
        {dataset.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    );
  };

  return (
    <div className="card" style={{ padding: 12, minHeight: 360 }}>
      <div style={{ marginBottom: 8, color: 'var(--color-text)' }}>
        {chartType?.toString().toUpperCase() || 'CHART'}
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={dataset} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              {renderCartesianAxes()}
              {renderLineSeries()}
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={dataset} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              {renderCartesianAxes()}
              {renderBarSeries()}
            </BarChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Tooltip />
              {showLegend ? <Legend /> : null}
              {renderPieSeries()}
            </PieChart>
          ) : (
            // Unknown chart type fallback
            <BarChart data={dataset} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              {renderCartesianAxes()}
              {renderBarSeries()}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartCanvas;

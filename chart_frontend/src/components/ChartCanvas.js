import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
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
 * - Uses global store state: chartType, data, xKey, yKeys, colors, showLegend
 * - Provides safe in-file fallback dataset and defaults
 *
 * Exposes a ref API:
 * - getPngDataUrl(): Promise<string> - returns a PNG data URL of the chart card area.
 */
const ChartCanvas = forwardRef(function ChartCanvas(_props, ref) {
  // Access store only (App is the single source of truth)
  const { state } = useChartBuilderStore();

  // containerRef will wrap the visible chart area we want to export
  const containerRef = useRef(null);

  // PUBLIC_INTERFACE
  // Expose export helpers to parent via ref.
  useImperativeHandle(ref, () => ({
    /**
     * PUBLIC_INTERFACE
     * getPngDataUrl: Renders the current chart area into a PNG data URL.
     * Attempts to serialize the DOM node by drawing it into a canvas.
     * Note: This is a best-effort approach and may not perfectly capture
     * all SVG/CSS effects. It avoids external deps to keep the template lightweight.
     */
    async getPngDataUrl() {
      const node = containerRef.current;
      if (!node) {
        throw new Error('Chart container not available for export.');
      }

      // Create an offscreen canvas matching the node's bounding box
      const rect = node.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const scale = window.devicePixelRatio || 1;

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // Fill background based on theme surface color
      const bg =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--color-surface')
          ?.trim() || '#ffffff';
      ctx.fillStyle = bg || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);

      // Approach:
      // 1) Try to clone the DOM node into an inline SVG via foreignObject
      // 2) Render that SVG to an image then draw into the canvas
      const cloned = node.cloneNode(true);
      // Normalize styles by inlining computed styles on the cloned subtree to reduce missing CSS in foreignObject
      inlineAllComputedStyles(cloned);

      const serializedHtml = new XMLSerializer().serializeToString(cloned);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject x="0" y="0" width="100%" height="100%">
            ${serializedHtml}
          </foreignObject>
        </svg>
      `;
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      try {
        const img = await loadImage(svgUrl);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(svgUrl);
        return canvas.toDataURL('image/png');
      } catch (e) {
        // fallback: return a background-only image to avoid throwing in UI
        URL.revokeObjectURL(svgUrl);
        return canvas.toDataURL('image/png');
      }
    },
  }));

  // Utility: load image from URL as Promise
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Attempt to relax tainted canvas issues where possible
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  // Utility: Inline computed styles recursively to make foreignObject render closer to on-screen result
  function inlineAllComputedStyles(el) {
    const win = document.defaultView || window;
    if (!win) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null);
    // First node is el
    let current = el;
    while (current) {
      if (current instanceof Element) {
        const style = win.getComputedStyle(current);
        const cssText = Array.from(style)
          .map((prop) => `${prop}:${style.getPropertyValue(prop)};`)
          .join('');
        current.setAttribute('style', cssText);
      }
      current = walker.nextNode();
    }
  }

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
        {dataset.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    );
  };

  return (
    <div className="card" style={{ padding: 12, minHeight: 360 }} ref={containerRef}>
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
});

export default ChartCanvas;

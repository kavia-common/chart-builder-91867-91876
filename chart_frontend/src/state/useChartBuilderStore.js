import { useRef, useState } from 'react';

let singleton = null;

/**
 * PUBLIC_INTERFACE
 * useChartBuilderStore: Minimal local-store hook for managing chart state.
 * This is a placeholder for future state management (e.g., Zustand).
 * Behavior:
 * - First caller seeds initial state (optional).
 * - All callers receive the same store object instance.
 */
export function useChartBuilderStore(initial) {
  // Hooks must always run - never early-return before them.
  const internal = useRef(null);

  // Initialize state with a lazy initializer to incorporate `initial` only once.
  const [state, setState] = useState(() => ({
    chartType: 'bar',
    series: [],
    data: [],
    xKey: 'category',
    yKeys: ['value'],
    colors: ['#2563EB', '#F59E0B', '#10B981', '#EF4444'],
    showLegend: true,
    ...(initial || {}),
  }));

  // PUBLIC_INTERFACE
  function update(patch) {
    setState((s) => ({ ...s, ...patch }));
  }

  // Create store object once per hook instance
  if (!internal.current) {
    internal.current = { state, update };
  }

  // Maintain a module-level reference but do not skip hooks; simply prefer
  // the first-created instance for cross-component sharing.
  if (singleton == null) {
    singleton = internal.current;
  }

  return singleton || internal.current;
}

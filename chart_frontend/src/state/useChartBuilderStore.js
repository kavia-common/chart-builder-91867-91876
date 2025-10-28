import { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useChartBuilderStore: Minimal local-store hook for managing chart state.
 * This is a placeholder for future state management (e.g., Zustand).
 */
export function useChartBuilderStore(initial = {}) {
  const [state, setState] = useState({
    chartType: 'bar',
    series: [],
    data: [],
    ...initial,
  });

  // PUBLIC_INTERFACE
  function update(patch) {
    setState((s) => ({ ...s, ...patch }));
  }

  return { state, update };
}

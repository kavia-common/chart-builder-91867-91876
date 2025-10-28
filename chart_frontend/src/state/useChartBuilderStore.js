import React, { createContext, useContext, useMemo, useReducer } from 'react';

/**
 * INTERNAL: Shape of the chart builder state
 */
const initialState = {
  chartType: 'bar',
  data: [],
  xKey: 'category',
  yKeys: ['value'],
  colors: ['#2563EB', '#F59E0B', '#10B981', '#EF4444'],
  showLegend: true,
};

/**
 * INTERNAL: Reducer to update state via small patch merges
 */
function reducer(state, action) {
  switch (action.type) {
    case 'PATCH':
      return { ...state, ...(action.patch || {}) };
    case 'RESET':
      return { ...initialState, ...(action.patch || {}) };
    default:
      return state;
  }
}

const ChartBuilderContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * ChartBuilderProvider: Context provider for chart builder state using useReducer.
 * Props:
 * - initial: Partial initial state to seed the store
 * - children: ReactNode
 */
export function ChartBuilderProvider({ initial, children }) {
  const seeded = useMemo(() => ({ ...initialState, ...(initial || {}) }), [initial]);
  const [state, dispatch] = useReducer(reducer, seeded);

  // PUBLIC_INTERFACE
  const update = (patch) => dispatch({ type: 'PATCH', patch });

  // PUBLIC_INTERFACE
  // loadDataset: convenience action to set data and infer xKey/yKeys from first row.
  const loadDataset = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    const cols = Object.keys(rows[0] || {});
    const newX = cols[0] || 'category';
    const newY = cols.slice(1);
    dispatch({
      type: 'PATCH',
      patch: {
        data: rows,
        xKey: newX,
        yKeys: newY.length ? newY : ['value'],
      },
    });
  };

  const value = useMemo(() => ({ state, update, dispatch, loadDataset }), [state]);
  return <ChartBuilderContext.Provider value={value}>{children}</ChartBuilderContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useChartBuilderStore: Access the chart builder store from context.
 * Throws a helpful error if used outside of the provider.
 */
export function useChartBuilderStore() {
  const ctx = useContext(ChartBuilderContext);
  if (!ctx) {
    throw new Error('useChartBuilderStore must be used within a ChartBuilderProvider');
  }
  return ctx;
}

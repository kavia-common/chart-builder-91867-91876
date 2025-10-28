 // PUBLIC_INTERFACE
 /** getSampleData: Returns a small demo dataset for table and chart preview. */
export function getSampleData() {
  return [
    { category: 'Q1', value: 120 },
    { category: 'Q2', value: 180 },
    { category: 'Q3', value: 90 },
    { category: 'Q4', value: 150 },
  ];
}

/**
 * PUBLIC_INTERFACE
 * getAllSampleDatasets: Returns a map of available sample datasets for quick loading.
 * Includes at least:
 * - Sales Over Time (time series; good for line/bar)
 * - Category Breakdown (categorical; good for bar/pie)
 */
export function getAllSampleDatasets() {
  return {
    'Sales Over Time': [
      { date: '2024-01', Sales: 1200 },
      { date: '2024-02', Sales: 1650 },
      { date: '2024-03', Sales: 1420 },
      { date: '2024-04', Sales: 2100 },
      { date: '2024-05', Sales: 1980 },
      { date: '2024-06', Sales: 2300 },
    ],
    'Category Breakdown': [
      { category: 'Electronics', value: 540 },
      { category: 'Apparel', value: 320 },
      { category: 'Home', value: 410 },
      { category: 'Beauty', value: 260 },
      { category: 'Sports', value: 370 },
    ],
  };
}

/**
 * PUBLIC_INTERFACE
 * getSampleDatasetNames: Returns the sorted list of sample dataset names.
 */
export function getSampleDatasetNames() {
  return Object.keys(getAllSampleDatasets()).sort();
}

/**
 * PUBLIC_INTERFACE
 * getSampleDatasetByName: Returns a dataset by its name or null if not found.
 */
export function getSampleDatasetByName(name) {
  const all = getAllSampleDatasets();
  return all[name] || null;
}

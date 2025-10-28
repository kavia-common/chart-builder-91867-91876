 // PUBLIC_INTERFACE
 /** parseCsv: Very small CSV parser placeholder (no deps). */
export function parseCsv(text) {
  if (!text || typeof text !== 'string') return [];
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  if (!headerLine) return [];
  const headers = headerLine.split(',').map((h) => h.trim());
  return lines.map((l) => {
    const cells = l.split(',');
    return headers.reduce((acc, h, i) => {
      acc[h] = (cells[i] ?? '').trim();
      return acc;
    }, {});
  });
}

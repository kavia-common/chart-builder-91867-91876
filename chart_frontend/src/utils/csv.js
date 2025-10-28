 // PUBLIC_INTERFACE
 /** parseCsv: Small CSV parser (no deps) with basic quote handling and header mapping.
  * - First non-empty line is treated as header row.
  * - Handles commas within double quotes.
  * - Trims cells and attempts to coerce numeric values to numbers.
  */
export function parseCsv(text) {
  if (!text || typeof text !== 'string') return [];
  // Normalize line endings and split, preserving empty cells but dropping empty trailing lines
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  // Find the header line (first non-empty)
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) return [];

  const headers = splitCsvLine(lines[headerIdx]).map((h) => h.trim());
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === '') continue; // skip blank lines
    const cells = splitCsvLine(raw);
    const row = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] ?? `col_${c + 1}`;
      const valRaw = (cells[c] ?? '').trim();
      row[key] = coerceValue(valRaw);
    }
    rows.push(row);
  }
  return rows;
}

/** Split a single CSV line into cells, handling quoted commas and escaped quotes. */
function splitCsvLine(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote within a quoted cell ("")
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

/** Try to convert to number when appropriate. Keep as string otherwise. */
function coerceValue(val) {
  if (val === '') return '';
  // If it's a number (integer/float) and not something like "0123" with leading zeros
  const num = Number(val);
  if (!Number.isNaN(num) && /^-?\d+(\.\d+)?$/.test(val)) return num;
  return val;
}

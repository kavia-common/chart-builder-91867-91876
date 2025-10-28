import React, { useEffect, useRef, useState } from 'react';
import { parseCsv } from '../utils/csv';
import { useChartBuilderStore } from '../state/useChartBuilderStore';

/**
 * PUBLIC_INTERFACE
 * ImportDataModal: Modal to import CSV data via paste or file upload.
 * Props:
 * - open: boolean - controls visibility
 * - onClose: () => void - called to close the modal
 *
 * Behavior:
 * - Supports CSV paste into a textarea and file upload (.csv).
 * - Parses the first row as headers and subsequent rows as data.
 * - On successful parse, updates global store: data, xKey (first column), yKeys (rest).
 */
function ImportDataModal({ open = false, onClose = () => {} }) {
  const { update } = useChartBuilderStore();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const modalCardRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (open) {
      setText('');
      setError('');
      // focus first actionable control
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = String(evt.target?.result || '');
      setText(content);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read the selected file.');
    };
    reader.readAsText(file);
    // Allow reselecting the same file
    e.target.value = '';
  };

  const commitData = (rows) => {
    if (!rows || !rows.length) {
      setError('No rows found after parsing CSV.');
      return;
    }
    const cols = Object.keys(rows[0] || {});
    if (!cols.length) {
      setError('No header columns detected in CSV.');
      return;
    }
    const newX = cols[0];
    const newY = cols.slice(1);
    update({
      data: rows,
      xKey: newX,
      yKeys: newY.length ? newY : ['value'],
    });
    onClose();
  };

  // PUBLIC_INTERFACE
  const handleImport = () => {
    setError('');
    const rows = parseCsv(text);
    if (!rows.length) {
      setError('Could not parse any rows. Ensure the first row has headers.');
      return;
    }
    commitData(rows);
  };

  // Close on Escape and trap focus
  useEffect(() => {
    if (!open) return;

    const handleKeydown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = modalCardRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
      className="modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
        padding: 16,
      }}
      onClick={(e) => {
        // click outside card closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalCardRef}
        className="card import-modal-card"
        style={{
          width: 'min(720px, 100%)',
          maxHeight: '90vh',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 16,
          display: 'grid',
          gap: 12,
          overflow: 'auto',
          transition: 'transform .2s ease, opacity .2s ease',
        }}
      >
        <div
          id="import-title"
          style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}
        >
          Import Data (CSV)
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            ref={firstFocusableRef}
            className="btn"
            onClick={handleUploadClick}
            aria-label="Upload CSV file"
          >
            Upload CSV
          </button>
          <input
            type="file"
            accept=".csv,text/csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
            or paste CSV below. First row should be headers.
          </div>
        </div>

        <label htmlFor="csv-textarea" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          CSV content
        </label>
        <textarea
          id="csv-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Example:
category,value
Q1,120
Q2,180
Q3,90
Q4,150`}
          rows={12}
          style={{
            width: '100%',
            resize: 'vertical',
            padding: 12,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        />

        {!!error && (
          <div role="alert" style={{ color: 'var(--color-error)', fontSize: 13 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Cancel import">Cancel</button>
          <button className="btn" onClick={handleImport} ref={lastFocusableRef} aria-label="Import CSV">Import</button>
        </div>
      </div>
    </div>
  );
}

export default ImportDataModal;

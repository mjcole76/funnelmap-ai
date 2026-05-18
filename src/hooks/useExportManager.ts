import { useState, useCallback } from 'react';

/**
 * Manages export modal state.
 * Export logic itself lives in ExportModal component — this hook
 * just controls the modal open/close state.
 */
export function useExportManager() {
  const [showExportModal, setShowExportModal] = useState(false);

  const openExportModal = useCallback(() => setShowExportModal(true), []);
  const closeExportModal = useCallback(() => setShowExportModal(false), []);

  return { showExportModal, openExportModal, closeExportModal };
}

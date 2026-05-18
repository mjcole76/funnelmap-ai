import { useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import type { SaveStatus } from '../types';

/**
 * Manages Page Editor state — open/close, save edits, regenerate.
 */
export function usePageEditor(
  nodes: Node[],
  setNodes: (fn: (nds: Node[]) => Node[]) => void,
  setSaveStatus: (s: SaveStatus) => void,
  saveCopyForNode: (nodeId: string, copy: any) => void,
  loadCopyForNode: (nodeId: string) => any | null,
  regenerateForNode: (nodeId: string) => void,
) {
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [pageEditorNode, setPageEditorNode] = useState<Node | null>(null);

  /** Open the Page Editor for a node (only if it has copy). */
  const openPageEditor = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    let copyData = node.data.copy || loadCopyForNode(nodeId);
    if (!copyData) return; // No copy to edit
    setPageEditorNode({ ...node, data: { ...node.data, copy: copyData } });
    setShowPageEditor(true);
  }, [nodes, loadCopyForNode]);

  /** Close the Page Editor. */
  const closePageEditor = useCallback(() => {
    setShowPageEditor(false);
  }, []);

  /** Save edited copy from the Page Editor. */
  const savePageEdit = useCallback((nodeId: string, editedCopy: any) => {
    saveCopyForNode(nodeId, editedCopy);
    setNodes(nds => nds.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, copy: editedCopy, _copyUpdated: Date.now() } }
        : n
    ));
    setSaveStatus('unsaved');
  }, [setNodes, setSaveStatus, saveCopyForNode]);

  /** Regenerate copy for the currently-editing node (delegates to copy hook). */
  const regenerateFromEditor = useCallback((nodeId: string) => {
    regenerateForNode(nodeId);
  }, [regenerateForNode]);

  return {
    showPageEditor,
    pageEditorNode,
    openPageEditor,
    closePageEditor,
    savePageEdit,
    regenerateFromEditor,
  };
}

import { useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import type { PlacedBlock } from '../lib/templateBlocks';
import type { SaveStatus } from '../types';

/**
 * Manages Template Builder and Page Editor state.
 */
export function useTemplateManager(
  nodes: Node[],
  setNodes: (fn: (nds: Node[]) => Node[]) => void,
  setSaveStatus: (s: SaveStatus) => void,
  saveCopyForNode: (nodeId: string, copy: any) => void,
  saveLayoutForNode: (nodeId: string, layout: any) => void,
  loadCopyForNode: (nodeId: string) => any | null,
) {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [templateBuilderNode, setTemplateBuilderNode] = useState<Node | null>(null);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [pageEditorNode, setPageEditorNode] = useState<Node | null>(null);

  const openTemplateBuilder = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) { setTemplateBuilderNode(node); setShowTemplateBuilder(true); }
  }, [nodes]);

  const closeTemplateBuilder = useCallback(() => setShowTemplateBuilder(false), []);

  const saveLayout = useCallback((nodeId: string, layout: PlacedBlock[]) => {
    saveLayoutForNode(nodeId, layout);
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, layout, _layoutUpdated: Date.now() } } : n));
    setSaveStatus('unsaved');
  }, [setNodes, setSaveStatus, saveLayoutForNode]);

  const openPageEditor = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    let copyData = node.data.copy || loadCopyForNode(nodeId);
    if (!copyData) return;
    setPageEditorNode({ ...node, data: { ...node.data, copy: copyData } });
    setShowPageEditor(true);
  }, [nodes, loadCopyForNode]);

  const closePageEditor = useCallback(() => setShowPageEditor(false), []);

  const savePageEdit = useCallback((nodeId: string, editedCopy: any) => {
    saveCopyForNode(nodeId, editedCopy);
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, copy: editedCopy, _copyUpdated: Date.now() } } : n));
    setSaveStatus('unsaved');
  }, [setNodes, setSaveStatus, saveCopyForNode]);

  return {
    showTemplateBuilder, templateBuilderNode, openTemplateBuilder, closeTemplateBuilder, saveLayout,
    showPageEditor, pageEditorNode, openPageEditor, closePageEditor, savePageEdit,
  };
}

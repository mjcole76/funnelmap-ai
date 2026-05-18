import { useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import type { PlacedBlock } from '../lib/templateBlocks';
import type { SaveStatus } from '../types';

/**
 * Manages Template Builder state — open/close, save layout.
 * Page Editor state is in usePageEditor.ts.
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

  /** Open Template Builder for a given node. */
  const openTemplateBuilder = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setTemplateBuilderNode(node);
      setShowTemplateBuilder(true);
    }
  }, [nodes]);

  /** Close Template Builder. */
  const closeTemplateBuilder = useCallback(() => setShowTemplateBuilder(false), []);

  /** Save a block layout to a node. */
  const saveLayout = useCallback((nodeId: string, layout: PlacedBlock[]) => {
    saveLayoutForNode(nodeId, layout);
    setNodes(nds => nds.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, layout, _layoutUpdated: Date.now() } }
        : n
    ));
    setSaveStatus('unsaved');
  }, [setNodes, setSaveStatus, saveLayoutForNode]);

  return {
    showTemplateBuilder,
    templateBuilderNode,
    openTemplateBuilder,
    closeTemplateBuilder,
    saveLayout,
  };
}

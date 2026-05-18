import { useEffect, useRef, useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import type { FunnelContext, SaveStatus } from '../types';

const STORAGE_KEY = 'funnelmap-ai-state';

interface StoredState {
  nodes: Node[];
  edges: Edge[];
  isPublished: boolean;
  funnelContext: FunnelContext;
}

/**
 * Handles localStorage persistence for the funnel state.
 * Load on mount, auto-save on changes with debounce.
 */
export function useFunnelStorage(
  nodes: Node[],
  edges: Edge[],
  isPublished: boolean,
  funnelContext: FunnelContext,
  saveStatus: SaveStatus,
  setSaveStatus: (s: SaveStatus) => void,
  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void,
  setIsPublished: (p: boolean) => void,
  setFunnelContext: (c: FunnelContext) => void,
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.nodes) setNodes(parsed.nodes);
        if (parsed.edges) setEdges(parsed.edges);
        if (parsed.isPublished) setIsPublished(parsed.isPublished);
        if (parsed.funnelContext) setFunnelContext(parsed.funnelContext);
      } catch {
        // Ignore parse errors
      }
    }
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Auto-save with debounce
  useEffect(() => {
    if (!isLoaded) return;
    if (saveStatus === 'unsaved') {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        const toSave: StoredState = {
          nodes: nodes.map(n => ({
            ...n,
            data: {
              ...n.data,
              onEdit: undefined, onDelete: undefined, onAddNext: undefined,
              onGenerateCopy: undefined, onPreview: undefined, onBuildTemplate: undefined, onEditPage: undefined,
            }
          })),
          edges,
          isPublished,
          funnelContext,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        setTimeout(() => setSaveStatus('saved'), 500);
      }, 1000);
    }
  }, [nodes, edges, isPublished, funnelContext, saveStatus, isLoaded]);

  const saveCopyForNode = useCallback((nodeId: string, copy: any) => {
    localStorage.setItem(`funnel-copy-${nodeId}`, JSON.stringify(copy));
  }, []);

  const loadCopyForNode = useCallback((nodeId: string): any | null => {
    const saved = localStorage.getItem(`funnel-copy-${nodeId}`);
    if (saved) { try { return JSON.parse(saved); } catch { return null; } }
    return null;
  }, []);

  const saveLayoutForNode = useCallback((nodeId: string, layout: any) => {
    localStorage.setItem(`funnel-layout-${nodeId}`, JSON.stringify(layout));
  }, []);

  const loadLayoutForNode = useCallback((nodeId: string): any | null => {
    const saved = localStorage.getItem(`funnel-layout-${nodeId}`);
    if (saved) { try { return JSON.parse(saved); } catch { return null; } }
    return null;
  }, []);

  return { isLoaded, saveCopyForNode, loadCopyForNode, saveLayoutForNode, loadLayoutForNode };
}

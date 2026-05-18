import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import type { FunnelContext, GeneratedCopy } from '../types';
import { generateCopy, generateCopyFromLayout } from '../lib/copyTemplates';
import type { PlacedBlock } from '../lib/templateBlocks';

/**
 * Builds a full copy context from the global funnel context + node-specific data.
 */
export function buildCopyContext(funnelContext: FunnelContext, node: Node): FunnelContext {
  return {
    productName: funnelContext.productName || 'Your Product',
    audience: funnelContext.audience || 'your audience',
    price: funnelContext.price || '$29',
    problem: funnelContext.problem || 'their main challenge',
    goal: funnelContext.goal || 'achieve their desired outcome',
    funnelName: funnelContext.funnelName || 'My Funnel',
    offerType: funnelContext.offerType || 'low_ticket',
    desiredOutcome: funnelContext.desiredOutcome || '',
    whatsIncluded: funnelContext.whatsIncluded || '',
    whyNow: funnelContext.whyNow || '',
    trafficSource: funnelContext.trafficSource || '',
    buyerObjection: funnelContext.buyerObjection || '',
    tone: funnelContext.tone || 'Practical and direct',
    previewTemplate: (node.data.previewTemplate as string) || '',
    stepTitle: (node.data.title as string) || '',
    headline: (node.data.headline as string) || '',
    buttonText: (node.data.buttonText as string) || '',
  };
}

/**
 * Hook for generating copy — single node, full funnel, and layout-aware.
 */
export function useCopyGeneration(
  funnelContext: FunnelContext,
  nodes: Node[],
  setNodes: (fn: (nds: Node[]) => Node[]) => void,
  setSaveStatus: (s: 'saved' | 'saving' | 'unsaved') => void,
  saveCopyForNode: (nodeId: string, copy: any) => void,
  saveLayoutForNode: (nodeId: string, layout: any) => void,
  loadLayoutForNode: (nodeId: string) => any | null,
) {
  /** Generate copy for a single node. */
  const generateForNode = useCallback((node: Node): GeneratedCopy => {
    const context = buildCopyContext(funnelContext, node);
    return generateCopy(node.data.type as string, context);
  }, [funnelContext]);

  /** Write copy for all nodes that don't have it yet. Returns count of nodes written. */
  const writeFullFunnel = useCallback((overwriteAll: boolean = false) => {
    const updatedNodes = nodes.map(node => {
      const existing = localStorage.getItem(`funnel-copy-${node.id}`) || node.data.copy;
      if (!overwriteAll && existing) return node;
      const context = buildCopyContext(funnelContext, node);
      const generated = generateCopy(node.data.type as string, context);
      saveCopyForNode(node.id, generated);
      return { ...node, data: { ...node.data, copy: generated, _copyUpdated: Date.now() } };
    });
    setNodes(() => updatedNodes);
    setSaveStatus('unsaved');
  }, [nodes, funnelContext, setNodes, setSaveStatus, saveCopyForNode]);

  /** Generate copy from a template layout (block-aware). */
  const generateFromLayout = useCallback((nodeId: string, layout: PlacedBlock[]) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const context = buildCopyContext(funnelContext, node);
    const copy = generateCopyFromLayout(node.data.type as string, context, layout);
    saveCopyForNode(nodeId, copy);
    saveLayoutForNode(nodeId, layout);
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, copy, layout, _copyUpdated: Date.now() } } : n));
    setSaveStatus('unsaved');
  }, [nodes, funnelContext, setNodes, setSaveStatus, saveCopyForNode, saveLayoutForNode]);

  /** Regenerate copy for a node, respecting any saved layout. */
  const regenerateForNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const context = buildCopyContext(funnelContext, node);
    const savedLayout = loadLayoutForNode(nodeId);
    let copy;
    if (savedLayout) {
      try { copy = generateCopyFromLayout(node.data.type as string, context, savedLayout); }
      catch { copy = generateCopy(node.data.type as string, context); }
    } else {
      copy = generateCopy(node.data.type as string, context);
    }
    saveCopyForNode(nodeId, copy);
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, copy, _copyUpdated: Date.now() } } : n));
    setSaveStatus('unsaved');
  }, [nodes, funnelContext, setNodes, setSaveStatus, saveCopyForNode, loadLayoutForNode]);

  return { generateForNode, writeFullFunnel, generateFromLayout, regenerateForNode, buildContext: (node: Node) => buildCopyContext(funnelContext, node) };
}

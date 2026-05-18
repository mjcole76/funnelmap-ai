import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type { FunnelContext, SaveStatus } from '../types';

/**
 * Handles funnel generation from the Offer Brief,
 * topological sort, auto-arrange, and template loading.
 */

const CARDS_PER_ROW = 4;
const X_SPACING = 320;
const Y_SPACING = 300;
const START_X = 50;
const START_Y = 100;

export function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();
  nodes.forEach(n => { inDegree.set(n.id, 0); adjList.set(n.id, []); });
  edges.forEach(e => {
    adjList.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });
  const queue: string[] = [];
  inDegree.forEach((d, id) => { if (d === 0) queue.push(id); });
  const sorted: string[] = [];
  while (queue.length) {
    const cur = queue.shift()!;
    sorted.push(cur);
    for (const nb of adjList.get(cur) || []) {
      inDegree.set(nb, (inDegree.get(nb) || 0) - 1);
      if (inDegree.get(nb) === 0) queue.push(nb);
    }
  }
  nodes.forEach(n => { if (!sorted.includes(n.id)) sorted.push(n.id); });
  return sorted.map(id => nodes.find(n => n.id === id)!);
}

function getStepsForGoal(formData: FunnelContext): string[] {
  if (formData.goal === 'Sell product') {
    if (formData.offerType.includes('Low')) return ['Landing Page', 'Sales Page', 'Checkout', 'Order Bump', 'Upsell', 'Downsell', 'Thank You Page', 'Email Follow-up'];
    if (formData.offerType.includes('Mid')) return ['Landing Page', 'Sales Page', 'Checkout', 'Upsell', 'Downsell', 'Thank You Page', 'Email Follow-up'];
    return ['Landing Page', 'Application Page', 'Booking Page', 'Thank You Page', 'Email Follow-up'];
  }
  if (formData.goal === 'Collect leads') return ['Landing Page', 'Opt-in Page', 'Thank You Page', 'Email Follow-up'];
  if (formData.goal === 'Book calls') return ['Landing Page', 'Application Page', 'Booking Page', 'Thank You Page', 'Email Follow-up'];
  if (formData.goal === 'Webinar registration') return ['Landing Page', 'Opt-in Page', 'Webinar', 'Sales Page', 'Checkout', 'Thank You Page', 'Email Follow-up'];
  return ['Landing Page', 'Sales Page', 'Checkout', 'Thank You Page', 'Email Follow-up'];
}

function getStepTitle(stepType: string, productName: string, price: string): string {
  const words = productName.split(' ');
  const short = words.length > 3 ? words.slice(-2).join(' ') : productName;
  switch (stepType) {
    case 'Landing Page': return `Free ${short} Guide`;
    case 'Sales Page': return productName;
    case 'Checkout': return `${price} Early Access`;
    case 'Order Bump': return 'Fast Track Add-On';
    case 'Upsell': return `${short} Pro`;
    case 'Downsell': return `${short} Basic`;
    case 'Thank You Page': return 'Access Your Purchase';
    case 'Email Follow-up': return 'Follow-Up Sequence';
    case 'Webinar': return `Free ${short} Training`;
    case 'Survey': return 'Quick Survey';
    case 'Application Page': return 'Apply Now';
    case 'Booking Page': return 'Book Your Call';
    default: return productName;
  }
}

function getDefaultTemplate(type: string): string {
  const map: Record<string, string> = {
    'Landing Page': 'hero_cta', 'Sales Page': 'classic_long_form', 'Checkout': 'simple_checkout',
    'Order Bump': 'checkbox_bump', 'Upsell': 'upgrade_offer', 'Downsell': 'lite_version',
    'Thank You Page': 'simple_confirmation', 'Email Follow-up': 'five_day_sequence',
    'Webinar': 'registration_page', 'Survey': 'simple_survey',
    'Application Page': 'simple_application', 'Booking Page': 'calendar_booking',
  };
  return map[type] || 'hero_cta';
}

function getEdgeLabel(prevStep: string, curStep: string): string {
  if (prevStep === 'Checkout') return 'Buys';
  if (prevStep === 'Upsell') return curStep === 'Downsell' ? 'Declines' : 'Accepts';
  if (prevStep === 'Downsell') return 'Accepts';
  return 'Next';
}

const edgeStyle = {
  type: 'smoothstep' as const,
  animated: true,
  labelStyle: { fontSize: '10px', color: '#9ca3af', fontWeight: 400, background: 'rgba(255,255,255,0.8)', padding: '1px 6px', borderRadius: '4px' },
  style: { stroke: '#9CA3AF', strokeWidth: 2 },
};

export function useFunnelGeneration(
  nodes: Node[],
  edges: Edge[],
  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void,
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void,
  funnelContext: FunnelContext,
  setFunnelContext: (c: FunnelContext) => void,
  setSaveStatus: (s: SaveStatus) => void,
) {
  /** Generate a full funnel from Offer Brief data. */
  const handleGenerate = useCallback((formData: FunnelContext) => {
    if (nodes.length > 0 && !window.confirm('This will clear your current canvas. Proceed?')) return;
    setFunnelContext(formData);

    const steps = getStepsForGoal(formData);
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let prevId = '';
    let prevStep = '';

    steps.forEach((step, i) => {
      const id = uuidv4();
      newNodes.push({
        id,
        type: 'funnelNode',
        position: { x: START_X + (i % CARDS_PER_ROW) * X_SPACING, y: START_Y + Math.floor(i / CARDS_PER_ROW) * Y_SPACING },
        data: {
          title: getStepTitle(step, formData.productName || 'Product', formData.price || '$97'),
          type: step, url: step.toLowerCase().replace(/\s+/g, '-'),
          headline: `Discover ${formData.productName}`, buttonText: 'Next Step', price: formData.price,
          visitors: Math.floor(Math.random() * 500 + 100).toString(),
          conversion: `${(Math.random() * 30 + 5).toFixed(1)}%`,
          revenue: `${Math.floor(Math.random() * 2000 + 100)}`,
          previewTemplate: getDefaultTemplate(step),
        },
      });
      if (prevId) {
        newEdges.push({ id: `e-${prevId}-${id}`, source: prevId, target: id, label: getEdgeLabel(prevStep, step), ...edgeStyle });
      }
      prevId = id;
      prevStep = step;
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setSaveStatus('unsaved');
  }, [nodes.length, setNodes, setEdges, setFunnelContext, setSaveStatus]);

  /** Auto-arrange nodes using topological sort. */
  const handleAutoArrange = useCallback(() => {
    const sorted = topologicalSort(nodes, edges);
    setNodes(sorted.map((node, i) => ({
      ...node,
      position: { x: START_X + (i % CARDS_PER_ROW) * X_SPACING, y: START_Y + Math.floor(i / CARDS_PER_ROW) * Y_SPACING },
    })));
    setSaveStatus('unsaved');
  }, [nodes, edges, setNodes, setSaveStatus]);

  /** Reset layout to simple order. */
  const handleResetLayout = useCallback(() => {
    const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
    setNodes(sorted.map((node, i) => ({
      ...node,
      position: { x: START_X + (i % CARDS_PER_ROW) * X_SPACING, y: START_Y + Math.floor(i / CARDS_PER_ROW) * Y_SPACING },
    })));
    setSaveStatus('unsaved');
  }, [nodes, setNodes, setSaveStatus]);

  return { handleGenerate, handleAutoArrange, handleResetLayout };
}

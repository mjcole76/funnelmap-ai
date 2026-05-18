import { Node, Edge } from '@xyflow/react';

/**
 * All supported funnel step types.
 */
export type FunnelStepType =
  | 'Landing Page'
  | 'Sales Page'
  | 'Checkout'
  | 'Order Bump'
  | 'Upsell'
  | 'Downsell'
  | 'Thank You Page'
  | 'Email Follow-up'
  | 'Webinar'
  | 'Survey'
  | 'Application Page'
  | 'Booking Page'
  | 'Opt-in Page';

/**
 * Core context that drives copy generation and funnel behavior.
 * Filled by the user via the Offer Brief / Settings panel.
 */
export interface FunnelContext {
  funnelName: string;
  productName: string;
  audience: string;
  price: string;
  problem: string;
  goal: string;
  offerType: string;
  pageStyle?: string;
  // Extended context
  desiredOutcome?: string;
  whatsIncluded?: string;
  whyNow?: string;
  trafficSource?: string;
  buyerObjection?: string;
  tone?: string;
  // Per-node overrides (set during copy generation)
  previewTemplate?: string;
  stepTitle?: string;
  headline?: string;
  buttonText?: string;
  notes?: string;
}

/**
 * Data stored inside each funnel node (ReactFlow node.data).
 */
export interface FunnelNodeData extends Record<string, unknown> {
  title: string;
  type: string;
  url?: string;
  headline?: string;
  buttonText?: string;
  price?: string;
  visitors?: string;
  conversion?: string;
  revenue?: string;
  description?: string;
  previewTemplate?: string;
  copy?: GeneratedCopy;
  layout?: PlacedBlock[];
  _copyUpdated?: number;
  _layoutUpdated?: number;
  // Callbacks (injected by Canvas)
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNext?: (type: string) => void;
  onGenerateCopy?: () => void;
  onPreview?: () => void;
  onBuildTemplate?: () => void;
  onEditPage?: () => void;
}

export type FunnelNode = Node<FunnelNodeData>;
export type FunnelEdge = Edge;

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

/**
 * A pre-built funnel template (used in Template Library).
 */
export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Array<{
    type: string;
    title: string;
    template: string;
    buttonText?: string;
    relativePosition: { x: number; y: number };
  }>;
  edges: Array<{
    sourceIdx: number;
    targetIdx: number;
    label: string;
  }>;
}

// Re-export for convenience
import type { GeneratedCopy } from './copy';
import type { PlacedBlock } from './template';
export type { GeneratedCopy, PlacedBlock };

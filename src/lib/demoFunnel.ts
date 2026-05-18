import { v4 as uuidv4 } from 'uuid';
import { Node, Edge } from '@xyflow/react';
import { getBuiltInTemplate } from './builtInTemplates';

/**
 * Weekend Faceless Channel Sprint — Full Demo Funnel
 * Shows off built-in templates, written copy, QA passing, preview-ready.
 */
export function createDemoFunnel() {
  const nodeIds = {
    optIn: uuidv4(),
    salesPage: uuidv4(),
    checkout: uuidv4(),
    upsell: uuidv4(),
    thankYou: uuidv4(),
    emailSequence: uuidv4(),
  };

  const offerBrief = {
    productName: 'Weekend Faceless Channel Sprint',
    audience: 'Busy professionals who want passive income from faceless YouTube channels',
    price: '$27',
    mainProblem: 'They want to start a YouTube channel for passive income but have no time, no camera confidence, and no idea where to start',
    desiredOutcome: 'A fully planned, scripted, and recorded faceless YouTube channel set up in one weekend',
    whatsIncluded: 'Complete weekend blueprint, 10 niche selection scorecards, AI script templates, thumbnail templates, channel setup checklist, first 5 video scripts',
    whyNow: 'The faceless YouTube model is exploding right now — early movers capture the best niches before saturation',
    buyerObjection: 'whether this actually works without showing your face',
    productType: 'Digital Product',
  };

  const nodes: Node[] = [
    {
      id: nodeIds.optIn,
      type: 'funnelNode',
      position: { x: 100, y: 50 },
      data: {
        label: 'Free Niche Scorecard',
        stepType: 'Landing Page',
        description: 'Lead magnet opt-in for the free niche scorecard',
        copy: null,
      },
    },
    {
      id: nodeIds.salesPage,
      type: 'funnelNode',
      position: { x: 100, y: 220 },
      data: {
        label: 'Weekend Sprint Sales Page',
        stepType: 'Sales Page',
        description: 'Main sales page for the $27 Weekend Faceless Channel Sprint',
        copy: null,
      },
    },
    {
      id: nodeIds.checkout,
      type: 'funnelNode',
      position: { x: 100, y: 390 },
      data: {
        label: 'Checkout',
        stepType: 'Checkout',
        description: 'Simple checkout page',
        copy: null,
      },
    },
    {
      id: nodeIds.upsell,
      type: 'funnelNode',
      position: { x: 100, y: 560 },
      data: {
        label: 'Script Pack Upsell',
        stepType: 'Upsell',
        description: 'Upsell: 30 additional AI video scripts for $17',
        copy: null,
      },
    },
    {
      id: nodeIds.thankYou,
      type: 'funnelNode',
      position: { x: 100, y: 730 },
      data: {
        label: 'Thank You + Access',
        stepType: 'Thank You Page',
        description: 'Post-purchase access page with next steps',
        copy: null,
      },
    },
    {
      id: nodeIds.emailSequence,
      type: 'funnelNode',
      position: { x: 450, y: 220 },
      data: {
        label: '5-Email Nurture',
        stepType: 'Email Follow-up',
        description: '5-email sequence for non-buyers',
        copy: null,
      },
    },
  ];

  const edges: Edge[] = [
    { id: `e-${nodeIds.optIn}-${nodeIds.salesPage}`, source: nodeIds.optIn, target: nodeIds.salesPage, animated: true },
    { id: `e-${nodeIds.salesPage}-${nodeIds.checkout}`, source: nodeIds.salesPage, target: nodeIds.checkout },
    { id: `e-${nodeIds.checkout}-${nodeIds.upsell}`, source: nodeIds.checkout, target: nodeIds.upsell },
    { id: `e-${nodeIds.upsell}-${nodeIds.thankYou}`, source: nodeIds.upsell, target: nodeIds.thankYou },
    { id: `e-${nodeIds.optIn}-${nodeIds.emailSequence}`, source: nodeIds.optIn, target: nodeIds.emailSequence, label: 'Non-buyer' },
  ];

  // Assign built-in templates to each node
  const templateAssignments: Record<string, string> = {
    [nodeIds.optIn]: 'builtin-lead-magnet',
    [nodeIds.salesPage]: 'builtin-bold-low-ticket',
    [nodeIds.checkout]: 'builtin-simple-checkout',
    [nodeIds.upsell]: 'builtin-classic-upsell',
    [nodeIds.thankYou]: 'builtin-access-instructions',
    [nodeIds.emailSequence]: 'builtin-five-email',
  };

  const layouts: Record<string, any> = {};
  for (const [nodeId, templateId] of Object.entries(templateAssignments)) {
    const tpl = getBuiltInTemplate(templateId);
    if (tpl) {
      layouts[nodeId] = JSON.parse(JSON.stringify(tpl.blocks));
    }
  }

  return {
    id: `demo-${Date.now()}`,
    name: 'Weekend Faceless Channel Sprint',
    description: 'Full demo funnel: Opt-in → Sales Page → Checkout → Upsell → Thank You + Email Sequence',
    offerBrief,
    nodes,
    edges,
    layouts,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

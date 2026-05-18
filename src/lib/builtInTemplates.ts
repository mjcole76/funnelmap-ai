import { createPlacedBlock, PlacedBlock, BlockType, getDefaultStyles, DEFAULT_BUTTON_STYLE } from './templateBlocks';

export interface BuiltInTemplate {
  id: string;
  name: string;
  pageType: string;
  bestFor: string;
  description: string;
  category: 'sales' | 'landing' | 'checkout' | 'upsell' | 'thankyou' | 'email';
  blocks: PlacedBlock[];
}

/** Create a styled block with overrides */
function styled(type: BlockType, overrides?: {
  bgColor?: string; textColor?: string; accentColor?: string; borderColor?: string;
  shadow?: boolean; radius?: number; padTop?: number; padBot?: number;
  maxWidth?: 'narrow' | 'normal' | 'wide' | 'full'; align?: 'left' | 'center' | 'right';
  headSize?: 'small' | 'medium' | 'large' | 'huge'; bodySize?: 'small' | 'normal' | 'large';
  fontWeight?: 'normal' | 'bold' | 'extrabold';
  btnBg?: string; btnColor?: string; btnRadius?: number; btnSize?: 'small' | 'medium' | 'large';
}): PlacedBlock {
  const block = createPlacedBlock(type);
  const o = overrides || {};
  if (o.bgColor) block.styles.section.backgroundColor = o.bgColor;
  if (o.textColor) block.styles.section.textColor = o.textColor;
  if (o.accentColor) block.styles.section.accentColor = o.accentColor;
  if (o.borderColor) block.styles.section.borderColor = o.borderColor;
  if (o.shadow !== undefined) block.styles.section.shadow = o.shadow;
  if (o.radius !== undefined) block.styles.section.borderRadius = o.radius;
  if (o.padTop !== undefined) block.styles.section.paddingTop = o.padTop;
  if (o.padBot !== undefined) block.styles.section.paddingBottom = o.padBot;
  if (o.maxWidth) block.styles.section.maxWidth = o.maxWidth;
  if (o.align) block.styles.section.alignment = o.align;
  if (o.headSize) block.styles.typography.headlineSize = o.headSize;
  if (o.bodySize) block.styles.typography.bodySize = o.bodySize;
  if (o.fontWeight) block.styles.typography.fontWeight = o.fontWeight;
  if (block.styles.button) {
    if (o.btnBg) block.styles.button.backgroundColor = o.btnBg;
    if (o.btnColor) block.styles.button.textColor = o.btnColor;
    if (o.btnRadius !== undefined) block.styles.button.borderRadius = o.btnRadius;
    if (o.btnSize) block.styles.button.size = o.btnSize;
  }
  return block;
}

// ═══════════════════════════════════════════════════════════════
// SALES PAGE TEMPLATES
// ═══════════════════════════════════════════════════════════════

const boldLowTicket: BuiltInTemplate = {
  id: 'builtin-bold-low-ticket',
  name: 'Bold Low-Ticket Sales Page',
  pageType: 'Sales Page',
  bestFor: '$7 to $47 digital products',
  description: 'High-energy sales page with urgency bar, dark hero, oversized headline, and strong offer box.',
  category: 'sales',
  blocks: [
    styled('urgency_bar'),
    styled('hero', { bgColor: '#0f172a', textColor: '#ffffff', accentColor: '#f59e0b', headSize: 'huge', align: 'center', padTop: 72, padBot: 72, btnBg: '#f59e0b', btnColor: '#0f172a', btnRadius: 12, btnSize: 'large' }),
    styled('product_mockup', { bgColor: '#f8fafc', align: 'center', padTop: 48, padBot: 48 }),
    styled('problem', { bgColor: '#ffffff', padTop: 56, padBot: 56 }),
    styled('solution', { bgColor: '#f0fdf4', padTop: 48, padBot: 48 }),
    styled('benefits', { bgColor: '#ffffff', headSize: 'large' }),
    styled('how_it_works', { bgColor: '#f8fafc', align: 'center' }),
    styled('bonuses', { bgColor: '#fffbeb', borderColor: '#f59e0b', radius: 12, shadow: true }),
    styled('pricing', { bgColor: '#0f172a', textColor: '#ffffff', align: 'center', headSize: 'large', btnBg: '#f59e0b', btnColor: '#0f172a', btnRadius: 12, btnSize: 'large', shadow: true }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center', radius: 12 }),
    styled('faq', { bgColor: '#ffffff' }),
    styled('cta_final', { bgColor: '#0f172a', textColor: '#ffffff', align: 'center', btnBg: '#f59e0b', btnColor: '#0f172a', btnRadius: 12, btnSize: 'large' }),
  ],
};

const cleanSaaS: BuiltInTemplate = {
  id: 'builtin-clean-saas',
  name: 'Clean SaaS Sales Page',
  pageType: 'Sales Page',
  bestFor: 'Software, AI tools, mini SaaS',
  description: 'Professional layout with clean white hero, navy sections, card grids, and app mockup area.',
  category: 'sales',
  blocks: [
    styled('hero', { bgColor: '#ffffff', textColor: '#0f172a', accentColor: '#2563eb', align: 'center', headSize: 'huge', padTop: 80, padBot: 80, btnBg: '#2563eb', btnRadius: 10 }),
    styled('product_mockup', { bgColor: '#f1f5f9', align: 'center', padTop: 56, padBot: 56 }),
    styled('features', { bgColor: '#ffffff' }),
    styled('problem', { bgColor: '#1e293b', textColor: '#e2e8f0', padTop: 56, padBot: 56 }),
    styled('solution', { bgColor: '#ffffff' }),
    styled('how_it_works', { bgColor: '#f8fafc', align: 'center' }),
    styled('benefits', { bgColor: '#ffffff', headSize: 'large' }),
    styled('pricing', { bgColor: '#f8fafc', align: 'center', headSize: 'large', btnBg: '#2563eb', btnRadius: 10, btnSize: 'large' }),
    styled('faq', { bgColor: '#ffffff' }),
    styled('cta_final', { bgColor: '#1e293b', textColor: '#ffffff', align: 'center', btnBg: '#2563eb', btnRadius: 10, btnSize: 'large' }),
  ],
};

const videoSalesPage: BuiltInTemplate = {
  id: 'builtin-video-sales',
  name: 'Video Sales Page',
  pageType: 'Sales Page',
  bestFor: 'VSL, walkthrough, demo, or webinar-style pitch',
  description: 'Video near top, CTA under video, clean focused layout.',
  category: 'sales',
  blocks: [
    styled('hero', { bgColor: '#111827', textColor: '#ffffff', align: 'center', headSize: 'large', padTop: 56, padBot: 24, btnBg: '#10b981', btnRadius: 8 }),
    styled('video_embed', { bgColor: '#111827', padTop: 0, padBot: 48 }),
    styled('problem', { bgColor: '#ffffff', padTop: 48, padBot: 48 }),
    styled('solution', { bgColor: '#f9fafb' }),
    styled('benefits', { bgColor: '#ffffff' }),
    styled('offer_box', { bgColor: '#fefce8', align: 'center', shadow: true, radius: 16, btnBg: '#10b981', btnRadius: 8, btnSize: 'large' }),
    styled('pricing', { bgColor: '#ffffff', align: 'center', btnBg: '#10b981', btnRadius: 8, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center', radius: 12 }),
    styled('faq', { bgColor: '#ffffff' }),
    styled('cta_final', { bgColor: '#111827', textColor: '#ffffff', align: 'center', btnBg: '#10b981', btnRadius: 8, btnSize: 'large' }),
  ],
};

const editorialLetter: BuiltInTemplate = {
  id: 'builtin-editorial-letter',
  name: 'Editorial Sales Letter',
  pageType: 'Sales Page',
  bestFor: 'Info products, coaching, founder-led offers',
  description: 'Narrow reading column, text-first layout, soft callout boxes, fewer visual effects.',
  category: 'sales',
  blocks: [
    styled('hero', { bgColor: '#faf5f0', textColor: '#1c1917', maxWidth: 'narrow', align: 'left', headSize: 'large', fontWeight: 'bold', padTop: 64, padBot: 48, btnBg: '#b45309', btnRadius: 6 }),
    styled('about', { bgColor: '#ffffff', maxWidth: 'narrow' }),
    styled('problem', { bgColor: '#ffffff', maxWidth: 'narrow' }),
    styled('objection_handler', { bgColor: '#fef3c7', maxWidth: 'narrow', radius: 8, borderColor: '#d97706' }),
    styled('solution', { bgColor: '#ffffff', maxWidth: 'narrow' }),
    styled('benefits', { bgColor: '#ffffff', maxWidth: 'narrow' }),
    styled('pricing', { bgColor: '#faf5f0', maxWidth: 'narrow', align: 'center', btnBg: '#b45309', btnRadius: 6, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#ffffff', maxWidth: 'narrow', align: 'center' }),
    styled('faq', { bgColor: '#ffffff', maxWidth: 'narrow' }),
    styled('cta_final', { bgColor: '#1c1917', textColor: '#faf5f0', maxWidth: 'narrow', align: 'center', btnBg: '#b45309', btnRadius: 6, btnSize: 'large' }),
  ],
};

const compactTripwire: BuiltInTemplate = {
  id: 'builtin-compact-tripwire',
  name: 'Compact Tripwire Page',
  pageType: 'Sales Page',
  bestFor: 'Quick $7 to $27 products',
  description: 'Short page with offer card near top, fast CTA, simple sections.',
  category: 'sales',
  blocks: [
    styled('hero', { bgColor: '#7c3aed', textColor: '#ffffff', align: 'center', headSize: 'large', padTop: 56, padBot: 56, btnBg: '#fbbf24', btnColor: '#1e1b4b', btnRadius: 10, btnSize: 'large' }),
    styled('pricing', { bgColor: '#ffffff', align: 'center', shadow: true, radius: 16, btnBg: '#7c3aed', btnRadius: 10, btnSize: 'large' }),
    styled('benefits', { bgColor: '#f5f3ff' }),
    styled('what_you_get', { bgColor: '#ffffff' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center', radius: 12 }),
    styled('faq', { bgColor: '#ffffff' }),
    styled('cta_final', { bgColor: '#7c3aed', textColor: '#ffffff', align: 'center', btnBg: '#fbbf24', btnColor: '#1e1b4b', btnRadius: 10, btnSize: 'large' }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// LANDING PAGE TEMPLATES
// ═══════════════════════════════════════════════════════════════

const leadMagnetOptIn: BuiltInTemplate = {
  id: 'builtin-lead-magnet',
  name: 'Lead Magnet Opt-In',
  pageType: 'Landing Page',
  bestFor: 'Free guides, checklists, templates',
  description: 'Clean opt-in page with product mockup, benefits, and email capture.',
  category: 'landing',
  blocks: [
    styled('hero', { bgColor: '#1e40af', textColor: '#ffffff', align: 'center', headSize: 'huge', padTop: 72, padBot: 72, btnBg: '#fbbf24', btnColor: '#1e3a5f', btnRadius: 10, btnSize: 'large' }),
    styled('product_mockup', { bgColor: '#f8fafc', align: 'center', padTop: 48, padBot: 48 }),
    styled('benefits', { bgColor: '#ffffff' }),
    styled('opt_in_form', { bgColor: '#eff6ff', align: 'center', radius: 12, btnBg: '#1e40af', btnRadius: 10, btnSize: 'large' }),
    styled('trust_note', { bgColor: '#ffffff', align: 'center' }),
    styled('cta_final', { bgColor: '#1e40af', textColor: '#ffffff', align: 'center', btnBg: '#fbbf24', btnColor: '#1e3a5f', btnRadius: 10 }),
  ],
};

const videoOptIn: BuiltInTemplate = {
  id: 'builtin-video-optin',
  name: 'Video Opt-In',
  pageType: 'Landing Page',
  bestFor: 'Video-led lead gen, webinar registration',
  description: 'Hero with video embed, benefits, and email capture.',
  category: 'landing',
  blocks: [
    styled('hero', { bgColor: '#0f172a', textColor: '#ffffff', align: 'center', headSize: 'large', padTop: 56, padBot: 24 }),
    styled('video_embed', { bgColor: '#0f172a', padTop: 0, padBot: 48 }),
    styled('benefits', { bgColor: '#ffffff' }),
    styled('opt_in_form', { bgColor: '#eff6ff', align: 'center', radius: 12, btnBg: '#2563eb', btnRadius: 8, btnSize: 'large' }),
    styled('faq', { bgColor: '#ffffff' }),
    styled('cta_final', { bgColor: '#0f172a', textColor: '#ffffff', align: 'center', btnBg: '#2563eb', btnRadius: 8 }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// CHECKOUT TEMPLATES
// ═══════════════════════════════════════════════════════════════

const twoColumnCheckout: BuiltInTemplate = {
  id: 'builtin-two-col-checkout',
  name: 'Two-Column Checkout',
  pageType: 'Checkout',
  bestFor: 'Standard product checkout',
  description: 'Order summary on one side, checkout form on the other.',
  category: 'checkout',
  blocks: [
    styled('order_summary', { bgColor: '#f9fafb', radius: 12, borderColor: '#e5e7eb' }),
    styled('pricing', { bgColor: '#ffffff', align: 'center' }),
    styled('checkout_form', { bgColor: '#ffffff', shadow: true, radius: 12, btnBg: '#16a34a', btnRadius: 8, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center', radius: 8 }),
    styled('trust_note', { bgColor: '#ffffff', align: 'center' }),
  ],
};

const simpleCheckout: BuiltInTemplate = {
  id: 'builtin-simple-checkout',
  name: 'Simple Checkout',
  pageType: 'Checkout',
  bestFor: 'Fast, focused checkout',
  description: 'Minimal checkout with hero, price, form, and guarantee.',
  category: 'checkout',
  blocks: [
    styled('hero', { bgColor: '#ffffff', align: 'center', headSize: 'large', padTop: 48, padBot: 32 }),
    styled('pricing', { bgColor: '#f9fafb', align: 'center', radius: 12 }),
    styled('checkout_form', { bgColor: '#ffffff', shadow: true, radius: 12, btnBg: '#16a34a', btnRadius: 8, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center' }),
    styled('faq', { bgColor: '#ffffff' }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// UPSELL / DOWNSELL TEMPLATES
// ═══════════════════════════════════════════════════════════════

const classicUpsell: BuiltInTemplate = {
  id: 'builtin-classic-upsell',
  name: 'Classic Upsell',
  pageType: 'Upsell',
  bestFor: 'Post-purchase upgrade offers',
  description: 'Urgency bar, hero, mockup, benefits, pricing, and no-thanks link.',
  category: 'upsell',
  blocks: [
    styled('urgency_bar'),
    styled('hero', { bgColor: '#1e293b', textColor: '#ffffff', align: 'center', headSize: 'huge', padTop: 64, padBot: 64, btnBg: '#f59e0b', btnColor: '#1e293b', btnRadius: 12, btnSize: 'large' }),
    styled('product_mockup', { bgColor: '#f8fafc', align: 'center' }),
    styled('solution', { bgColor: '#ffffff' }),
    styled('benefits', { bgColor: '#f8fafc' }),
    styled('pricing', { bgColor: '#ffffff', align: 'center', shadow: true, radius: 16, btnBg: '#f59e0b', btnColor: '#1e293b', btnRadius: 12, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center', radius: 12 }),
    styled('no_thanks_link', { bgColor: '#ffffff', align: 'center' }),
  ],
};

const simpleDownsell: BuiltInTemplate = {
  id: 'builtin-simple-downsell',
  name: 'Simple Downsell',
  pageType: 'Downsell',
  bestFor: 'Lite version offer after decline',
  description: 'Short page repositioning a lighter offer.',
  category: 'upsell',
  blocks: [
    styled('hero', { bgColor: '#f8fafc', align: 'center', headSize: 'large', padTop: 48, padBot: 48, btnBg: '#2563eb', btnRadius: 8, btnSize: 'large' }),
    styled('solution', { bgColor: '#ffffff' }),
    styled('benefits', { bgColor: '#f9fafb' }),
    styled('pricing', { bgColor: '#ffffff', align: 'center', btnBg: '#2563eb', btnRadius: 8, btnSize: 'large' }),
    styled('guarantee', { bgColor: '#f0fdf4', align: 'center' }),
    styled('no_thanks_link', { bgColor: '#ffffff' }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// THANK YOU TEMPLATES
// ═══════════════════════════════════════════════════════════════

const accessInstructions: BuiltInTemplate = {
  id: 'builtin-access-instructions',
  name: 'Access Instructions',
  pageType: 'Thank You Page',
  bestFor: 'Post-purchase thank you',
  description: 'Confirmation with next steps, access button, and optional bonus CTA.',
  category: 'thankyou',
  blocks: [
    styled('hero', { bgColor: '#f0fdf4', textColor: '#166534', align: 'center', headSize: 'large', padTop: 48, padBot: 48 }),
    styled('next_steps', { bgColor: '#ffffff', align: 'center' }),
    styled('access_button', { bgColor: '#ffffff', align: 'center', btnBg: '#16a34a', btnRadius: 10, btnSize: 'large' }),
    styled('trust_note', { bgColor: '#f9fafb', align: 'center' }),
    styled('cta_final', { bgColor: '#1e293b', textColor: '#ffffff', align: 'center', headSize: 'medium', btnBg: '#f59e0b', btnColor: '#1e293b', btnRadius: 8 }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// EMAIL SEQUENCE TEMPLATES
// ═══════════════════════════════════════════════════════════════

const fiveEmailTimeline: BuiltInTemplate = {
  id: 'builtin-five-email',
  name: 'Five-Email Timeline',
  pageType: 'Email Follow-up',
  bestFor: 'Welcome sequences, nurture sequences',
  description: 'Visual email sequence showing each email in the series.',
  category: 'email',
  blocks: [
    styled('hero', { bgColor: '#1e293b', textColor: '#ffffff', align: 'center', headSize: 'large', padTop: 56, padBot: 56 }),
    styled('timeline', { bgColor: '#ffffff', accentColor: '#2563eb' }),
    styled('email_cards', { bgColor: '#f8fafc', accentColor: '#2563eb' }),
    styled('cta_final', { bgColor: '#1e293b', textColor: '#ffffff', align: 'center', btnBg: '#2563eb', btnRadius: 8 }),
  ],
};

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

export const BUILT_IN_TEMPLATES: BuiltInTemplate[] = [
  boldLowTicket, cleanSaaS, videoSalesPage, editorialLetter, compactTripwire,
  leadMagnetOptIn, videoOptIn,
  twoColumnCheckout, simpleCheckout,
  classicUpsell, simpleDownsell,
  accessInstructions,
  fiveEmailTimeline,
];

export function getBuiltInTemplate(id: string): BuiltInTemplate | null {
  return BUILT_IN_TEMPLATES.find(t => t.id === id) || null;
}

export function getBuiltInTemplatesByCategory(category: BuiltInTemplate['category']): BuiltInTemplate[] {
  return BUILT_IN_TEMPLATES.filter(t => t.category === category);
}

export function getBuiltInTemplatesByPageType(pageType: string): BuiltInTemplate[] {
  return BUILT_IN_TEMPLATES.filter(t => t.pageType === pageType);
}

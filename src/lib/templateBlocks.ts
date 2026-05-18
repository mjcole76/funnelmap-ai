/**
 * Template Blocks Library v2
 * 
 * Section-based blocks with full visual style controls.
 * Supports content, media, layout, and button blocks.
 */

// ═══════════════════════════════════════════════════════════════
// STYLE TYPES
// ═══════════════════════════════════════════════════════════════

export interface SectionStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  borderRadius: number;
  shadow: boolean;
  paddingTop: number;
  paddingBottom: number;
  maxWidth: 'narrow' | 'normal' | 'wide' | 'full';
  alignment: 'left' | 'center' | 'right';
}

export interface TypographyStyle {
  headlineSize: 'small' | 'medium' | 'large' | 'huge';
  bodySize: 'small' | 'normal' | 'large';
  fontWeight: 'normal' | 'bold' | 'extrabold';
}

export interface ButtonStyle {
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  width: 'auto' | 'full';
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
}

export interface ImageStyle {
  url: string;
  alt: string;
  aspectRatio: 'auto' | '1:1' | '4:3' | '16:9' | '3:2';
  position: 'left' | 'center' | 'right';
  width: 'small' | 'medium' | 'large' | 'full';
}

export interface VideoStyle {
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
}

export interface ColumnStyle {
  ratio: '50/50' | '60/40' | '40/60' | '70/30' | '30/70';
  stackOnMobile: boolean;
  gap: 'small' | 'medium' | 'large';
}

export interface BlockStyles {
  section: SectionStyle;
  typography: TypographyStyle;
  button?: ButtonStyle;
  image?: ImageStyle;
  video?: VideoStyle;
  columns?: ColumnStyle;
}

export const DEFAULT_SECTION_STYLE: SectionStyle = {
  backgroundColor: '#ffffff',
  textColor: '#1a1a1a',
  accentColor: '#2563eb',
  borderColor: 'transparent',
  borderRadius: 0,
  shadow: false,
  paddingTop: 48,
  paddingBottom: 48,
  maxWidth: 'normal',
  alignment: 'left',
};

export const DEFAULT_TYPOGRAPHY: TypographyStyle = {
  headlineSize: 'large',
  bodySize: 'normal',
  fontWeight: 'bold',
};

export const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  text: 'Get Started',
  url: '#',
  backgroundColor: '#2563eb',
  textColor: '#ffffff',
  size: 'medium',
  width: 'auto',
  alignment: 'center',
  borderRadius: 8,
};

export const DEFAULT_IMAGE_STYLE: ImageStyle = {
  url: '',
  alt: '',
  aspectRatio: 'auto',
  position: 'center',
  width: 'large',
};

export const DEFAULT_VIDEO_STYLE: VideoStyle = {
  url: '',
  embedUrl: '',
  thumbnailUrl: '',
  aspectRatio: '16:9',
  autoplay: false,
};

export const DEFAULT_COLUMN_STYLE: ColumnStyle = {
  ratio: '50/50',
  stackOnMobile: true,
  gap: 'medium',
};

export function getDefaultStyles(blockType: BlockType): BlockStyles {
  const base: BlockStyles = {
    section: { ...DEFAULT_SECTION_STYLE },
    typography: { ...DEFAULT_TYPOGRAPHY },
  };
  
  // Add relevant sub-styles based on block type
  if (['hero', 'cta_final', 'pricing', 'dark_section'].includes(blockType)) {
    base.button = { ...DEFAULT_BUTTON_STYLE };
  }
  if (['image', 'product_mockup', 'split_image_text', 'about'].includes(blockType)) {
    base.image = { ...DEFAULT_IMAGE_STYLE };
  }
  if (['video_embed'].includes(blockType)) {
    base.video = { ...DEFAULT_VIDEO_STYLE };
  }
  if (['two_columns', 'three_columns', 'split_image_text'].includes(blockType)) {
    base.columns = { ...DEFAULT_COLUMN_STYLE };
  }
  if (['standalone_button', 'button_group'].includes(blockType)) {
    base.button = { ...DEFAULT_BUTTON_STYLE };
  }
  if (['offer_box', 'checkout_form', 'opt_in_form', 'access_button', 'no_thanks_link'].includes(blockType)) {
    base.button = { ...DEFAULT_BUTTON_STYLE };
  }
  
  // Style presets per block
  if (blockType === 'dark_section') {
    base.section.backgroundColor = '#111827';
    base.section.textColor = '#f9fafb';
  }
  if (blockType === 'callout_box') {
    base.section.backgroundColor = '#eff6ff';
    base.section.borderColor = '#2563eb';
    base.section.borderRadius = 12;
    base.section.paddingTop = 24;
    base.section.paddingBottom = 24;
  }
  if (blockType === 'full_width_section') {
    base.section.maxWidth = 'full';
  }
  if (blockType === 'hero') {
    base.typography.headlineSize = 'huge';
    base.section.alignment = 'center';
    base.section.paddingTop = 64;
    base.section.paddingBottom = 64;
  }
  if (blockType === 'urgency_bar') {
    base.section.backgroundColor = '#dc2626';
    base.section.textColor = '#ffffff';
    base.section.paddingTop = 12;
    base.section.paddingBottom = 12;
    base.section.alignment = 'center';
    base.section.maxWidth = 'full';
    base.typography.headlineSize = 'small';
  }
  if (blockType === 'offer_box') {
    base.section.backgroundColor = '#fefce8';
    base.section.borderColor = '#eab308';
    base.section.borderRadius = 16;
    base.section.shadow = true;
    base.section.alignment = 'center';
  }
  if (blockType === 'order_summary') {
    base.section.backgroundColor = '#f9fafb';
    base.section.borderColor = '#e5e7eb';
    base.section.borderRadius = 12;
  }
  if (blockType === 'checkout_form') {
    base.section.borderColor = '#e5e7eb';
    base.section.borderRadius = 12;
    base.section.shadow = true;
  }
  if (blockType === 'opt_in_form') {
    base.section.backgroundColor = '#eff6ff';
    base.section.borderRadius = 12;
    base.section.alignment = 'center';
  }
  if (blockType === 'trust_note') {
    base.section.paddingTop = 16;
    base.section.paddingBottom = 16;
    base.section.alignment = 'center';
    base.typography.bodySize = 'small';
  }
  if (blockType === 'no_thanks_link') {
    base.section.paddingTop = 8;
    base.section.paddingBottom = 8;
    base.section.alignment = 'center';
  }
  
  return base;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK TYPES
// ═══════════════════════════════════════════════════════════════

export interface TemplateBlock {
  id: string;
  type: BlockType;
  label: string;
  description: string;
  category: 'core' | 'sales' | 'trust' | 'conversion' | 'media' | 'layout' | 'button';
  icon: string;
  defaultContent: BlockContent;
  copyKey: string;
}

export interface BlockContent {
  headline?: string;
  subheadline?: string;
  body?: string;
  bullets?: string[];
  cta?: string;
  ctaSubtext?: string;
  imageSlot?: boolean;
  testimonial?: { name: string; text: string };
  items?: Array<{ title: string; description: string }>;
  // Media fields
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  logos?: string[];
  // Layout fields
  leftContent?: string;
  rightContent?: string;
  columns?: Array<{ content: string }>;
  cards?: Array<{ title: string; body: string; icon?: string }>;
  // Button fields
  buttons?: Array<{ text: string; url: string; variant?: 'primary' | 'secondary' | 'outline' }>;
}

export type BlockType =
  // Content blocks
  | 'hero'
  | 'problem'
  | 'solution'
  | 'benefits'
  | 'features'
  | 'social_proof'
  | 'guarantee'
  | 'pricing'
  | 'faq'
  | 'cta_final'
  | 'urgency'
  | 'bonuses'
  | 'comparison'
  | 'about'
  | 'objection_handler'
  // Media blocks
  | 'image'
  | 'video_embed'
  | 'product_mockup'
  | 'logo_row'
  // Layout blocks
  | 'two_columns'
  | 'three_columns'
  | 'card_grid'
  | 'split_image_text'
  | 'full_width_section'
  | 'dark_section'
  | 'callout_box'
  // Button blocks
  | 'standalone_button'
  | 'button_group'
  // Funnel-specific blocks
  | 'urgency_bar'
  | 'how_it_works'
  | 'what_you_get'
  | 'offer_box'
  | 'order_summary'
  | 'checkout_form'
  | 'opt_in_form'
  | 'trust_note'
  | 'no_thanks_link'
  | 'next_steps'
  | 'access_button'
  | 'email_cards'
  | 'timeline';

export interface PageLayout {
  id: string;
  name: string;
  blocks: PlacedBlock[];
}

export interface PlacedBlock {
  instanceId: string;
  blockType: BlockType;
  content: BlockContent;
  styles: BlockStyles;
  locked?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// REUSABLE TEMPLATE SYSTEM
// ═══════════════════════════════════════════════════════════════

export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  pageType: string;
  pageStyle: string;
  blocks: PlacedBlock[];
  includeCopy: boolean;
  createdAt: number;
  updatedAt: number;
}

export function saveTemplate(template: SavedTemplate): void {
  const templates = loadTemplates();
  const idx = templates.findIndex(t => t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.push(template);
  localStorage.setItem('funnel-custom-templates', JSON.stringify(templates));
}

export function loadTemplates(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem('funnel-custom-templates');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function deleteTemplate(id: string): void {
  const templates = loadTemplates().filter(t => t.id !== id);
  localStorage.setItem('funnel-custom-templates', JSON.stringify(templates));
}

export function duplicateTemplate(id: string): SavedTemplate | null {
  const templates = loadTemplates();
  const source = templates.find(t => t.id === id);
  if (!source) return null;
  const copy: SavedTemplate = {
    ...JSON.parse(JSON.stringify(source)),
    id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    name: `${source.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  templates.push(copy);
  localStorage.setItem('funnel-custom-templates', JSON.stringify(templates));
  return copy;
}

export function exportTemplate(id: string): string | null {
  const templates = loadTemplates();
  const tpl = templates.find(t => t.id === id);
  if (!tpl) return null;
  return JSON.stringify(tpl, null, 2);
}

export function importTemplate(json: string): SavedTemplate | null {
  try {
    const tpl = JSON.parse(json) as SavedTemplate;
    tpl.id = `tpl-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    tpl.createdAt = Date.now();
    tpl.updatedAt = Date.now();
    const templates = loadTemplates();
    templates.push(tpl);
    localStorage.setItem('funnel-custom-templates', JSON.stringify(templates));
    return tpl;
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// BLOCK DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export const TEMPLATE_BLOCKS: TemplateBlock[] = [
  // ── CORE ──
  {
    id: 'hero', type: 'hero', label: 'Hero Section',
    description: 'Main headline, subheadline, and primary CTA above the fold',
    category: 'core', icon: '🎯', copyKey: 'hero',
    defaultContent: {
      headline: 'Your Headline Goes Here',
      subheadline: 'A supporting line that reinforces the promise',
      cta: 'Get Started Now', ctaSubtext: 'No credit card required', imageSlot: true,
    },
  },
  {
    id: 'problem', type: 'problem', label: 'Problem / Pain',
    description: 'Agitate the problem your buyer faces',
    category: 'core', icon: '🔥', copyKey: 'problem',
    defaultContent: {
      headline: 'The Problem',
      body: 'Describe the pain your audience feels every day.',
      bullets: ['Pain point one', 'Pain point two', 'Pain point three'],
    },
  },
  {
    id: 'solution', type: 'solution', label: 'Solution / Intro',
    description: 'Introduce your product as the answer',
    category: 'core', icon: '💡', copyKey: 'solution',
    defaultContent: {
      headline: 'There\'s a Better Way',
      body: 'Introduce your solution. Position it as the bridge from pain to desired outcome.',
      imageSlot: true,
    },
  },
  // ── SALES ──
  {
    id: 'benefits', type: 'benefits', label: 'Benefits / Outcomes',
    description: 'What the buyer gets — outcomes, not features',
    category: 'sales', icon: '✅', copyKey: 'benefits',
    defaultContent: {
      headline: 'What You\'ll Get',
      bullets: ['Benefit one', 'Benefit two', 'Benefit three', 'Benefit four', 'Benefit five'],
    },
  },
  {
    id: 'features', type: 'features', label: 'Features / What\'s Included',
    description: 'Break down what\'s inside',
    category: 'sales', icon: '📦', copyKey: 'whatYouGet',
    defaultContent: {
      headline: 'Everything Inside',
      items: [
        { title: 'Module 1', description: 'What it does' },
        { title: 'Module 2', description: 'What it does' },
        { title: 'Module 3', description: 'What it does' },
      ],
    },
  },
  {
    id: 'bonuses', type: 'bonuses', label: 'Bonus Stack',
    description: 'Free bonuses that increase perceived value',
    category: 'sales', icon: '🎁', copyKey: 'bonuses',
    defaultContent: {
      headline: 'Free Bonuses (Included Today)',
      items: [
        { title: 'Bonus #1: Quick-Start Guide', description: 'Get results on Day 1' },
        { title: 'Bonus #2: Cheat Sheet', description: 'One-page reference' },
        { title: 'Bonus #3: Priority Support', description: '30 days of direct access' },
      ],
    },
  },
  {
    id: 'comparison', type: 'comparison', label: 'Before / After',
    description: 'Show the transformation',
    category: 'sales', icon: '⚡', copyKey: 'comparison',
    defaultContent: {
      headline: 'Before vs. After',
      bullets: ['Before: Stuck and frustrated', 'After: Clear and making progress', 'Before: Wasting time on guesswork', 'After: Following a proven system'],
    },
  },
  // ── TRUST ──
  {
    id: 'social_proof', type: 'social_proof', label: 'Social Proof',
    description: 'Testimonials, logos, or results',
    category: 'trust', icon: '⭐', copyKey: 'socialProof',
    defaultContent: {
      headline: 'What Others Are Saying',
      testimonial: { name: 'Customer Name', text: '"This completely changed how I approach the problem."' },
    },
  },
  {
    id: 'guarantee', type: 'guarantee', label: 'Guarantee / Risk Reversal',
    description: 'Remove risk — money-back guarantee, trial, or promise',
    category: 'trust', icon: '🛡️', copyKey: 'guarantee',
    defaultContent: {
      headline: 'Zero Risk',
      body: 'Try it for 30 days. If it doesn\'t work, full refund. No questions asked.',
    },
  },
  {
    id: 'faq', type: 'faq', label: 'FAQ',
    description: 'Answer common objections',
    category: 'trust', icon: '❓', copyKey: 'faq',
    defaultContent: {
      headline: 'Frequently Asked Questions',
      items: [
        { title: 'Is this right for me?', description: 'If you\'re our target audience, yes.' },
        { title: 'How quickly will I see results?', description: 'Most see results within a week.' },
        { title: 'What if it doesn\'t work?', description: 'Full money-back guarantee.' },
      ],
    },
  },
  {
    id: 'about', type: 'about', label: 'About / Story',
    description: 'Brief origin story or credibility',
    category: 'trust', icon: '👤', copyKey: 'about',
    defaultContent: {
      headline: 'Why We Built This',
      body: 'We saw the problem firsthand. We built the solution we wished existed.',
      imageSlot: true,
    },
  },
  {
    id: 'objection_handler', type: 'objection_handler', label: 'Objection Handler',
    description: 'Address the #1 reason people hesitate',
    category: 'trust', icon: '🤔', copyKey: 'objectionHandler',
    defaultContent: {
      headline: 'Still on the fence?',
      body: 'Here\'s why this is different from everything else you\'ve tried.',
    },
  },
  // ── CONVERSION ──
  {
    id: 'pricing', type: 'pricing', label: 'Pricing / Offer Stack',
    description: 'Price reveal with value stack',
    category: 'conversion', icon: '💰', copyKey: 'pricing',
    defaultContent: {
      headline: 'Your Investment',
      body: 'Everything above for one simple price.',
      bullets: ['Core product (value $X)', 'Bonus 1 (value $X)', 'Bonus 2 (value $X)', 'Total value: $XXX'],
      cta: 'Get Instant Access', ctaSubtext: 'One-time payment. Lifetime access.',
    },
  },
  {
    id: 'cta_final', type: 'cta_final', label: 'Final CTA',
    description: 'Closing call-to-action',
    category: 'conversion', icon: '🚀', copyKey: 'ctaFinal',
    defaultContent: {
      headline: 'Ready to Get Started?',
      body: 'Don\'t wait. The sooner you start, the sooner you see results.',
      cta: 'Get Started Now', ctaSubtext: '30-day money-back guarantee',
    },
  },
  {
    id: 'urgency', type: 'urgency', label: 'Urgency / Scarcity',
    description: 'Create time pressure',
    category: 'conversion', icon: '⏰', copyKey: 'urgency',
    defaultContent: {
      headline: 'Why Now',
      body: 'This offer won\'t be available forever.',
    },
  },
  // ── MEDIA ──
  {
    id: 'image', type: 'image', label: 'Image',
    description: 'Full or partial-width image with optional caption',
    category: 'media', icon: '🖼️', copyKey: 'image',
    defaultContent: {
      imageUrl: '', imageAlt: 'Image', body: '',
    },
  },
  {
    id: 'video_embed', type: 'video_embed', label: 'Video Embed',
    description: 'YouTube or Vimeo embed with thumbnail',
    category: 'media', icon: '🎬', copyKey: 'videoEmbed',
    defaultContent: {
      videoUrl: '', embedUrl: '', thumbnailUrl: '', headline: 'Watch This',
    },
  },
  {
    id: 'product_mockup', type: 'product_mockup', label: 'Product Mockup',
    description: 'Show your product — screenshot, mockup, or device frame',
    category: 'media', icon: '💻', copyKey: 'productMockup',
    defaultContent: {
      imageUrl: '', imageAlt: 'Product Mockup', headline: '',
    },
  },
  {
    id: 'logo_row', type: 'logo_row', label: 'Logo Row',
    description: 'Trusted-by logos or press mentions',
    category: 'media', icon: '🏢', copyKey: 'logoRow',
    defaultContent: {
      headline: 'Trusted By', logos: [],
    },
  },
  // ── LAYOUT ──
  {
    id: 'two_columns', type: 'two_columns', label: 'Two Columns',
    description: 'Side-by-side content sections',
    category: 'layout', icon: '▐▌', copyKey: 'twoColumns',
    defaultContent: {
      leftContent: 'Left column content goes here.',
      rightContent: 'Right column content goes here.',
    },
  },
  {
    id: 'three_columns', type: 'three_columns', label: 'Three Columns',
    description: 'Three equal content sections',
    category: 'layout', icon: '▐▐▌', copyKey: 'threeColumns',
    defaultContent: {
      columns: [{ content: 'Column 1' }, { content: 'Column 2' }, { content: 'Column 3' }],
    },
  },
  {
    id: 'card_grid', type: 'card_grid', label: 'Card Grid',
    description: 'Grid of cards — features, team, or steps',
    category: 'layout', icon: '▦', copyKey: 'cardGrid',
    defaultContent: {
      headline: 'How It Works',
      cards: [
        { title: 'Step 1', body: 'Description', icon: '1️⃣' },
        { title: 'Step 2', body: 'Description', icon: '2️⃣' },
        { title: 'Step 3', body: 'Description', icon: '3️⃣' },
      ],
    },
  },
  {
    id: 'split_image_text', type: 'split_image_text', label: 'Split Image / Text',
    description: 'Image on one side, text on the other',
    category: 'layout', icon: '🖼️📝', copyKey: 'splitImageText',
    defaultContent: {
      headline: 'Feature Highlight',
      body: 'Describe what makes this special.',
      imageUrl: '', imageAlt: '',
    },
  },
  {
    id: 'full_width_section', type: 'full_width_section', label: 'Full-Width Section',
    description: 'Edge-to-edge content section',
    category: 'layout', icon: '▬', copyKey: 'fullWidth',
    defaultContent: {
      headline: 'Full Width Section',
      body: 'Content that stretches the full width of the page.',
    },
  },
  {
    id: 'dark_section', type: 'dark_section', label: 'Dark Section',
    description: 'Dark background section for contrast',
    category: 'layout', icon: '🌑', copyKey: 'darkSection',
    defaultContent: {
      headline: 'Stand Out Section',
      body: 'Use dark backgrounds to break up the page and add visual interest.',
      cta: 'Take Action',
    },
  },
  {
    id: 'callout_box', type: 'callout_box', label: 'Callout Box',
    description: 'Highlighted box for important notes or quotes',
    category: 'layout', icon: '📌', copyKey: 'calloutBox',
    defaultContent: {
      headline: 'Important Note',
      body: 'This is a key piece of information that deserves extra attention.',
    },
  },
  // ── BUTTON ──
  {
    id: 'standalone_button', type: 'standalone_button', label: 'Standalone Button',
    description: 'A single CTA button',
    category: 'button', icon: '🔘', copyKey: 'standaloneBtn',
    defaultContent: {
      cta: 'Click Here', ctaSubtext: '',
    },
  },
  {
    id: 'button_group', type: 'button_group', label: 'Button Group',
    description: 'Multiple buttons — primary + secondary',
    category: 'button', icon: '🔘🔘', copyKey: 'buttonGroup',
    defaultContent: {
      buttons: [
        { text: 'Primary Action', url: '#', variant: 'primary' },
        { text: 'Learn More', url: '#', variant: 'outline' },
      ],
    },
  },
  // ── FUNNEL-SPECIFIC ──
  {
    id: 'urgency_bar', type: 'urgency_bar', label: 'Urgency Bar',
    description: 'Top-of-page countdown or limited-time notice',
    category: 'conversion', icon: '🔴', copyKey: 'urgencyBar',
    defaultContent: {
      headline: '⏰ Limited Time: This offer expires in 24 hours',
    },
  },
  {
    id: 'how_it_works', type: 'how_it_works', label: 'How It Works',
    description: 'Step-by-step process — 3 to 5 numbered steps',
    category: 'core', icon: '🔢', copyKey: 'howItWorks',
    defaultContent: {
      headline: 'How It Works',
      cards: [
        { title: 'Step 1', body: 'Sign up and get instant access', icon: '1️⃣' },
        { title: 'Step 2', body: 'Follow the guided process', icon: '2️⃣' },
        { title: 'Step 3', body: 'See results within your first week', icon: '3️⃣' },
      ],
    },
  },
  {
    id: 'what_you_get', type: 'what_you_get', label: 'What You Get',
    description: 'Detailed breakdown of everything included',
    category: 'sales', icon: '📋', copyKey: 'whatYouGetDetailed',
    defaultContent: {
      headline: 'Here\'s Everything You Get',
      items: [
        { title: 'The Core System', description: 'Complete step-by-step framework (Value: $197)' },
        { title: 'Quick-Start Templates', description: 'Ready-to-use templates so you can start today (Value: $97)' },
        { title: 'Bonus: Cheat Sheet', description: 'One-page reference guide (Value: $47)' },
      ],
    },
  },
  {
    id: 'offer_box', type: 'offer_box', label: 'Offer Box',
    description: 'Highlighted offer summary with price and CTA',
    category: 'conversion', icon: '🎁', copyKey: 'offerBox',
    defaultContent: {
      headline: 'Special Offer',
      body: 'Get everything above for one simple price.',
      bullets: ['Full system access', 'All bonuses included', 'Lifetime updates'],
      cta: 'Get Instant Access',
      ctaSubtext: '30-day money-back guarantee',
    },
  },
  {
    id: 'order_summary', type: 'order_summary', label: 'Order Summary',
    description: 'Cart summary showing what the buyer is getting',
    category: 'conversion', icon: '🧾', copyKey: 'orderSummary',
    defaultContent: {
      headline: 'Order Summary',
      items: [
        { title: 'Main Product', description: '$47.00' },
        { title: 'Bonus Pack', description: 'FREE' },
      ],
      body: 'Total: $47.00',
    },
  },
  {
    id: 'checkout_form', type: 'checkout_form', label: 'Checkout Form',
    description: 'Payment form placeholder with trust badges',
    category: 'conversion', icon: '💳', copyKey: 'checkoutForm',
    defaultContent: {
      headline: 'Complete Your Order',
      body: 'Enter your payment details below. Your information is encrypted and secure.',
      cta: 'Complete Purchase',
      ctaSubtext: '🔒 256-bit SSL encryption',
    },
  },
  {
    id: 'opt_in_form', type: 'opt_in_form', label: 'Opt-In Form',
    description: 'Email capture form with headline and CTA',
    category: 'conversion', icon: '📧', copyKey: 'optInForm',
    defaultContent: {
      headline: 'Get Your Free Guide',
      body: 'Enter your email below and we\'ll send it right over.',
      cta: 'Send Me the Guide',
      ctaSubtext: 'No spam. Unsubscribe anytime.',
    },
  },
  {
    id: 'trust_note', type: 'trust_note', label: 'Trust Note',
    description: 'Small trust-building line — secure checkout, privacy, etc.',
    category: 'trust', icon: '🔒', copyKey: 'trustNote',
    defaultContent: {
      body: '🔒 Secure checkout · 30-day money-back guarantee · Trusted by 1,000+ customers',
    },
  },
  {
    id: 'no_thanks_link', type: 'no_thanks_link', label: 'No Thanks Link',
    description: 'Decline link for upsell/downsell pages',
    category: 'conversion', icon: '👋', copyKey: 'noThanksLink',
    defaultContent: {
      body: 'No thanks, I don\'t want this upgrade.',
      cta: 'Skip This Offer →',
    },
  },
  {
    id: 'next_steps', type: 'next_steps', label: 'Next Steps',
    description: 'Post-purchase instructions — what to do now',
    category: 'core', icon: '📍', copyKey: 'nextSteps',
    defaultContent: {
      headline: 'Here\'s What Happens Next',
      cards: [
        { title: 'Step 1', body: 'Check your email for login details', icon: '📧' },
        { title: 'Step 2', body: 'Log in and start the quick-start guide', icon: '🚀' },
        { title: 'Step 3', body: 'Get your first win within 24 hours', icon: '🎯' },
      ],
    },
  },
  {
    id: 'access_button', type: 'access_button', label: 'Access Button',
    description: 'Big button to access the purchased product',
    category: 'button', icon: '🔑', copyKey: 'accessButton',
    defaultContent: {
      cta: 'Access Your Purchase →',
      ctaSubtext: 'You\'ll also receive an email with this link.',
    },
  },
  {
    id: 'email_cards', type: 'email_cards', label: 'Email Cards',
    description: 'Visual email sequence — show each email in the series',
    category: 'layout', icon: '📬', copyKey: 'emailCards',
    defaultContent: {
      headline: 'Your Email Sequence',
      cards: [
        { title: 'Email 1: Welcome', body: 'Introduce yourself and deliver the lead magnet', icon: '👋' },
        { title: 'Email 2: Quick Win', body: 'Give them an actionable tip they can use today', icon: '⚡' },
        { title: 'Email 3: Story', body: 'Share a relevant story that builds trust', icon: '📖' },
        { title: 'Email 4: Social Proof', body: 'Show results from other customers', icon: '⭐' },
        { title: 'Email 5: The Offer', body: 'Present your product with a clear CTA', icon: '🎯' },
      ],
    },
  },
  {
    id: 'timeline', type: 'timeline', label: 'Timeline',
    description: 'Visual timeline — great for sequences, roadmaps, or processes',
    category: 'layout', icon: '📅', copyKey: 'timeline',
    defaultContent: {
      headline: 'Your Journey',
      items: [
        { title: 'Day 1', description: 'Get started with the quick-start guide' },
        { title: 'Day 3', description: 'Complete your first implementation' },
        { title: 'Day 7', description: 'See your first measurable results' },
        { title: 'Day 14', description: 'Refine and optimize your approach' },
        { title: 'Day 30', description: 'Full system running on autopilot' },
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// STARTER LAYOUTS
// ═══════════════════════════════════════════════════════════════

export const STARTER_LAYOUTS: Record<string, BlockType[]> = {
  'Sales Page': ['hero', 'problem', 'solution', 'benefits', 'features', 'social_proof', 'guarantee', 'pricing', 'faq', 'cta_final'],
  'Landing Page': ['hero', 'benefits', 'social_proof', 'cta_final'],
  'Checkout': ['hero', 'features', 'guarantee', 'pricing'],
  'Order Bump': ['hero', 'benefits'],
  'Upsell': ['hero', 'benefits', 'pricing', 'cta_final'],
  'Downsell': ['hero', 'pricing', 'cta_final'],
  'Thank You Page': ['hero', 'features'],
  'Webinar Page': ['hero', 'problem', 'benefits', 'social_proof', 'cta_final'],
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function getBlockDef(type: BlockType): TemplateBlock {
  return TEMPLATE_BLOCKS.find(b => b.type === type) || TEMPLATE_BLOCKS[0];
}

export function createPlacedBlock(type: BlockType): PlacedBlock {
  const def = getBlockDef(type);
  return {
    instanceId: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    blockType: type,
    content: JSON.parse(JSON.stringify(def.defaultContent)),
    styles: getDefaultStyles(type),
  };
}

export function layoutFromStepType(stepType: string): PlacedBlock[] {
  const blockTypes = STARTER_LAYOUTS[stepType] || STARTER_LAYOUTS['Landing Page'];
  return blockTypes.map(type => createPlacedBlock(type));
}

export function getBlocksByCategory(category: TemplateBlock['category']): TemplateBlock[] {
  return TEMPLATE_BLOCKS.filter(b => b.category === category);
}

// ═══════════════════════════════════════════════════════════════
// STYLE → CSS HELPERS
// ═══════════════════════════════════════════════════════════════

const MAX_WIDTH_MAP = { narrow: '640px', normal: '800px', wide: '1024px', full: '100%' };
const HEADLINE_SIZE_MAP = { small: '1.25rem', medium: '1.75rem', large: '2.25rem', huge: '3rem' };
const BODY_SIZE_MAP = { small: '0.875rem', normal: '1rem', large: '1.125rem' };
const FONT_WEIGHT_MAP = { normal: '400', bold: '700', extrabold: '800' };
const BTN_SIZE_MAP = { small: '0.75rem 1.25rem', medium: '0.875rem 2rem', large: '1rem 2.5rem' };
const BTN_FONT_MAP = { small: '0.8rem', medium: '1rem', large: '1.125rem' };
const IMG_WIDTH_MAP = { small: '40%', medium: '60%', large: '80%', full: '100%' };
const COL_GAP_MAP = { small: '1rem', medium: '2rem', large: '3rem' };
const COL_RATIO_MAP: Record<string, string[]> = {
  '50/50': ['1fr', '1fr'], '60/40': ['3fr', '2fr'], '40/60': ['2fr', '3fr'],
  '70/30': ['7fr', '3fr'], '30/70': ['3fr', '7fr'],
};

export function sectionToCSS(s: SectionStyle): string {
  return [
    `background-color: ${s.backgroundColor}`,
    `color: ${s.textColor}`,
    s.borderColor !== 'transparent' ? `border: 1px solid ${s.borderColor}` : '',
    s.borderRadius ? `border-radius: ${s.borderRadius}px` : '',
    s.shadow ? 'box-shadow: 0 4px 12px rgba(0,0,0,0.1)' : '',
    `padding-top: ${s.paddingTop}px`,
    `padding-bottom: ${s.paddingBottom}px`,
    `max-width: ${MAX_WIDTH_MAP[s.maxWidth]}`,
    s.maxWidth !== 'full' ? 'margin-left: auto; margin-right: auto' : '',
    `text-align: ${s.alignment}`,
    'padding-left: 24px',
    'padding-right: 24px',
  ].filter(Boolean).join('; ');
}

export function typographyToCSS(t: TypographyStyle): { headline: string; body: string } {
  return {
    headline: `font-size: ${HEADLINE_SIZE_MAP[t.headlineSize]}; font-weight: ${FONT_WEIGHT_MAP[t.fontWeight]}; line-height: 1.2; margin-bottom: 0.75em`,
    body: `font-size: ${BODY_SIZE_MAP[t.bodySize]}; line-height: 1.6`,
  };
}

export function buttonToCSS(b: ButtonStyle): string {
  return [
    `background-color: ${b.backgroundColor}`,
    `color: ${b.textColor}`,
    `padding: ${BTN_SIZE_MAP[b.size]}`,
    `font-size: ${BTN_FONT_MAP[b.size]}`,
    b.width === 'full' ? 'width: 100%; display: block' : 'display: inline-block',
    `text-align: center`,
    `border-radius: ${b.borderRadius}px`,
    'font-weight: 600',
    'cursor: pointer',
    'text-decoration: none',
    'border: none',
  ].join('; ');
}

export function imageToCSS(img: ImageStyle): string {
  const arMap: Record<string, string> = { 'auto': 'auto', '1:1': '1/1', '4:3': '4/3', '16:9': '16/9', '3:2': '3/2' };
  return [
    `width: ${IMG_WIDTH_MAP[img.width]}`,
    img.aspectRatio !== 'auto' ? `aspect-ratio: ${arMap[img.aspectRatio]}; object-fit: cover` : '',
    `display: block`,
    img.position === 'center' ? 'margin: 0 auto' : img.position === 'right' ? 'margin-left: auto' : '',
  ].filter(Boolean).join('; ');
}

export function videoToCSS(v: VideoStyle): string {
  const arMap: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' };
  return `position: relative; padding-bottom: ${arMap[v.aspectRatio]}; height: 0; overflow: hidden; width: 100%`;
}

export function columnsToCSS(c: ColumnStyle): string {
  const cols = COL_RATIO_MAP[c.ratio] || COL_RATIO_MAP['50/50'];
  return `display: grid; grid-template-columns: ${cols.join(' ')}; gap: ${COL_GAP_MAP[c.gap]}`;
}

// Build inline HTML for a single block
export function blockToHTML(block: PlacedBlock): string {
  const s = block.styles;
  const sec = sectionToCSS(s.section);
  const typ = typographyToCSS(s.typography);
  const c = block.content;
  
  let inner = '';
  
  switch (block.blockType) {
    case 'image':
      if (c.imageUrl) {
        inner = `<img src="${c.imageUrl}" alt="${c.imageAlt || ''}" style="${s.image ? imageToCSS(s.image) : 'max-width:100%'}" />`;
        if (c.body) inner += `<p style="${typ.body}; margin-top: 0.5em; opacity: 0.7">${c.body}</p>`;
      } else {
        inner = `<div style="background: #f3f4f6; padding: 60px; text-align: center; border-radius: 8px; color: #9ca3af">🖼️ Image placeholder</div>`;
      }
      break;
    case 'video_embed':
      const vStyle = s.video || DEFAULT_VIDEO_STYLE;
      if (c.embedUrl || c.videoUrl) {
        const src = c.embedUrl || c.videoUrl || '';
        inner = `<div style="${videoToCSS(vStyle)}"><iframe src="${src}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allowfullscreen></iframe></div>`;
      } else {
        inner = `<div style="background: #1a1a2e; padding: 80px; text-align: center; border-radius: 8px; color: #9ca3af">🎬 Video embed</div>`;
      }
      break;
    case 'product_mockup':
      if (c.imageUrl) {
        inner = `${c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : ''}<img src="${c.imageUrl}" alt="${c.imageAlt || ''}" style="${s.image ? imageToCSS(s.image) : 'max-width:100%; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12)'}" />`;
      } else {
        inner = `<div style="background: #f3f4f6; padding: 80px; text-align: center; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); color: #9ca3af">💻 Product mockup</div>`;
      }
      break;
    case 'logo_row':
      inner = `${c.headline ? `<p style="${typ.body}; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.5; margin-bottom: 1em; font-size: 0.75rem">${c.headline}</p>` : ''}`;
      inner += `<div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap">`;
      if (c.logos && c.logos.length > 0) {
        inner += c.logos.map(l => `<img src="${l}" alt="logo" style="height: 32px; opacity: 0.6" />`).join('');
      } else {
        inner += ['Company A', 'Company B', 'Company C', 'Company D'].map(n => `<span style="padding: 8px 16px; background: #f3f4f6; border-radius: 6px; font-size: 0.8rem; color: #9ca3af">${n}</span>`).join('');
      }
      inner += '</div>';
      break;
    case 'two_columns': {
      const colStyle = s.columns || DEFAULT_COLUMN_STYLE;
      inner = `<div style="${columnsToCSS(colStyle)}"><div>${c.leftContent || ''}</div><div>${c.rightContent || ''}</div></div>`;
      break;
    }
    case 'three_columns': {
      inner = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: ${COL_GAP_MAP[s.columns?.gap || 'medium']}">`;
      (c.columns || []).forEach(col => { inner += `<div>${col.content}</div>`; });
      inner += '</div>';
      break;
    }
    case 'card_grid': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1.5rem">`;
      (c.cards || []).forEach(card => {
        inner += `<div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center">${card.icon ? `<div style="font-size: 2rem; margin-bottom: 0.5rem">${card.icon}</div>` : ''}<h3 style="font-weight: 600; margin-bottom: 0.5rem">${card.title}</h3><p style="${typ.body}; opacity: 0.7">${card.body}</p></div>`;
      });
      inner += '</div>';
      break;
    }
    case 'split_image_text': {
      const colStyle = s.columns || DEFAULT_COLUMN_STYLE;
      const imgHtml = c.imageUrl ? `<img src="${c.imageUrl}" alt="${c.imageAlt || ''}" style="width:100%; border-radius: 8px" />` : `<div style="background: #f3f4f6; padding: 60px; text-align: center; border-radius: 8px; color: #9ca3af">🖼️</div>`;
      inner = `<div style="${columnsToCSS(colStyle)}; align-items: center"><div>${imgHtml}</div><div>${c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : ''}${c.body ? `<p style="${typ.body}">${c.body}</p>` : ''}</div></div>`;
      break;
    }
    case 'full_width_section':
    case 'dark_section':
    case 'callout_box':
      inner = `${c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : ''}${c.body ? `<p style="${typ.body}">${c.body}</p>` : ''}`;
      if (c.cta && s.button) inner += `<div style="margin-top: 1.5rem; text-align: ${s.button.alignment}"><a href="${s.button.url || '#'}" style="${buttonToCSS(s.button)}">${c.cta}</a></div>`;
      break;
    case 'standalone_button': {
      const btn = s.button || DEFAULT_BUTTON_STYLE;
      inner = `<div style="text-align: ${btn.alignment}"><a href="${btn.url || '#'}" style="${buttonToCSS(btn)}">${c.cta || btn.text}</a></div>`;
      if (c.ctaSubtext) inner += `<p style="text-align: ${btn.alignment}; font-size: 0.8rem; opacity: 0.6; margin-top: 0.5rem">${c.ctaSubtext}</p>`;
      break;
    }
    case 'button_group': {
      const btns = c.buttons || [];
      const btn = s.button || DEFAULT_BUTTON_STYLE;
      inner = `<div style="display: flex; gap: 1rem; justify-content: ${btn.alignment === 'center' ? 'center' : btn.alignment === 'right' ? 'flex-end' : 'flex-start'}; flex-wrap: wrap">`;
      btns.forEach(b => {
        const variant = b.variant || 'primary';
        const bg = variant === 'primary' ? btn.backgroundColor : variant === 'outline' ? 'transparent' : '#f3f4f6';
        const color = variant === 'primary' ? btn.textColor : variant === 'outline' ? btn.backgroundColor : '#1a1a1a';
        const border = variant === 'outline' ? `border: 2px solid ${btn.backgroundColor}` : 'border: none';
        inner += `<a href="${b.url || '#'}" style="${buttonToCSS({ ...btn, backgroundColor: bg, textColor: color })}; ${border}">${b.text}</a>`;
      });
      inner += '</div>';
      break;
    }
    case 'urgency_bar':
      inner = `<div style="font-weight:700;font-size:0.9rem;letter-spacing:0.05em">${c.headline || ''}</div>`;
      break;
    case 'how_it_works':
    case 'next_steps': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-top: 1.5rem">`;
      (c.cards || []).forEach(card => {
        inner += `<div style="text-align: center; padding: 1.5rem"><div style="font-size: 2rem; margin-bottom: 0.75rem">${card.icon || ''}</div><h3 style="font-weight: 700; margin-bottom: 0.5rem">${card.title}</h3><p style="${typ.body}; opacity: 0.7">${card.body}</p></div>`;
      });
      inner += '</div>';
      break;
    }
    case 'what_you_get': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += `<div style="margin-top: 1.5rem">`;
      (c.items || []).forEach(it => {
        inner += `<div style="display:flex;align-items:flex-start;padding:1rem 0;border-bottom:1px solid #f0f0f0"><div style="flex:1"><strong style="font-size:1.05rem">${it.title}</strong><p style="${typ.body};opacity:0.7;margin-top:0.25rem">${it.description}</p></div></div>`;
      });
      inner += '</div>';
      break;
    }
    case 'offer_box': {
      inner = `<div style="text-align:center">`;
      if (c.headline) inner += `<h2 style="${typ.headline}">${c.headline}</h2>`;
      if (c.body) inner += `<p style="${typ.body}; margin-top:0.5rem">${c.body}</p>`;
      if (c.bullets && c.bullets.length) inner += `<ul style="list-style:none;padding:0;margin:1rem 0">${c.bullets.map(b => `<li style="padding:0.5rem 0">✅ ${b}</li>`).join('')}</ul>`;
      if (c.cta && s.button) inner += `<div style="margin-top:1.5rem"><a href="${s.button.url||'#'}" style="${buttonToCSS(s.button)}">${c.cta}</a></div>`;
      if (c.ctaSubtext) inner += `<p style="font-size:0.8rem;opacity:0.6;margin-top:0.5rem">${c.ctaSubtext}</p>`;
      inner += '</div>';
      break;
    }
    case 'order_summary': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += '<div style="margin-top:1rem">';
      (c.items || []).forEach(it => {
        inner += `<div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #e5e7eb"><span>${it.title}</span><span style="font-weight:600">${it.description}</span></div>`;
      });
      if (c.body) inner += `<div style="display:flex;justify-content:space-between;padding:1rem 0;font-weight:800;font-size:1.2rem">${c.body}</div>`;
      inner += '</div>';
      break;
    }
    case 'checkout_form':
    case 'opt_in_form': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      if (c.body) inner += `<p style="${typ.body};margin-top:0.5rem;opacity:0.7">${c.body}</p>`;
      inner += `<div style="margin-top:1.5rem;padding:1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb">`;
      if (block.blockType === 'opt_in_form') {
        inner += `<div style="margin-bottom:0.75rem"><input type="email" placeholder="Your email address" style="width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:1rem" disabled /></div>`;
      } else {
        inner += `<div style="margin-bottom:0.75rem"><input placeholder="Full Name" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px" disabled /></div>`;
        inner += `<div style="margin-bottom:0.75rem"><input placeholder="Email" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px" disabled /></div>`;
        inner += `<div style="margin-bottom:0.75rem"><input placeholder="Card Number" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px" disabled /></div>`;
      }
      if (c.cta && s.button) inner += `<a href="${s.button.url||'#'}" style="${buttonToCSS({...s.button, width:'full'})}">${c.cta}</a>`;
      inner += '</div>';
      if (c.ctaSubtext) inner += `<p style="text-align:center;font-size:0.8rem;opacity:0.5;margin-top:0.75rem">${c.ctaSubtext}</p>`;
      break;
    }
    case 'trust_note':
      inner = `<p style="${typ.body};opacity:0.5">${c.body || ''}</p>`;
      break;
    case 'no_thanks_link':
      inner = `<div style="text-align:center">`;
      if (c.body) inner += `<p style="${typ.body};opacity:0.5;margin-bottom:0.5rem">${c.body}</p>`;
      if (c.cta) inner += `<a href="#" style="color:${s.section.accentColor};font-size:0.85rem;text-decoration:underline">${c.cta}</a>`;
      inner += '</div>';
      break;
    case 'access_button': {
      const btn = s.button || DEFAULT_BUTTON_STYLE;
      inner = `<div style="text-align:center"><a href="${btn.url||'#'}" style="${buttonToCSS({...btn, size:'large'})}">${c.cta || btn.text}</a></div>`;
      if (c.ctaSubtext) inner += `<p style="text-align:center;font-size:0.8rem;opacity:0.5;margin-top:0.75rem">${c.ctaSubtext}</p>`;
      break;
    }
    case 'email_cards': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += '<div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1rem">';
      (c.cards || []).forEach((card, i) => {
        inner += `<div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border:1px solid #e5e7eb;border-radius:12px;background:#fff"><div style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:${s.section.accentColor};color:white;display:flex;align-items:center;justify-content:center;font-weight:700">${card.icon || (i+1)}</div><div><strong>${card.title}</strong><p style="${typ.body};opacity:0.7;margin-top:0.25rem">${card.body}</p></div></div>`;
      });
      inner += '</div>';
      break;
    }
    case 'timeline': {
      inner = c.headline ? `<h2 style="${typ.headline}">${c.headline}</h2>` : '';
      inner += '<div style="margin-top:1.5rem;position:relative;padding-left:2rem">';
      inner += `<div style="position:absolute;left:7px;top:0;bottom:0;width:2px;background:${s.section.accentColor};opacity:0.3"></div>`;
      (c.items || []).forEach(it => {
        inner += `<div style="position:relative;padding-bottom:1.5rem"><div style="position:absolute;left:-2rem;top:2px;width:16px;height:16px;border-radius:50%;background:${s.section.accentColor}"></div><strong>${it.title}</strong><p style="${typ.body};opacity:0.7;margin-top:0.25rem">${it.description}</p></div>`;
      });
      inner += '</div>';
      break;
    }
    default: {
      // Content blocks — hero, problem, solution, etc.
      if (c.headline) inner += `<h2 style="${typ.headline}">${c.headline}</h2>`;
      if (c.subheadline) inner += `<p style="${typ.body}; opacity: 0.7; margin-bottom: 1em">${c.subheadline}</p>`;
      if (c.body) inner += `<p style="${typ.body}">${c.body}</p>`;
      if (c.bullets && c.bullets.length) {
        inner += `<ul style="${typ.body}; padding-left: 1.5em; margin-top: 1em">${c.bullets.map(b => `<li style="margin-bottom: 0.5em">${b}</li>`).join('')}</ul>`;
      }
      if (c.items && c.items.length) {
        inner += `<div style="margin-top: 1.5em">${c.items.map(it => `<div style="margin-bottom: 1.25em"><strong>${it.title}</strong><p style="${typ.body}; opacity: 0.8; margin-top: 0.25em">${it.description}</p></div>`).join('')}</div>`;
      }
      if (c.testimonial) {
        inner += `<blockquote style="border-left: 3px solid ${s.section.accentColor}; padding-left: 1em; margin-top: 1.5em; font-style: italic">${c.testimonial.text}<br/><strong>— ${c.testimonial.name}</strong></blockquote>`;
      }
      if (c.cta && s.button) {
        inner += `<div style="margin-top: 1.5rem; text-align: ${s.button.alignment}"><a href="${s.button.url || '#'}" style="${buttonToCSS(s.button)}">${c.cta}</a></div>`;
      } else if (c.cta) {
        inner += `<div style="margin-top: 1.5rem"><a href="#" style="${buttonToCSS(DEFAULT_BUTTON_STYLE)}">${c.cta}</a></div>`;
      }
      if (c.ctaSubtext) inner += `<p style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.5rem; text-align: center">${c.ctaSubtext}</p>`;
      break;
    }
  }
  
  return `<section style="${sec}">${inner}</section>`;
}

// Build full page HTML from blocks
export function blocksToHTML(blocks: PlacedBlock[], title?: string): string {
  const sectionsHTML = blocks.map(b => blockToHTML(b)).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || 'Page'}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
img { max-width: 100%; height: auto; }
a { color: inherit; }
@media (max-width: 768px) {
  [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  section { padding-left: 16px !important; padding-right: 16px !important; }
}
</style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;
}
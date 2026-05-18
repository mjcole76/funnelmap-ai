/**
 * Template and block types for the Template Builder.
 * Canonical definitions live in lib/templateBlocks.ts — these are the type interfaces.
 */

export type BlockCategory = 'core' | 'sales' | 'trust' | 'conversion' | 'media' | 'layout' | 'button';

export type BlockType =
  // Content
  | 'hero' | 'problem' | 'solution' | 'benefits' | 'features'
  | 'social_proof' | 'guarantee' | 'pricing' | 'faq' | 'cta_final'
  | 'urgency' | 'bonuses' | 'comparison' | 'about' | 'objection_handler'
  // Media
  | 'image' | 'video_embed' | 'product_mockup' | 'logo_row'
  // Layout
  | 'two_columns' | 'three_columns' | 'card_grid' | 'split_image_text'
  | 'full_width_section' | 'dark_section' | 'callout_box'
  // Button
  | 'standalone_button' | 'button_group';

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
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  logos?: string[];
  leftContent?: string;
  rightContent?: string;
  columns?: Array<{ content: string }>;
  cards?: Array<{ title: string; body: string; icon?: string }>;
  buttons?: Array<{ text: string; url: string; variant?: 'primary' | 'secondary' | 'outline' }>;
}

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

export interface PlacedBlock {
  instanceId: string;
  blockType: BlockType;
  content: BlockContent;
  styles: BlockStyles;
  locked?: boolean;
}

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

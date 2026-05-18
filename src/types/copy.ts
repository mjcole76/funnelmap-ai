/**
 * Generated copy output from the copy engine.
 */
export interface GeneratedCopy {
  headline: string;
  sections: CopySection[];
  cta?: string;
  button?: string;
}

/**
 * A single section of generated copy.
 */
export interface CopySection {
  title: string;
  content: string;
}

/**
 * Parsed copy content for rendering in previews.
 */
export interface ParsedCopy {
  headline: string;
  subheadline: string;
  cta: string;
  bullets: string[];
  benefits: string[];
  whatYouGet: string[];
  testimonial: string;
  faq: Array<{ q: string; a: string }>;
  guarantee: string;
  urgency: string;
  price: string;
  sections: CopySection[];
}

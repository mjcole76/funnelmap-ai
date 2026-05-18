import type { TemplateQualityIssue, TemplateIssueType, IssueSeverity } from '../types/qa';
import type { PlacedBlock, BlockType } from './templateBlocks';
import { getBlockDef } from './templateBlocks';

let issueCounter = 0;
function makeId(): string { return `tqa-${++issueCounter}-${Date.now()}`; }

function issue(block: PlacedBlock, severity: IssueSeverity, issueType: TemplateIssueType, message: string, autoFixable = false): TemplateQualityIssue {
  const def = getBlockDef(block.blockType);
  return {
    id: makeId(),
    blockInstanceId: block.instanceId,
    blockType: block.blockType,
    blockLabel: def.label,
    severity,
    issueType,
    message,
    autoFixable,
  };
}

function structuralIssue(blockType: string, blockLabel: string, severity: IssueSeverity, issueType: TemplateIssueType, message: string, autoFixable = false): TemplateQualityIssue {
  return { id: makeId(), blockInstanceId: '', blockType, blockLabel, severity, issueType, message, autoFixable };
}

/**
 * Analyze a template layout for structural and quality issues.
 */
export function analyzeTemplate(blocks: PlacedBlock[], stepType: string): TemplateQualityIssue[] {
  const issues: TemplateQualityIssue[] = [];
  issueCounter = 0;

  if (!blocks || blocks.length === 0) return issues;

  const blockTypes = blocks.map(b => b.blockType);
  const isPaidPage = ['Sales Page', 'Checkout', 'Upsell', 'Downsell', 'Order Bump'].includes(stepType);
  const isSalesPage = stepType === 'Sales Page';
  const isCheckout = stepType === 'Checkout';
  const isLanding = stepType === 'Landing Page';
  const isThankYou = stepType === 'Thank You Page';
  const isEmail = stepType === 'Email Follow-up';

  // ═══════ STRUCTURAL CHECKS ═══════

  // Missing hero
  if (!blockTypes.includes('hero')) {
    issues.push(structuralIssue('hero', 'Hero Section', 'warning', 'missing_hero',
      'No hero section. Most pages need a hero with a headline and CTA above the fold.', true));
  }

  // Missing CTA
  const ctaBlocks = blockTypes.filter(t => ['cta_final', 'standalone_button', 'button_group', 'offer_box', 'access_button'].includes(t));
  if (ctaBlocks.length === 0 && !blockTypes.includes('hero')) {
    issues.push(structuralIssue('cta_final', 'Final CTA', 'critical', 'missing_cta',
      'No CTA block anywhere on the page. Visitors have no clear action to take.', true));
  }

  // Missing pricing on paid pages
  if (isPaidPage && !blockTypes.includes('pricing') && !blockTypes.includes('offer_box')) {
    issues.push(structuralIssue('pricing', 'Pricing', 'critical', 'missing_pricing',
      `${stepType} has no pricing block. Buyers need to see the price.`, true));
  }

  // Missing guarantee on sales/checkout
  if ((isSalesPage || isCheckout) && !blockTypes.includes('guarantee')) {
    issues.push(structuralIssue('guarantee', 'Guarantee', 'warning', 'missing_guarantee',
      `${stepType} has no guarantee/risk reversal. This reduces conversion.`, true));
  }

  // Missing FAQ on sales pages
  if (isSalesPage && !blockTypes.includes('faq')) {
    issues.push(structuralIssue('faq', 'FAQ', 'warning', 'missing_faq',
      'Sales page has no FAQ section. FAQs handle objections and boost conversion.', true));
  }

  // Checkout page missing checkout form
  if (isCheckout && !blockTypes.includes('checkout_form')) {
    issues.push(structuralIssue('checkout_form', 'Checkout Form', 'critical', 'missing_checkout_form',
      'Checkout page has no checkout form block. Buyers cannot complete their purchase.', true));
  }

  // Landing page missing opt-in form
  if (isLanding && !blockTypes.includes('opt_in_form')) {
    issues.push(structuralIssue('opt_in_form', 'Opt-In Form', 'critical', 'missing_optin_form',
      'Landing page has no opt-in form. Visitors cannot subscribe.', true));
  }

  // Thank you page missing access button or next steps
  if (isThankYou && !blockTypes.includes('access_button') && !blockTypes.includes('next_steps')) {
    issues.push(structuralIssue('next_steps', 'Next Steps', 'warning', 'missing_next_steps',
      'Thank you page has no Access Button or Next Steps block. Buyers won\'t know what to do next.', true));
  }

  // Email page missing email cards
  if (isEmail && !blockTypes.includes('email_cards') && !blockTypes.includes('timeline')) {
    issues.push(structuralIssue('email_cards', 'Email Cards', 'warning', 'missing_email_cards',
      'Email follow-up page has no Email Cards or Timeline block.', true));
  }

  // Duplicate block detection (accidental)
  const typeCounts: Record<string, number> = {};
  for (const bt of blockTypes) {
    typeCounts[bt] = (typeCounts[bt] || 0) + 1;
  }
  const neverDuplicate = ['hero', 'pricing', 'guarantee', 'checkout_form', 'opt_in_form', 'order_summary', 'urgency_bar'];
  for (const bt of neverDuplicate) {
    if ((typeCounts[bt] || 0) > 1) {
      const dupeBlocks = blocks.filter(b => b.blockType === bt);
      for (let i = 1; i < dupeBlocks.length; i++) {
        issues.push(issue(dupeBlocks[i], 'warning', 'duplicate_block',
          `Duplicate ${getBlockDef(bt as BlockType).label} block. This is usually accidental — consider removing the extra.`));
      }
    }
  }

  // Too many sections without CTA
  let sectionsSinceCTA = 0;
  for (const block of blocks) {
    if (['cta_final', 'standalone_button', 'button_group', 'hero', 'pricing', 'offer_box', 'checkout_form', 'opt_in_form', 'access_button'].includes(block.blockType)) {
      sectionsSinceCTA = 0;
    } else {
      sectionsSinceCTA++;
    }
    if (sectionsSinceCTA >= 5) {
      issues.push(issue(block, 'info', 'too_many_sections_without_cta',
        '5+ sections in a row without a CTA. Consider adding a button here to avoid losing readers.'));
      sectionsSinceCTA = 0;
    }
  }

  // ═══════ PER-BLOCK CHECKS ═══════

  for (const block of blocks) {
    const c = block.content;
    const s = block.styles;

    // Empty blocks
    const hasContent = c.headline || c.body || c.cta || (c.bullets && c.bullets.length) ||
      (c.items && c.items.length) || c.imageUrl || c.videoUrl ||
      (c.cards && c.cards.length) || (c.buttons && c.buttons.length);
    if (!hasContent && !['standalone_button', 'button_group', 'trust_note', 'no_thanks_link'].includes(block.blockType)) {
      issues.push(issue(block, 'warning', 'empty_block', `${getBlockDef(block.blockType).label} block has no content.`));
    }

    // Empty image URL
    if (['image', 'product_mockup', 'split_image_text'].includes(block.blockType)) {
      if (!c.imageUrl && !(s.image && s.image.url)) {
        issues.push(issue(block, 'info', 'empty_image_url', 'Image URL is empty. Add an image or remove the block.'));
      }
    }

    // Empty video URL
    if (block.blockType === 'video_embed') {
      if (!c.videoUrl && !c.embedUrl && !(s.video && (s.video.url || s.video.embedUrl))) {
        issues.push(issue(block, 'info', 'empty_video_url', 'Video URL is empty. Add a YouTube/Vimeo URL or remove the block.'));
      }
    }

    // Button with no text
    if (['standalone_button', 'button_group'].includes(block.blockType)) {
      if (block.blockType === 'standalone_button' && !c.cta && !(s.button && s.button.text)) {
        issues.push(issue(block, 'warning', 'button_no_text', 'Button has no text. Add a CTA label.'));
      }
      if (block.blockType === 'button_group' && c.buttons) {
        c.buttons.forEach((btn: any, idx: number) => {
          if (!btn.text) issues.push(issue(block, 'warning', 'button_no_text', `Button ${idx + 1} in group has no text.`));
          if (!btn.url || btn.url === '#') issues.push(issue(block, 'info', 'button_no_url', `Button ${idx + 1} has no URL (still set to #).`));
        });
      }
    }

    // Funnel block buttons with no text/URL
    if (['offer_box', 'checkout_form', 'opt_in_form', 'access_button'].includes(block.blockType)) {
      if (!c.cta && !(s.button && s.button.text)) {
        issues.push(issue(block, 'warning', 'button_no_text', `${getBlockDef(block.blockType).label} has no CTA button text.`));
      }
    }

    // Button with placeholder URL
    if (s.button && (!s.button.url || s.button.url === '#') && (c.cta || (s.button.text && s.button.text !== 'Get Started'))) {
      if (['hero', 'cta_final', 'pricing', 'dark_section', 'standalone_button', 'offer_box', 'checkout_form', 'opt_in_form', 'access_button'].includes(block.blockType)) {
        issues.push(issue(block, 'info', 'button_no_url', 'Button URL is "#". Update with a real link before publishing.'));
      }
    }

    // Pricing missing price
    if (block.blockType === 'pricing' && c.body) {
      if (!c.body.match(/\$\d+/) && !(c.bullets || []).some((b: string) => b.match(/\$\d+/))) {
        issues.push(issue(block, 'warning', 'pricing_missing_price', 'Pricing block doesn\'t show a dollar amount. Add the actual price.'));
      }
    }

    // Poor text/background contrast
    if (s.section) {
      const contrast = checkContrast(s.section.backgroundColor, s.section.textColor);
      if (contrast < 3) {
        issues.push(issue(block, 'warning', 'poor_contrast',
          `Low text/background contrast (${contrast.toFixed(1)}:1). Minimum recommended is 4.5:1 for readability.`));
      }
    }
  }

  return issues;
}

/**
 * Calculate Template QA score (0-100).
 */
export function templateQAScore(issues: TemplateQualityIssue[]): number {
  if (issues.length === 0) return 100;
  let score = 100;
  for (const iss of issues) {
    if (iss.severity === 'critical') score -= 15;
    else if (iss.severity === 'warning') score -= 7;
    else if (iss.severity === 'info') score -= 2;
  }
  return Math.max(0, score);
}

/**
 * Summary counts by severity.
 */
export function templateQASummary(issues: TemplateQualityIssue[]): { critical: number; warning: number; info: number; passed: number } {
  const critical = issues.filter(i => i.severity === 'critical').length;
  const warning = issues.filter(i => i.severity === 'warning').length;
  const info = issues.filter(i => i.severity === 'info').length;
  // Count passed checks: total possible checks minus issues
  const totalPossible = 17; // max possible checks
  const passed = Math.max(0, totalPossible - issues.length);
  return { critical, warning, info, passed };
}

// ═══════ CONTRAST HELPER ═══════

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function checkContrast(bg: string, fg: string): number {
  const bgRgb = hexToRgb(bg);
  const fgRgb = hexToRgb(fg);
  if (!bgRgb || !fgRgb) return 21;
  const l1 = luminance(...bgRgb);
  const l2 = luminance(...fgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

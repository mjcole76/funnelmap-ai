import type { TemplateQualityIssue, TemplateIssueType, IssueSeverity } from '../types/qa';
import type { PlacedBlock } from './templateBlocks';
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

/**
 * Analyze a template layout for structural and quality issues.
 */
export function analyzeTemplate(blocks: PlacedBlock[], stepType: string): TemplateQualityIssue[] {
  const issues: TemplateQualityIssue[] = [];
  issueCounter = 0;

  if (!blocks || blocks.length === 0) return issues;

  const blockTypes = blocks.map(b => b.blockType);
  const isPaidPage = ['Sales Page', 'Checkout', 'Upsell', 'Downsell', 'Order Bump'].includes(stepType);

  // ═══════ STRUCTURAL CHECKS ═══════

  // Missing hero
  if (!blockTypes.includes('hero')) {
    issues.push({
      id: makeId(), blockInstanceId: '', blockType: 'hero', blockLabel: 'Hero Section',
      severity: 'warning', issueType: 'missing_hero',
      message: 'No hero section. Most pages need a hero with a headline and CTA above the fold.',
      autoFixable: true,
    });
  }

  // Missing CTA
  const ctaBlocks = blockTypes.filter(t => ['cta_final', 'standalone_button', 'button_group'].includes(t));
  if (ctaBlocks.length === 0 && !blockTypes.includes('hero')) {
    issues.push({
      id: makeId(), blockInstanceId: '', blockType: 'cta_final', blockLabel: 'Final CTA',
      severity: 'critical', issueType: 'missing_cta',
      message: 'No CTA block anywhere on the page. Visitors have no clear action to take.',
      autoFixable: true,
    });
  }

  // Missing pricing on paid pages
  if (isPaidPage && !blockTypes.includes('pricing')) {
    issues.push({
      id: makeId(), blockInstanceId: '', blockType: 'pricing', blockLabel: 'Pricing',
      severity: 'critical', issueType: 'missing_pricing',
      message: `${stepType} has no pricing block. Buyers need to see the price.`,
      autoFixable: true,
    });
  }

  // Missing guarantee on sales/checkout
  if (['Sales Page', 'Checkout'].includes(stepType) && !blockTypes.includes('guarantee')) {
    issues.push({
      id: makeId(), blockInstanceId: '', blockType: 'guarantee', blockLabel: 'Guarantee',
      severity: 'warning', issueType: 'missing_guarantee',
      message: `${stepType} has no guarantee/risk reversal. This reduces conversion.`,
      autoFixable: true,
    });
  }

  // Too many sections without CTA
  let sectionsSinceCTA = 0;
  for (const block of blocks) {
    if (['cta_final', 'standalone_button', 'button_group', 'hero', 'pricing'].includes(block.blockType)) {
      sectionsSinceCTA = 0;
    } else {
      sectionsSinceCTA++;
    }
    if (sectionsSinceCTA >= 5) {
      issues.push(issue(block, 'info', 'too_many_sections_without_cta',
        `5+ sections in a row without a CTA. Consider adding a button here to avoid losing readers.`));
      sectionsSinceCTA = 0; // Only flag once per run
    }
  }

  // ═══════ PER-BLOCK CHECKS ═══════

  for (const block of blocks) {
    const c = block.content;
    const s = block.styles;

    // Empty blocks
    const hasContent = c.headline || c.body || c.cta || (c.bullets && c.bullets.length) || (c.items && c.items.length) || c.imageUrl || c.videoUrl || (c.cards && c.cards.length);
    if (!hasContent && !['standalone_button', 'button_group'].includes(block.blockType)) {
      issues.push(issue(block, 'warning', 'empty_block', `${getBlockDef(block.blockType).label} block has no content.`));
    }

    // Empty image URL
    if (['image', 'product_mockup', 'split_image_text'].includes(block.blockType)) {
      if (!c.imageUrl && !(s.image && s.image.url)) {
        issues.push(issue(block, 'info', 'empty_image_url', `Image URL is empty. Add an image or remove the block.`));
      }
    }

    // Empty video URL
    if (block.blockType === 'video_embed') {
      if (!c.videoUrl && !c.embedUrl && !(s.video && (s.video.url || s.video.embedUrl))) {
        issues.push(issue(block, 'info', 'empty_video_url', `Video URL is empty. Add a YouTube/Vimeo URL or remove the block.`));
      }
    }

    // Button with no text
    if (['standalone_button', 'button_group'].includes(block.blockType)) {
      if (block.blockType === 'standalone_button' && !c.cta && !(s.button && s.button.text)) {
        issues.push(issue(block, 'warning', 'button_no_text', `Button has no text. Add a CTA label.`));
      }
      if (block.blockType === 'button_group' && c.buttons) {
        c.buttons.forEach((btn, idx) => {
          if (!btn.text) issues.push(issue(block, 'warning', 'button_no_text', `Button ${idx + 1} in group has no text.`));
          if (!btn.url || btn.url === '#') issues.push(issue(block, 'info', 'button_no_url', `Button ${idx + 1} has no URL (still set to #).`));
        });
      }
    }

    // Button with no URL
    if (s.button && (!s.button.url || s.button.url === '#') && (c.cta || (s.button.text && s.button.text !== 'Get Started'))) {
      if (['hero', 'cta_final', 'pricing', 'dark_section', 'standalone_button'].includes(block.blockType)) {
        issues.push(issue(block, 'info', 'button_no_url', `Button URL is "#". Update with a real link before publishing.`));
      }
    }

    // Pricing missing price
    if (block.blockType === 'pricing' && c.body) {
      if (!c.body.match(/\$\d+/) && !(c.bullets || []).some(b => b.match(/\$\d+/))) {
        issues.push(issue(block, 'warning', 'pricing_missing_price', `Pricing block doesn't show a dollar amount. Add the actual price.`));
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
  if (!bgRgb || !fgRgb) return 21; // Can't parse — assume fine
  const l1 = luminance(...bgRgb);
  const l2 = luminance(...fgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

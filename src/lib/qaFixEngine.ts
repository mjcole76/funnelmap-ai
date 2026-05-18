/**
 * QA Fix Engine
 * 
 * Auto-fixes QA issues by surgically editing copy data
 * without regenerating the entire page.
 */

import { QualityIssue, IssueType } from '../components/CopyQualityReport';
import { FunnelContext, generateCopy } from './copyTemplates';

// ═══════════════════════════════════════════════════════════════
// BLOCKED PHRASES (must match CopyQualityReport)
// ═══════════════════════════════════════════════════════════════

const BLOCKED_PHRASES = [
  'generated funnel copy',
  'low conversions',
  'sell product',
  'your headline here',
  'your content goes here',
  'want to upgrade your order?',
];

const GENERIC_FILLER = [
  'lorem ipsum',
  'insert your',
  'placeholder',
  'example text',
  'add your',
  '[your ',
  '{your ',
  'click here to',
  'your product name',
  'your audience',
];

const FAKE_PROOF_PATTERNS = [
  /\d{1,3}(?:,\d{3})*\+?\s*(?:happy|satisfied|verified)\s*(?:customers|users|buyers|clients)/gi,
  /\$\d{1,3}(?:,\d{3})*\+?\s*(?:in revenue|generated|earned)/gi,
  /(?:trusted by|used by|loved by)\s*\d+[^\n.]*/gi,
  /\d+%\s*(?:success rate|satisfaction|improvement|increase)[^\n.]*/gi,
];

// ═══════════════════════════════════════════════════════════════
// FIX FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function fixIssue(issue: QualityIssue, copyData: any, funnelContext: FunnelContext, stepType: string): any {
  if (!copyData) return null;

  // Deep clone so we don't mutate
  const fixed = JSON.parse(JSON.stringify(copyData));

  switch (issue.issueType) {
    case 'no_copy':
      return fixNoCopy(funnelContext, stepType);

    case 'missing_product_name':
      return fixMissingProductName(fixed, funnelContext);

    case 'missing_audience':
      return fixMissingAudience(fixed, funnelContext);

    case 'missing_price':
      return fixMissingPrice(fixed, funnelContext, stepType);

    case 'blocked_phrase':
      return fixBlockedPhrase(fixed, funnelContext);

    case 'conditional_blocked':
      return fixBlockedPhrase(fixed, funnelContext);

    case 'generic_filler':
      return fixGenericFiller(fixed, funnelContext);

    case 'fake_proof':
      return fixFakeProof(fixed);

    case 'weak_cta':
      return fixWeakCta(fixed, funnelContext, stepType);

    case 'broken_variable':
      return fixBrokenVariable(fixed, funnelContext);

    case 'missing_section':
      return fixMissingSection(fixed, funnelContext, stepType, issue.message);

    case 'step_mismatch':
      return fixNoCopy(funnelContext, stepType); // Full regen for mismatch

    default:
      return fixed;
  }
}

// ───────────────────────────────────────────────────────────────
// Fix: No copy → generate from scratch
// ───────────────────────────────────────────────────────────────
function fixNoCopy(ctx: FunnelContext, stepType: string): any {
  return generateCopy(stepType, ctx);
}

// ───────────────────────────────────────────────────────────────
// Fix: Missing product name → insert into headline/subheadline
// ───────────────────────────────────────────────────────────────
function fixMissingProductName(copy: any, ctx: FunnelContext): any {
  const name = ctx.productName || 'Your Product';

  // Insert into headline if possible
  if (copy.headline) {
    // Replace generic references
    copy.headline = copy.headline
      .replace(/this (tool|product|system|kit|bundle|guide|resource)/gi, `${name}`)
      .replace(/our (tool|product|system|kit|bundle|guide|resource)/gi, `${name}`)
      .replace(/the (tool|product|system|kit|bundle|guide|resource)/gi, `${name}`);

    // If still not there, prepend
    if (!copy.headline.toLowerCase().includes(name.toLowerCase())) {
      copy.headline = `${name}: ${copy.headline}`;
    }
  }

  // Also check first section
  if (copy.sections && copy.sections.length > 0) {
    const firstSection = copy.sections[0];
    if (firstSection.content && !firstSection.content.toLowerCase().includes(name.toLowerCase())) {
      firstSection.content = firstSection.content.replace(
        /this (program|tool|product|system|kit)/gi,
        name
      );
    }
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Missing audience → insert into hero/problem section
// ───────────────────────────────────────────────────────────────
function fixMissingAudience(copy: any, ctx: FunnelContext): any {
  const audience = ctx.audience || 'professionals';

  // Add to subheadline or first section
  if (copy.sections && copy.sections.length > 0) {
    // Look for hero/problem section
    const targetIdx = copy.sections.findIndex((s: any) =>
      s.title?.toLowerCase().includes('who') ||
      s.title?.toLowerCase().includes('for') ||
      s.title?.toLowerCase().includes('problem')
    );

    if (targetIdx >= 0) {
      const section = copy.sections[targetIdx];
      if (!section.content.toLowerCase().includes(audience.toLowerCase())) {
        section.content = `Built for ${audience}.\n\n${section.content}`;
      }
    } else {
      // Insert audience reference into first section
      const first = copy.sections[0];
      if (first && first.content && !first.content.toLowerCase().includes(audience.toLowerCase())) {
        first.content = first.content.replace(/^/, `Designed specifically for ${audience}. `);
      }
    }
  }

  // Also try headline
  if (copy.headline && !copy.headline.toLowerCase().includes(audience.toLowerCase())) {
    // Append "for [audience]" if headline is short enough
    if (copy.headline.length < 60) {
      copy.headline = `${copy.headline} for ${audience}`;
    }
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Missing price → insert into CTA/offer section
// ───────────────────────────────────────────────────────────────
function fixMissingPrice(copy: any, ctx: FunnelContext, stepType: string): any {
  const price = ctx.price || '$29';

  // Update CTA to include price
  if (copy.cta) {
    copy.cta = `Get Instant Access — ${price}`;
  } else if (copy.button) {
    copy.button = `Get Instant Access — ${price}`;
  }

  // Find offer/pricing section and insert price
  if (copy.sections) {
    const offerIdx = copy.sections.findIndex((s: any) =>
      s.title?.toLowerCase().includes('offer') ||
      s.title?.toLowerCase().includes('price') ||
      s.title?.toLowerCase().includes('get') ||
      s.title?.toLowerCase().includes('included')
    );

    if (offerIdx >= 0) {
      const section = copy.sections[offerIdx];
      if (!section.content.includes(price)) {
        section.content += `\n\nYour investment today: ${price}`;
      }
    } else {
      // Add a pricing line to the last section
      const lastSection = copy.sections[copy.sections.length - 1];
      if (lastSection) {
        lastSection.content += `\n\nAll of this for just ${price}.`;
      }
    }
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Blocked phrase → replace with offer-specific copy
// ───────────────────────────────────────────────────────────────
function fixBlockedPhrase(copy: any, ctx: FunnelContext): any {
  const name = ctx.productName || 'this';
  const audience = ctx.audience || 'you';

  const replacements: Record<string, string> = {
    'generated funnel copy': `copy written for ${name}`,
    'low conversions': `missed opportunities`,
    'sell product': `grow your revenue with ${name}`,
    'your headline here': `Get ${name} Today`,
    'your content goes here': `Everything you need to succeed with ${name}.`,
    'want to upgrade your order?': `Add ${name} to your order`,
  };

  // Replace in headline
  if (copy.headline) {
    for (const [phrase, replacement] of Object.entries(replacements)) {
      copy.headline = copy.headline.replace(new RegExp(phrase, 'gi'), replacement);
    }
  }

  // Replace in sections
  if (copy.sections) {
    copy.sections.forEach((s: any) => {
      if (s.content) {
        for (const [phrase, replacement] of Object.entries(replacements)) {
          s.content = s.content.replace(new RegExp(phrase, 'gi'), replacement);
        }
      }
      if (s.title) {
        for (const [phrase, replacement] of Object.entries(replacements)) {
          s.title = s.title.replace(new RegExp(phrase, 'gi'), replacement);
        }
      }
    });
  }

  // Replace in CTA
  if (copy.cta) {
    for (const [phrase, replacement] of Object.entries(replacements)) {
      copy.cta = copy.cta.replace(new RegExp(phrase, 'gi'), replacement);
    }
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Generic filler → replace with offer brief data
// ───────────────────────────────────────────────────────────────
function fixGenericFiller(copy: any, ctx: FunnelContext): any {
  const name = ctx.productName || 'this product';
  const audience = ctx.audience || 'professionals';
  const problem = ctx.problem || 'their biggest challenge';

  const fillerReplacements: Record<string, string> = {
    'lorem ipsum': `${name} helps ${audience} solve ${problem}.`,
    'insert your': name,
    'placeholder': name,
    'example text': `Built for ${audience} who need results.`,
    'add your': name,
    '[your ': name,
    '{your ': name,
    'click here to': `Get ${name} to`,
    'your product name': name,
    'your audience': audience,
  };

  const replaceIn = (text: string): string => {
    let result = text;
    for (const [filler, replacement] of Object.entries(fillerReplacements)) {
      result = result.replace(new RegExp(filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replacement);
    }
    return result;
  };

  if (copy.headline) copy.headline = replaceIn(copy.headline);
  if (copy.cta) copy.cta = replaceIn(copy.cta);
  if (copy.button) copy.button = replaceIn(copy.button);
  if (copy.body) copy.body = replaceIn(copy.body);
  if (copy.sections) {
    copy.sections.forEach((s: any) => {
      if (s.title) s.title = replaceIn(s.title);
      if (s.content) s.content = replaceIn(s.content);
    });
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Fake proof → remove statistical claims
// ───────────────────────────────────────────────────────────────
function fixFakeProof(copy: any): any {
  const removeProof = (text: string): string => {
    let result = text;
    for (const pattern of FAKE_PROOF_PATTERNS) {
      result = result.replace(pattern, '');
    }
    // Clean up empty lines
    result = result.replace(/\n{3,}/g, '\n\n').trim();
    return result;
  };

  if (copy.headline) copy.headline = removeProof(copy.headline);
  if (copy.body) copy.body = removeProof(copy.body);
  if (copy.sections) {
    copy.sections.forEach((s: any) => {
      if (s.content) s.content = removeProof(s.content);
    });
    // Remove empty sections
    copy.sections = copy.sections.filter((s: any) => s.content && s.content.trim().length > 0);
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Weak CTA → replace with step-specific strong CTA
// ───────────────────────────────────────────────────────────────
function fixWeakCta(copy: any, ctx: FunnelContext, stepType: string): any {
  const name = ctx.productName || 'Your Product';
  const price = ctx.price || '';

  const ctaMap: Record<string, string> = {
    'Sales Page': price ? `Get ${name} — ${price}` : `Get ${name} Now`,
    'Landing Page': `Download ${name} Free`,
    'Checkout': price ? `Complete Purchase — ${price}` : `Complete Your Order`,
    'Order Bump': `Yes! Add This to My Order`,
    'Upsell': price ? `Upgrade Now — ${price}` : `Upgrade My Order`,
    'Downsell': price ? `Get the Lite Version — ${price}` : `Get the Lite Version`,
    'Thank You Page': `Access ${name} Now`,
    'Webinar Page': `Save My Seat`,
  };

  const newCta = ctaMap[stepType] || `Get ${name} Now`;

  if (copy.cta) copy.cta = newCta;
  if (copy.button) copy.button = newCta;

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Broken variable → clean and regenerate sentence
// ───────────────────────────────────────────────────────────────
function fixBrokenVariable(copy: any, ctx: FunnelContext): any {
  const name = ctx.productName || 'Your Product';
  const audience = ctx.audience || 'professionals';

  const cleanVar = (text: string): string => {
    return text
      .replace(/\$\{[^}]*\}/g, name)
      .replace(/undefined/g, name)
      .replace(/null/g, '')
      .replace(/NaN/g, '')
      .replace(/\[object[^\]]*\]/g, name)
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  if (copy.headline) copy.headline = cleanVar(copy.headline);
  if (copy.cta) copy.cta = cleanVar(copy.cta);
  if (copy.button) copy.button = cleanVar(copy.button);
  if (copy.body) copy.body = cleanVar(copy.body);
  if (copy.sections) {
    copy.sections.forEach((s: any) => {
      if (s.title) s.title = cleanVar(s.title);
      if (s.content) s.content = cleanVar(s.content);
    });
  }

  return copy;
}

// ───────────────────────────────────────────────────────────────
// Fix: Missing section → generate and append
// ───────────────────────────────────────────────────────────────
function fixMissingSection(copy: any, ctx: FunnelContext, stepType: string, message: string): any {
  const name = ctx.productName || 'Your Product';
  const audience = ctx.audience || 'professionals';
  const problem = ctx.problem || 'their biggest challenge';
  const price = ctx.price || '$29';

  // Parse which section is missing from message like "Missing section: guarantee"
  const sectionMatch = message.match(/Missing section: (.+)/);
  const missingSections = sectionMatch ? sectionMatch[1].split(' or ').map(s => s.trim()) : [];

  if (!copy.sections) copy.sections = [];

  for (const section of missingSections) {
    switch (section) {
      case 'headline':
        if (!copy.headline || copy.headline.length < 5) {
          copy.headline = `Get ${name} — The Fastest Way to Solve ${problem}`;
        }
        break;
      case 'cta':
        if (!copy.cta && !copy.button) {
          copy.cta = `Get ${name} Now`;
        }
        break;
      case 'guarantee':
        copy.sections.push({
          title: 'Our Guarantee',
          content: `Try ${name} risk-free. If it doesn't work for you, let us know and we'll make it right. No questions asked.`
        });
        break;
      case 'problem':
      case 'opening_hook':
        copy.sections.splice(0, 0, {
          title: 'The Problem',
          content: `If you're a ${audience} struggling with ${problem}, you already know how frustrating it is.\n\nYou've tried other solutions. They didn't work. Here's why ${name} is different.`
        });
        break;
      case 'benefits':
      case 'whatYouGet':
      case 'bullets':
        copy.sections.push({
          title: "What You Get",
          content: `✓ Complete ${name} system\n✓ Step-by-step implementation guide\n✓ Quick-start checklist\n✓ Lifetime access to all materials\n✓ Future updates included`
        });
        break;
      case 'nextSteps':
      case 'confirmation':
        copy.sections.push({
          title: 'What Happens Next',
          content: `✓ Check your email for instant access\n✓ Log in and start using ${name}\n✓ Follow the quick-start guide\n✓ See results within your first session`
        });
        break;
      case 'emails':
        copy.sections.push({
          title: 'Email Sequence',
          content: `Subject: Your access to ${name} is ready\n\nHey!\n\nYou're in. Here's your access link.\n\nStart with the quick-start guide — most people see their first win within an hour.\n\nTalk soon.`
        });
        break;
    }
  }

  return copy;
}

// ═══════════════════════════════════════════════════════════════
// BULK FIX HELPERS
// ═══════════════════════════════════════════════════════════════

export function fixAllIssuesOfSeverity(
  nodes: any[],
  funnelContext: FunnelContext,
  severity: 'critical' | 'warning',
  analyzeFunc: (node: any, ctx: any) => QualityIssue[]
): Map<string, any> {
  const fixes = new Map<string, any>();

  nodes.forEach(node => {
    const issues = analyzeFunc(node, funnelContext);
    const targetIssues = issues.filter(i => i.severity === severity && i.fixable === 'auto');

    if (targetIssues.length === 0) return;

    // Get current copy
    let copyData: any = null;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`funnel-copy-${node.id}`);
      if (saved) { try { copyData = JSON.parse(saved); } catch { /* ignore */ } }
    }
    if (!copyData) copyData = node.data.copy;

    // Apply all fixes sequentially
    let fixedCopy = copyData;
    for (const issue of targetIssues) {
      fixedCopy = fixIssue(issue, fixedCopy, funnelContext, node.data.type || 'Sales Page');
    }

    if (fixedCopy) {
      fixes.set(node.id, fixedCopy);
    }
  });

  return fixes;
}

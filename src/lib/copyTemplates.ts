export interface FunnelContext {
  funnelName: string;
  productName: string;
  audience: string;
  price: string;
  problem: string;
  goal: string;
  offerType: string;
  desiredOutcome?: string;
  whatsIncluded?: string;
  whyNow?: string;
  trafficSource?: string;
  buyerObjection?: string;
  tone?: string;
  stepTitle?: string;
  headline?: string;
  buttonText?: string;
  notes?: string;
  previewTemplate?: string;
  pageStyle?: string;
}

export interface GeneratedCopy {
  headline: string;
  sections: Array<{ title: string; content: string }>;
  cta?: string;
  button?: string;
}

// --- BLOCKED PHRASES GUARDRAIL ---
const BLOCKED_PHRASES = [
  'low conversions',
  'sell product',
  'generated funnel copy',
  'want to upgrade your order?',
  'your headline here',
  'your content goes here',
  'their main challenge',
  'achieve their desired outcome',
  'your audience',
];

function containsBlockedPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_PHRASES.some(phrase => lower.includes(phrase));
}

function sanitize(text: string): string {
  let result = text;
  BLOCKED_PHRASES.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    result = result.replace(regex, '');
  });
  return result.replace(/\s{2,}/g, ' ').trim();
}

// --- HELPER FUNCTIONS ---

// Short product name (last 2-3 words if long)
function shortProduct(productName: string): string {
  const words = productName.split(' ').filter(w => !['the', 'a', 'an', 'my', 'your'].includes(w.toLowerCase()));
  if (words.length <= 3) return productName;
  return words.slice(-3).join(' ');
}

// Transform problem into benefit verb phrase
// "finding decent meals on the road" → "find decent meals on the road"
function problemToBenefit(problem: string): string {
  let benefit = problem.trim();
  const transforms: [string, string][] = [
    ['finding ', 'find '],
    ['getting ', 'get '],
    ['struggling with ', ''],
    ['not being able to ', ''],
    ['having trouble ', ''],
    ['dealing with ', ''],
    ['trying to figure out ', 'figure out '],
    ['figuring out ', 'figure out '],
    ['making ', 'make '],
    ['choosing ', 'choose '],
    ['deciding ', 'decide '],
    ['managing ', 'manage '],
    ['handling ', 'handle '],
    ['keeping up with ', 'keep up with '],
    ['staying on top of ', 'stay on top of '],
  ];
  for (const [prefix, replacement] of transforms) {
    if (benefit.toLowerCase().startsWith(prefix)) {
      benefit = replacement + benefit.slice(prefix.length);
      break;
    }
  }
  return benefit;
}

// Extract the core pain (before "without" clauses)
function corePain(problem: string): string {
  if (problem.includes(' without ')) {
    return problem.split(' without ')[0].trim();
  }
  return problem;
}

// Capitalize first letter
function cap(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Singular form of audience
function singularAudience(audience: string): string {
  if (audience.endsWith('ers')) return audience.slice(0, -1);
  if (audience.endsWith('ors')) return audience.slice(0, -1);
  if (audience.endsWith('ists')) return audience.slice(0, -1);
  if (audience.endsWith('s') && !audience.endsWith('ss') && !audience.endsWith('us')) return audience.slice(0, -1);
  return audience;
}

// Determine if we have real context (not defaults)
function hasRealContext(context: FunnelContext): boolean {
  return !!(
    context.productName &&
    context.productName !== 'Your Product' &&
    context.audience &&
    context.audience !== 'your audience' &&
    context.problem &&
    !BLOCKED_PHRASES.includes(context.problem.toLowerCase())
  );
}

// --- MAIN COPY GENERATION ---

export function generateCopy(stepType: string, context: FunnelContext): GeneratedCopy {
  const {
    productName = 'Your Product',
    audience = 'your customers',
    price = '$29',
    problem = 'the core challenge',
    goal = 'achieve better results',
    previewTemplate,
    desiredOutcome = '',
    whatsIncluded = '',
    whyNow = '',
    trafficSource = '',
    buyerObjection = '',
    tone = 'Practical and direct',
  } = context;

  // If context is still defaults/garbage, produce a clean "fill in your offer" message
  if (!hasRealContext(context)) {
    return {
      headline: `Set up your Offer Brief to generate copy`,
      sections: [{
        title: 'Generated Funnel Copy',
        content: `Open Settings and fill in your product name, audience, price, problem, and desired outcome.\n\nThe copy engine uses your Offer Brief to generate page-specific copy for every step in your funnel.\n\nNo generic filler. No placeholder text. Real copy based on your actual offer.`
      }]
    };
  }

  const benefit = problemToBenefit(problem);
  const pain = corePain(problem);
  const short = shortProduct(productName);
  const singular = singularAudience(audience);

  let headline = '';
  let bodyContent = '';

  switch (stepType) {
    // ================================================================
    // LANDING PAGE / OPT-IN PAGE
    // ================================================================
    case 'Landing Page':
    case 'Opt-in Page': {
      if (previewTemplate === 'video_opt_in') {
        headline = `Watch: How ${cap(audience)} Are Making Better Decisions About ${pain}`;
        bodyContent = [
          `Video Promise: In this short video, discover the exact approach ${audience} are using to ${benefit} — faster and easier than you thought possible.`,
          ``,
          `What You'll Learn:`,
          `• Why most ${audience} struggle with ${pain} (it's not what you think)`,
          `• The simple system that eliminates the guesswork`,
          `• Real examples from ${audience} who made the switch`,
          ``,
          `CTA: Watch the Free Video`,
        ].join('\n');
      } else if (previewTemplate === 'lead_magnet') {
        headline = `Free Download: The ${short} Quick-Start Guide`;
        bodyContent = [
          `Resource: Everything ${audience} need to ${benefit} — organized into one simple, actionable guide.`,
          ``,
          `What's Inside:`,
          `• The complete system for ${benefit}`,
          `• Ready-to-use shortcuts you can apply today`,
          `• The #1 mistake ${audience} make (and how to avoid it)`,
          `• Quick-reference you can save to your phone`,
          ``,
          `CTA: Download the Free Guide`,
        ].join('\n');
      } else if (previewTemplate === 'checklist_opt_in') {
        headline = `The 5-Step Checklist: How to ${cap(benefit)}`;
        bodyContent = [
          `For ${audience} who want a clear, actionable path:`,
          ``,
          `☐ Step 1: Identify your biggest obstacle right now`,
          `☐ Step 2: Apply the core framework (takes 5 minutes)`,
          `☐ Step 3: Use the shortcut system to save time daily`,
          `☐ Step 4: Track your progress with the simple scorecard`,
          `☐ Step 5: Lock in the results so they stick`,
          ``,
          `CTA: Get the Full Checklist Free`,
        ].join('\n');
      } else if (previewTemplate === 'split_layout') {
        headline = `A Simpler Way to ${cap(benefit)}`;
        bodyContent = [
          `For ${audience} who are tired of overcomplicating things.`,
          ``,
          `Benefits:`,
          `• Works in under 2 minutes`,
          `• No technical skills or setup needed`,
          `• Proven by 1,000+ ${audience}`,
          ``,
          `CTA: Get Started Free`,
        ].join('\n');
      } else {
        // hero_cta (default)
        const outcomeText = desiredOutcome || `${benefit} without the guesswork`;
        headline = `${cap(outcomeText.split('.')[0].split(',')[0])}`;
        bodyContent = [
          `Subheadline: A free guide for ${audience} who want to ${outcomeText.toLowerCase().split('.')[0]}.`,
          ``,
          `Benefits:`,
          `• Know exactly what to do instead of wasting time guessing`,
          `• Save time with pre-filtered, simple options`,
          `• Works immediately — no learning curve, no setup`,
          `• Simple enough to use even when you are busy or tired`,
          `• Built specifically for ${audience}`,
          ``,
          `CTA: Get the Free Guide Now`,
          ``,
          `Trust: Free. No spam. Built for ${audience}.`,
        ].join('\n');
      }
      break;
    }

    // ================================================================
    // SALES PAGE
    // ================================================================
    case 'Sales Page': {
      if (previewTemplate === 'short_offer') {
        headline = `${cap(benefit)} in Less Time`;
        bodyContent = [
          `${productName} helps ${audience} make faster, smarter decisions about ${pain}.`,
          ``,
          `Key Benefits:`,
          `• ${cap(benefit)} without the guesswork`,
          `• Built specifically for ${audience}`,
          `• Works immediately — no learning curve`,
          ``,
          `Price: Just ${price}`,
          ``,
          `CTA: Get ${productName} Now`,
          ``,
          `Guarantee: 30-day money-back guarantee. Try it risk-free.`,
        ].join('\n');
      } else if (previewTemplate === 'problem_solution') {
        headline = `Tired of ${pain}? There's a Better Way.`;
        bodyContent = [
          `THE PROBLEM:`,
          `Most solutions are not made for ${audience}. They assume you have unlimited time, endless options, and a perfect situation. That is not reality.`,
          ``,
          `THE SOLUTION:`,
          `${productName} is built exactly for ${audience} who want to ${benefit} — without the complexity, without the guesswork, without settling.`,
          ``,
          `CTA: Get the Solution — ${price}`,
        ].join('\n');
      } else if (previewTemplate === 'proof_first') {
        headline = `"${productName} made it simple to ${benefit}."`;
        bodyContent = [
          `★★★★★`,
          `"I was struggling with ${pain}, but ${productName} changed everything. I wish I'd found this sooner."`,
          `— A verified ${singular} user`,
          ``,
          `Join hundreds of ${audience} who made the switch.`,
          ``,
          `CTA: Join Them — ${price}`,
        ].join('\n');
      } else if (previewTemplate === 'stacked_offer') {
        const outcomeText = desiredOutcome || benefit;
        const includedItems = whatsIncluded
          ? whatsIncluded.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 2)
          : [`${productName} — Core System`, `Quick-Start Guide`, `Bonus Shortcuts`, `Priority Support`, `Lifetime Updates`];
        const basePrice = parseInt(price.replace(/[^0-9]/g, '')) || 29;

        headline = `Everything You Need to ${cap(outcomeText.split('.')[0].split(',')[0])}`;
        bodyContent = [
          `What's Included:`,
          ...includedItems.map((item, i) => `✓ ${item.replace(/^[•\-✓]\s*/, '')} (Value: $${Math.round((basePrice * (2 + i * 0.5)))})`),
          ``,
          `Total Value: $${includedItems.length * basePrice * 2}+`,
          `Your Price Today: ${price}`,
          ``,
          `CTA: Get Everything for ${price}`,
        ].join('\n');
      } else {
        // classic_long_form (default)
        const outcomeText = desiredOutcome || `${benefit} faster and easier`;
        const urgencyText = whyNow || `You are tired of dealing with ${pain} and want a solution that works now.`;
        const objectionText = buyerObjection || `They think it might not work for their specific situation.`;
        
        // Parse what's included into bullet items
        const includedItems = whatsIncluded
          ? whatsIncluded.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 2)
          : [`${productName} — the complete system`, `Decision shortcuts for common situations`, `Simple recommendations`, `Quick-reference guides`, `Lifetime updates`];

        headline = `${cap(outcomeText.split('.')[0].split(',')[0])}`;
        bodyContent = [
          `Opening hook:`,
          urgencyText,
          ``,
          `${productName} was built to solve this.`,
          ``,
          `Problem:`,
          `${cap(problem)}. Most solutions are not made for ${audience}. They assume you have unlimited time, perfect conditions, and endless options. That is not your reality.`,
          ``,
          `Promise:`,
          `${productName} helps you ${outcomeText}. No complexity. No guesswork. Just a clear path from where you are to where you want to be.`,
          ``,
          `What You Get:`,
          ...includedItems.map(item => `• ${item.replace(/^[•\-✓]\s*/, '')}`),
          ``,
          `Benefits:`,
          `• ${cap(outcomeText)} without overthinking it`,
          `• Save time by skipping the guesswork`,
          `• Works immediately — no learning curve or setup`,
          `• Built specifically for ${audience}`,
          `• Simple enough to use even when you are busy or tired`,
          `• One-time purchase — no subscriptions`,
          ``,
          `Who It's For:`,
          `• ${cap(audience)} dealing with ${pain}`,
          `• Anyone who wants a simple, practical solution`,
          `• Anyone tired of wasting time on the wrong approach`,
          `• Anyone who wants clear guidance instead of trial and error`,
          ``,
          `Who It's NOT For:`,
          `• People who need one-on-one professional consulting`,
          `• People looking for a fully custom enterprise solution`,
          `• Anyone not willing to try a simpler approach`,
          ``,
          `Guarantee:`,
          `Try it for 30 days. If ${productName} does not help you ${outcomeText.toLowerCase().split('.')[0]}, ask for a full refund. No hassle, no questions.`,
          ``,
          `CTA: Get ${productName} — ${price}`,
          ``,
          `FAQ:`,
          `Q: Who is this for?`,
          `A: ${cap(audience)} who want to ${outcomeText.toLowerCase().split('.')[0]}.`,
          ``,
          `Q: ${objectionText.replace(/^they /i, 'I ').replace(/\.$/, '?')}`,
          `A: ${productName} is built for real situations. The 30-day guarantee means you can try it and see if it fits your needs.`,
          ``,
          `Q: How quickly will I see results?`,
          `A: Most people get value from ${productName} the first time they use it. Start simple and build from there.`,
          ``,
          `Q: Is this a subscription?`,
          `A: No. One payment of ${price} gets you full access. No recurring charges.`,
        ].join('\n');
      }
      break;
    }

    // ================================================================
    // CHECKOUT
    // ================================================================
    case 'Checkout': {
      const outcomeText = desiredOutcome || benefit;
      const includedItems = whatsIncluded
        ? whatsIncluded.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 2).slice(0, 5)
        : [`Full access to ${productName}`, `All guides and shortcuts`, `Future updates included`, `No monthly subscription`];

      headline = `Get ${productName} Today`;
      if (previewTemplate === 'trust_checkout') {
        bodyContent = [
          `Order Summary:`,
          `${productName}`,
          `${price} one-time payment`,
          ``,
          `What's Included:`,
          ...includedItems.map(item => `• ${item.replace(/^[•\-✓]\s*/, '')}`),
          ``,
          `Trust: 🔒 Secure checkout. One-time payment. No subscription.`,
          ``,
          `Guarantee: Try ${productName} for 30 days. If it does not help you ${outcomeText.toLowerCase().split('.')[0]}, request a full refund.`,
          ``,
          `CTA: Complete My Purchase for ${price}`,
        ].join('\n');
      } else if (previewTemplate === 'two_column') {
        bodyContent = [
          `Product Summary:`,
          `${productName} helps ${audience} ${outcomeText.toLowerCase().split('.')[0]} — instantly after purchase.`,
          ``,
          `What's Included:`,
          ...includedItems.map(item => `• ${item.replace(/^[•\-✓]\s*/, '')}`),
          ``,
          `Payment:`,
          `Enter your details below for instant access.`,
          ``,
          `CTA: Pay ${price} — Get Instant Access`,
        ].join('\n');
      } else {
        // simple_checkout (default)
        bodyContent = [
          `Order Summary:`,
          `${productName}`,
          `${price} one-time payment`,
          ``,
          `What's Included:`,
          ...includedItems.map(item => `• ${item.replace(/^[•\-✓]\s*/, '')}`),
          ``,
          `Trust: Secure checkout. One-time payment. No subscription.`,
          ``,
          `Guarantee: Try ${productName} for 30 days. If it does not help you ${outcomeText.toLowerCase().split('.')[0]}, request a full refund.`,
          ``,
          `CTA: Complete My Purchase for ${price}`,
        ].join('\n');
      }
      break;
    }

    // ================================================================
    // ORDER BUMP
    // ================================================================
    case 'Order Bump': {
      const basePrice = parseInt(price.replace(/[^0-9]/g, '')) || 29;
      const bumpPrice = basePrice > 20 ? '$7' : '$4';
      const bumpName = context.stepTitle && context.stepTitle !== 'Order Bump' ? context.stepTitle : 'Fast Track Add-On';

      if (previewTemplate === 'bonus_box') {
        headline = `🎁 Special Bonus: Add the ${bumpName}`;
        bodyContent = [
          `Get an extra edge with this limited add-on — designed specifically for ${audience} who want faster results.`,
          ``,
          `What's Included:`,
          `• Quick-reference cheat sheet`,
          `• Advanced shortcuts and tips`,
          `• Printable format — works offline`,
          ``,
          `Normally $${parseInt(bumpPrice.replace('$', '')) * 3} on its own.`,
          `Yours today for just ${bumpPrice} when you add it now.`,
          ``,
          `☑️ Yes, add the ${bumpName} to my order for ${bumpPrice}`,
        ].join('\n');
      } else if (previewTemplate === 'cheat_sheet') {
        headline = `Add the Printable Cheat Sheet — ${bumpPrice}`;
        bodyContent = [
          `Get a one-page printable cheat sheet with the top shortcuts for ${benefit}.`,
          ``,
          `• Fits on one page — print it, save it, reference it anytime`,
          `• The best options at a glance`,
          `• Works offline — no phone needed`,
          ``,
          `☑️ Yes, add the Cheat Sheet to my order for ${bumpPrice}`,
        ].join('\n');
      } else {
        // checkbox_bump (default)
        headline = `Yes, add the ${bumpName} to my order for ${bumpPrice}`;
        bodyContent = [
          `Get a simple cheat sheet you can use when you do not have time to think through your options.`,
          ``,
          `What's Included:`,
          `• Quick "better choice" lists for common situations`,
          `• Simple swaps and shortcuts`,
          `• Fast rules for making decisions when you are tired or rushed`,
          ``,
          `A small add-on built to save you time immediately.`,
          ``,
          `Price: ${bumpPrice}`,
        ].join('\n');
      }
      break;
    }

    // ================================================================
    // UPSELL
    // ================================================================
    case 'Upsell': {
      const upsellName = context.stepTitle && context.stepTitle !== 'Upsell' ? context.stepTitle : `${short} Pro`;
      const outcomeText = desiredOutcome || `${benefit} faster and more consistently`;

      headline = `Want the Complete System Too?`;
      bodyContent = [
        `Subheadline: Upgrade to ${upsellName} and get the full system for ${audience} who want to ${outcomeText.toLowerCase().split('.')[0]}.`,
        ``,
        `Why Now:`,
        `You already have ${productName}. The upgrade gives you a more complete system so you can ${outcomeText.toLowerCase().split('.')[0]} — consistently, not just once.`,
        ``,
        `What's Included:`,
        `• Advanced templates and frameworks`,
        `• Complete planning system`,
        `• Quick-reference printable guides`,
        `• Priority support`,
        `• All future updates included`,
        ``,
        `Benefits:`,
        `• Go from one-time use to a repeatable system`,
        `• Save more time with advanced shortcuts`,
        `• Get better results, more consistently`,
        `• Built to grow with you as your needs change`,
        ``,
        `CTA: Yes, Add ${upsellName}`,
        ``,
        `No-thanks: No thanks, I only want the basic ${productName}.`,
      ].join('\n');
      break;
    }

    // ================================================================
    // DOWNSELL
    // ================================================================
    case 'Downsell': {
      const downsellName = context.stepTitle && context.stepTitle !== 'Downsell' ? context.stepTitle : `Quick-Start Guide`;

      headline = `Not Ready for Pro? Start With the ${downsellName}`;
      bodyContent = [
        `Subheadline: Get the simpler version with the most useful shortcuts — without the full planning system.`,
        ``,
        `What Changed:`,
        `This does not include the full Pro planning system. It gives you the quick-reference guide only.`,
        ``,
        `What's Included:`,
        `• Simple shortcuts for ${benefit}`,
        `• Better-choice quick lists`,
        `• One-page reference checklist`,
        `• Quick-start instructions`,
        ``,
        `Benefits:`,
        `• Use it right away`,
        `• Make faster decisions without studying a full plan`,
        `• Keep it on your phone for easy access`,
        `• Start small and upgrade later if you want the full system`,
        ``,
        `CTA: Yes, Add the ${downsellName}`,
        ``,
        `No-thanks: No thanks, continue to my order.`,
      ].join('\n');
      break;
    }

    // ================================================================
    // THANK YOU PAGE
    // ================================================================
    case 'Thank You Page': {
      const outcomeText = desiredOutcome || `${benefit} more easily`;
      headline = `You're In. Here's How to Get Started`;
      bodyContent = [
        `Subheadline: Your ${productName} access is ready.`,
        ``,
        `Confirmation:`,
        `Thanks for grabbing ${productName}. You now have access to everything you need to ${outcomeText.toLowerCase().split('.')[0]}.`,
        ``,
        `Next Steps:`,
        `1. Check your inbox for your access email.`,
        `2. Open ${productName} and save the link somewhere easy to find.`,
        `3. Start with the first thing that applies to your situation.`,
        `4. Keep it simple — you do not need to use everything at once.`,
        ``,
        `Support:`,
        `If you do not see your access email within a few minutes, check your spam folder or reply to this email for help.`,
        ``,
        `CTA: Open ${productName}`,
      ].join('\n');
      break;
    }

    // ================================================================
    // EMAIL FOLLOW-UP
    // ================================================================
    case 'Email Follow-up': {
      const outcomeText = desiredOutcome || `${benefit} more easily`;
      const urgencyText = whyNow || `You wanted to stop wasting time on ${pain}.`;
      headline = `${productName} — Follow-Up Sequence`;
      bodyContent = [
        `Email 1 — Welcome (Day 0)`,
        `Subject: You're in — here's your ${productName} access`,
        `Body: Thanks for grabbing ${productName}. Your access is ready. Start simple: pick one thing from ${productName} and apply it the next time you need to ${outcomeText.toLowerCase().split('.')[0]}. You do not need to use everything at once.`,
        `CTA: Open ${productName}`,
        ``,
        `Email 2 — Quick Win (Day 2)`,
        `Subject: Try this first`,
        `Body: Here is the fastest way to get value from ${productName}: instead of starting from scratch, open the first section and follow the simple steps. Most ${audience} see results within the first use. No complicated setup, no learning curve.`,
        `CTA: Use ${productName} Now`,
        ``,
        `Email 3 — Common Mistake (Day 4)`,
        `Subject: The mistake most ${audience} make`,
        `Body: The biggest mistake? Overthinking it. ${urgencyText} ${productName} is built to give you a clear answer quickly — not to add more decisions to your day. Open it, follow the guidance, move on.`,
        `CTA: Keep It Simple`,
        ``,
        `Email 4 — Make It a Habit (Day 6)`,
        `Subject: How to make this stick`,
        `Body: The difference between people who ${outcomeText.toLowerCase().split('.')[0]} and those who don't? A simple repeatable system. ${productName} gives you that system. Use it once, then use it again. That is how you build momentum without adding complexity.`,
        `CTA: Build Your Routine`,
        ``,
        `Email 5 — Upgrade Reminder (Day 8)`,
        `Subject: Want the complete system too?`,
        `Body: If ${productName} is helping, the next step is to plan ahead a little. The Pro version gives you a weekly system, quick-reference guides, and planning templates so you are not making every decision from scratch.`,
        `CTA: See ${short} Pro`,
      ].join('\n');
      break;
    }

    // ================================================================
    // WEBINAR
    // ================================================================
    case 'Webinar': {
      headline = `Free Training: How ${cap(audience)} Can ${cap(benefit)} Without the Guesswork`;
      bodyContent = [
        `Promise: In 45 minutes, you'll learn exactly how to ${benefit} — no complexity, no overwhelm, no prior experience needed.`,
        ``,
        `What You'll Learn:`,
        `• The 3 biggest mistakes ${audience} make (and how to avoid them)`,
        `• The simple system that eliminates guesswork`,
        `• Real examples from ${audience} who solved this`,
        `• Live Q&A — get your specific questions answered`,
        ``,
        `CTA: Reserve Your Free Spot`,
      ].join('\n');
      break;
    }

    // ================================================================
    // SURVEY
    // ================================================================
    case 'Survey': {
      headline = `Quick Survey: Help Us Build Better Tools for ${cap(audience)}`;
      bodyContent = [
        `Intro: We're building something to help ${audience} ${benefit}. Your answers (2 minutes) will shape exactly how it works.`,
        ``,
        `Questions:`,
        `1. How often do you deal with "${pain}"?`,
        `2. What's your biggest frustration with current solutions?`,
        `3. What would make a tool worth paying for?`,
        `4. How much time do you currently spend on this?`,
        ``,
        `CTA: Submit & Get Early Access`,
      ].join('\n');
      break;
    }

    // ================================================================
    // APPLICATION PAGE
    // ================================================================
    case 'Application Page': {
      headline = `Apply for the ${short} Accelerator Program`;
      bodyContent = [
        `Qualification: This program is for ${audience} who are serious about ${benefit} — faster and with guided support.`,
        ``,
        `Questions:`,
        `1. What is your name?`,
        `2. How long have you been dealing with "${pain}"?`,
        `3. What is your biggest challenge right now?`,
        `4. What would success look like for you in 90 days?`,
        `5. Are you ready to invest in solving this?`,
        ``,
        `CTA: Submit My Application`,
        ``,
        `Confirmation: Applications reviewed within 48 hours. If you're a fit, we'll send a booking link.`,
      ].join('\n');
      break;
    }

    // ================================================================
    // BOOKING PAGE
    // ================================================================
    case 'Booking Page': {
      headline = `Book Your Free 15-Minute Strategy Call`;
      bodyContent = [
        `Promise: In 15 minutes, we'll map out a simple plan to help you ${benefit} — based on YOUR specific situation. No sales pitch unless you ask.`,
        ``,
        `Who Should Book:`,
        `• ${cap(audience)} dealing with "${pain}" regularly`,
        `• Anyone who wants a clear plan instead of guessing`,
        `• People ready to take action (not just browse)`,
        ``,
        `Preparation: Before your call, think about your biggest challenge and what success looks like for you.`,
        ``,
        `CTA: Book My Free Strategy Call`,
      ].join('\n');
      break;
    }

    // ================================================================
    // DEFAULT FALLBACK
    // ================================================================
    default: {
      headline = `${cap(benefit)} — The Simple Way`;
      bodyContent = [
        `${productName} helps ${audience} ${benefit} — quickly and without the guesswork.`,
        ``,
        `Built for ${audience} who want a simple, practical solution.`,
        ``,
        `CTA: Learn More`,
      ].join('\n');
      break;
    }
  }

  // --- GUARDRAIL: Check for blocked phrases ---
  if (containsBlockedPhrase(headline) || containsBlockedPhrase(bodyContent)) {
    headline = sanitize(headline);
    bodyContent = sanitize(bodyContent);
  }

  return {
    headline,
    sections: [
      { title: 'Generated Funnel Copy', content: bodyContent }
    ]
  };
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT-AWARE COPY GENERATION
// Generates copy per-block based on the Template Builder layout
// ═══════════════════════════════════════════════════════════════

export interface LayoutBlock {
  instanceId: string;
  blockType: string;
  content: any;
}

export function generateCopyFromLayout(stepType: string, context: FunnelContext, layout: LayoutBlock[]): GeneratedCopy {
  const {
    productName = 'Your Product',
    audience = 'your customers',
    price = '$29',
    problem = 'the core challenge',
    goal = 'achieve better results',
    desiredOutcome = '',
    whatsIncluded = '',
    whyNow = '',
    buyerObjection = '',
  } = context;

  if (!hasRealContext(context)) {
    return {
      headline: `Set up your Offer Brief to generate copy`,
      sections: [{ title: 'Fill in Offer Brief', content: 'Open Settings and fill in your product details to generate real copy.' }]
    };
  }

  const benefit = problemToBenefit(problem);
  const pain = corePain(problem);
  const short = shortProduct(productName);
  const singular = singularAudience(audience);

  let headline = '';
  const sections: Array<{ title: string; content: string }> = [];
  let cta = '';

  for (const block of layout) {
    switch (block.blockType) {
      case 'hero': {
        headline = `Stop Struggling With ${cap(pain)} — ${productName} Makes It Easy`;
        if (stepType === 'Upsell') headline = `Wait — Upgrade to ${productName} Pro`;
        if (stepType === 'Downsell') headline = `Here's a Lighter Option — ${short} Essentials`;
        if (stepType === 'Thank You Page') headline = `You're In! Here's What Happens Next`;
        if (stepType === 'Landing Page') headline = `The Free Guide That Shows ${cap(audience)} How to ${cap(benefit)}`;
        sections.push({
          title: 'Hero',
          content: `${headline}\n\nFinally — a straightforward way for ${audience} to ${benefit}. No fluff, no theory, just the exact steps that work.`
        });
        break;
      }
      case 'problem': {
        sections.push({
          title: 'The Problem',
          content: `If you're a ${singular} dealing with ${problem}, you already know how exhausting it is.\n\n• You've tried the "usual advice" — it doesn't work for your situation\n• You've wasted hours (or money) on solutions that overpromise\n• You're stuck in the same place you were 6 months ago\n\nIt's not your fault. Most approaches weren't designed for ${audience} like you.`
        });
        break;
      }
      case 'solution': {
        sections.push({
          title: 'The Solution',
          content: `${productName} was built specifically for ${audience} who are tired of ${pain}.\n\nInstead of generic advice, you get a focused system designed to help you ${benefit} — without the overwhelm.\n\nThis is not another course or information dump. It's a practical tool you can use today.`
        });
        break;
      }
      case 'benefits': {
        const outcome = desiredOutcome || benefit;
        sections.push({
          title: 'What You\'ll Get',
          content: `Here's what changes when you use ${short}:\n\n✓ ${cap(outcome)} — without guessing what to do next\n✓ Save hours every week with a proven system\n✓ Clear, step-by-step guidance that actually works\n✓ No technical skills required — built for ${audience}\n✓ Results you can see within your first week`
        });
        break;
      }
      case 'features': {
        const included = whatsIncluded || `Complete ${productName} system, Quick-start guide, Implementation checklist, Lifetime access`;
        const items = included.split(',').map(i => i.trim()).filter(Boolean);
        sections.push({
          title: 'What\'s Inside',
          content: `Everything you need, nothing you don't:\n\n${items.map(i => `📦 ${i}`).join('\n')}\n\nTotal value: Far more than ${price}. Your investment today: just ${price}.`
        });
        break;
      }
      case 'social_proof': {
        sections.push({
          title: 'What Others Are Saying',
          content: `"I was skeptical, but ${short} actually delivered. Within a week I was already seeing progress."\n— Verified ${singular}\n\n"I've tried other solutions for ${pain}. This is the first one that made sense for someone like me."\n— ${cap(audience)} member`
        });
        break;
      }
      case 'guarantee': {
        sections.push({
          title: 'Our Guarantee',
          content: `Try ${productName} risk-free.\n\nIf it doesn't help you ${benefit} within 30 days, just let us know. Full refund, no questions asked, no hard feelings.\n\nWe're confident this works because it was built specifically for ${audience} facing exactly this problem.`
        });
        break;
      }
      case 'pricing': {
        const urgency = whyNow || 'This introductory price won\'t last';
        sections.push({
          title: 'Your Investment',
          content: `Get everything above for just ${price}.\n\n${urgency}.\n\nOne-time payment. Lifetime access. No subscription, no hidden fees.\n\nYou're not just buying a product — you're buying back your time and sanity.`
        });
        break;
      }
      case 'faq': {
        const objection = buyerObjection || `whether this is right for ${audience}`;
        sections.push({
          title: 'Frequently Asked Questions',
          content: `**Is this right for me?**\nIf you're a ${singular} struggling with ${pain}, this was built for you.\n\n**How quickly will I see results?**\nMost people see their first win within the first week.\n\n**What if I have questions about ${objection}?**\nWe've got you covered. Reach out anytime and we'll help.\n\n**What if it doesn't work for me?**\n30-day money-back guarantee. Zero risk.`
        });
        break;
      }
      case 'cta_final': {
        cta = `Get ${short} — ${price}`;
        sections.push({
          title: 'Ready?',
          content: `You've read this far — that tells me you're serious about solving ${pain}.\n\nThe question isn't whether ${productName} works. It's whether you're ready to stop putting it off.\n\nCTA: ${cta}\n\n30-day guarantee. Instant access. Built for ${audience}.`
        });
        break;
      }
      case 'urgency': {
        const reason = whyNow || 'this offer is only available for a limited time';
        sections.push({
          title: 'Why Now',
          content: `Fair warning: ${reason}.\n\nEvery day you wait is another day stuck with ${pain}. ${productName} is ready for you right now.`
        });
        break;
      }
      case 'bonuses': {
        sections.push({
          title: 'Free Bonuses',
          content: `Order today and you'll also get:\n\n🎁 Bonus #1: Quick-Start Implementation Guide (get results Day 1)\n🎁 Bonus #2: ${productName} Cheat Sheet (one-page reference)\n🎁 Bonus #3: Priority support for your first 30 days\n\nThese bonuses are included free with your purchase today.`
        });
        break;
      }
      case 'comparison': {
        sections.push({
          title: 'Why This Is Different',
          content: `**Without ${short}:**\n• Still guessing what to do next\n• Wasting time on approaches that don't work\n• Frustrated and stuck\n\n**With ${short}:**\n• Clear roadmap from day one\n• Proven system built for ${audience}\n• Visible progress within a week`
        });
        break;
      }
      case 'about': {
        sections.push({
          title: 'Why We Built This',
          content: `We built ${productName} because we were tired of seeing ${audience} struggle with ${pain} — and getting nothing but generic advice in return.\n\nThis isn't theory. It's the exact system that works, distilled into something you can use immediately.`
        });
        break;
      }
      case 'objection_handler': {
        const objection2 = buyerObjection || 'whether this will work for you';
        sections.push({
          title: 'Let\'s Address Your Concern',
          content: `You might be wondering ${objection2}.\n\nHere's the truth: ${productName} was designed for ${audience} who are exactly where you are right now.\n\nIf you've tried other things and they didn't work, it wasn't because you failed — it was because those solutions weren't built for you.\n\nThis one is.`
        });
        break;
      }
      case 'urgency_bar': {
        const reason = whyNow || 'this offer is only available for a limited time';
        sections.push({ title: 'Urgency', content: `⏰ ${reason}. Don't miss out — this price won't last.` });
        break;
      }
      case 'how_it_works': {
        sections.push({ title: 'How It Works', content: `Here's how ${productName} works:\n\n1️⃣ Sign up and get instant access\n2️⃣ Follow the step-by-step process built for ${audience}\n3️⃣ See real results within your first week` });
        break;
      }
      case 'what_you_get': {
        const included = whatsIncluded || `Complete ${productName} system, Quick-start templates, Implementation checklist, Lifetime access`;
        const items = included.split(',').map(i => i.trim()).filter(Boolean);
        sections.push({ title: 'Everything You Get', content: `Here's everything included:\n\n${items.map(i => `✅ ${i}`).join('\n')}\n\nTotal value: Far more than ${price}.` });
        break;
      }
      case 'offer_box': {
        sections.push({ title: 'Special Offer', content: `Get ${productName} today for just ${price}.\n\n✅ Full system access\n✅ All bonuses included\n✅ Lifetime updates\n\nCTA: Get Instant Access\n\n30-day money-back guarantee.` });
        break;
      }
      case 'order_summary': {
        sections.push({ title: 'Order Summary', content: `${productName} — ${price}\nBonus Pack — FREE\n\nTotal: ${price}` });
        break;
      }
      case 'checkout_form': {
        sections.push({ title: 'Complete Your Order', content: `Secure your copy of ${productName} now.\n\nYour information is encrypted and secure.\n\nCTA: Complete Purchase — ${price}\n\n🔒 256-bit SSL encryption` });
        break;
      }
      case 'opt_in_form': {
        sections.push({ title: 'Get Your Free Guide', content: `Enter your email and we'll send you the free ${short} guide immediately.\n\nNo spam. Unsubscribe anytime.\n\nCTA: Send Me the Guide` });
        break;
      }
      case 'trust_note': {
        sections.push({ title: 'Trust', content: `🔒 Secure checkout · 30-day money-back guarantee · Trusted by ${audience}` });
        break;
      }
      case 'no_thanks_link': {
        sections.push({ title: 'Decline', content: `No thanks, I don't need this right now. \u2192 Skip This Offer` });
        break;
      }
      case 'next_steps': {
        sections.push({ title: 'What Happens Next', content: `You're in! Here's what to do now:\n\n📧 Step 1: Check your email for login details\n🚀 Step 2: Log in and start the quick-start guide\n🎯 Step 3: Get your first win within 24 hours` });
        break;
      }
      case 'access_button': {
        sections.push({ title: 'Access', content: `CTA: Access Your ${short} Now →\n\nYou'll also receive an email with this link.` });
        break;
      }
      case 'email_cards': {
        sections.push({ title: 'Your Email Sequence', content: `Email 1 — Welcome: Introduce yourself and deliver the lead magnet\nEmail 2 — Quick Win: Give them an actionable tip\nEmail 3 — Story: Share a relevant story that builds trust\nEmail 4 — Social Proof: Show results from other ${audience}\nEmail 5 — The Offer: Present ${productName} with a clear CTA` });
        break;
      }
      case 'timeline': {
        sections.push({ title: 'Your Journey', content: `Day 1 — Get started with the quick-start guide\nDay 3 — Complete your first implementation\nDay 7 — See your first measurable results\nDay 14 — Refine and optimize your approach\nDay 30 — Full system running on autopilot` });
        break;
      }
      default: {
        sections.push({
          title: block.content?.headline || 'Section',
          content: block.content?.body || `Content for ${block.blockType}`
        });
      }
    }
  }

  // Guardrail check
  if (containsBlockedPhrase(headline)) headline = sanitize(headline);
  sections.forEach(s => {
    if (containsBlockedPhrase(s.content)) s.content = sanitize(s.content);
  });

  return { headline: headline || `Get ${productName} Today`, sections, cta };
}

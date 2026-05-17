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
}

export interface GeneratedCopy {
  headline: string;
  sections: Array<{ title: string; content: string }>;
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

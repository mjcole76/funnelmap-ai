export interface FunnelContext {
  funnelName: string;
  productName: string;
  audience: string;
  price: string;
  problem: string;
  goal: string;
  offerType: string;
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
        headline = `${cap(benefit)} — Without the Guesswork`;
        bodyContent = [
          `Subheadline: Get a free guide built for ${audience} who need to ${benefit} without wasting time at every step.`,
          ``,
          `Benefits:`,
          `• Know exactly what to do instead of wasting time guessing`,
          `• Save time with pre-filtered, simple options`,
          `• Works immediately — no learning curve, no setup`,
          `• Simple enough to use even when you're tired or in a rush`,
          `• Updated regularly so it stays useful long-term`,
          ``,
          `CTA: Get the Free Guide Now`,
          ``,
          `Trust: Free guide. No spam. Built for ${audience}.`,
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
        headline = `Everything You Need to ${cap(benefit)}`;
        bodyContent = [
          `What's Included:`,
          `✓ ${productName} — Core System (Value: $49)`,
          `✓ Quick-Start Guide (Value: $19)`,
          `✓ Bonus Shortcuts (Value: $29)`,
          `✓ Priority Support (Value: $19)`,
          `✓ Lifetime Updates (Value: $49)`,
          ``,
          `Total Value: $165`,
          `Your Price Today: ${price}`,
          ``,
          `CTA: Get Everything for ${price}`,
        ].join('\n');
      } else {
        // classic_long_form (default)
        headline = `${cap(benefit)} in Less Time`;
        bodyContent = [
          `Opening hook:`,
          `When you are busy all day, decisions about ${pain} get old fast. You look at your options, pick whatever seems easiest, and move on. Sometimes it works. A lot of times, you wish you had chosen better.`,
          ``,
          `${productName} is built to make that decision easier.`,
          ``,
          `Problem:`,
          `Most tools are not made for ${audience}. They assume you have a normal schedule, plenty of time, and endless choices. That is not your reality. You need answers that fit real conditions: limited options, tight schedules, and solutions that work while you keep moving.`,
          ``,
          `Promise:`,
          `${productName} gives you quick guidance for real situations. Instead of guessing, you can check better choices, avoid common bad picks, and build a simple routine that works around your life.`,
          ``,
          `What You Get:`,
          `• ${productName} — the complete system`,
          `• Decision shortcuts for common situations`,
          `• Simple "better choice" recommendations`,
          `• Quick-reference guides`,
          `• Lifetime early access updates`,
          ``,
          `Benefits:`,
          `• ${cap(benefit)} faster when you are short on time`,
          `• Avoid choices that make things harder later`,
          `• Find better options even with limited choices`,
          `• Use simple recommendations instead of complicated systems`,
          `• Make repeatable decisions you can rely on`,
          `• Get early access for one low lifetime price`,
          ``,
          `Who It's For:`,
          `• ${cap(audience)} who deal with ${pain} often`,
          `• Anyone trying to make better decisions without overcomplicating it`,
          `• Anyone who wants a simple tool, not another complex system`,
          `• Anyone tired of making the same rushed decision every day`,
          ``,
          `Who It's NOT For:`,
          `• People who need a full professional consultation`,
          `• People looking for a complex enterprise solution`,
          `• Anyone expecting a one-size-fits-all miracle`,
          ``,
          `Guarantee:`,
          `Try it for 30 days. If it does not help you ${benefit} more easily, ask for a refund.`,
          ``,
          `CTA: Get Lifetime Early Access for ${price}`,
          ``,
          `FAQ:`,
          `Q: Is this only for ${audience}?`,
          `A: It is built around ${audience}, but anyone with a similar challenge can use it.`,
          ``,
          `Q: Do I need technical skills?`,
          `A: No. The goal is faster, simpler decisions. Anyone can use it.`,
          ``,
          `Q: Will it work for my situation?`,
          `A: It is designed around common situations that ${audience} face regularly.`,
          ``,
          `Q: What does lifetime early access mean?`,
          `A: You get access now at the early price and keep access as the product improves.`,
        ].join('\n');
      }
      break;
    }

    // ================================================================
    // CHECKOUT
    // ================================================================
    case 'Checkout': {
      headline = `Get ${productName} Today`;
      if (previewTemplate === 'trust_checkout') {
        bodyContent = [
          `Order Summary:`,
          `${productName}`,
          `Lifetime Early Access`,
          `${price} one-time payment`,
          ``,
          `What's Included:`,
          `• Full access to ${productName}`,
          `• All current features and guides`,
          `• Early access to future updates`,
          `• No monthly subscription`,
          ``,
          `Trust: 🔒 Secure checkout. One-time payment. No subscription.`,
          ``,
          `Guarantee: Try ${productName} for 30 days. If it does not help you ${benefit}, request a refund.`,
          ``,
          `CTA: Complete My Purchase for ${price}`,
        ].join('\n');
      } else if (previewTemplate === 'two_column') {
        bodyContent = [
          `Product Summary:`,
          `${productName} helps ${audience} ${benefit} — instantly after purchase.`,
          ``,
          `What's Included:`,
          `• Complete ${productName} system`,
          `• Instant access`,
          `• 30-day guarantee`,
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
          `Lifetime Early Access`,
          `${price} one-time payment`,
          ``,
          `What's Included:`,
          `• Full access to ${productName}`,
          `• Decision shortcuts and guides`,
          `• Simple recommendations`,
          `• Early access to future updates`,
          `• No monthly subscription`,
          ``,
          `Trust: Secure checkout. One-time payment. No subscription.`,
          ``,
          `Guarantee: Try ${productName} for 30 days. If it does not help you ${benefit}, request a refund.`,
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

      headline = `Want the Complete System Too?`;
      bodyContent = [
        `Subheadline: Upgrade to ${upsellName} and get a more complete planning system for ${benefit} all week.`,
        ``,
        `Why Now:`,
        `You already have ${productName}. The Pro upgrade gives you a stronger plan so you are not starting from zero every day.`,
        ``,
        `What's Included:`,
        `• Weekly planning templates`,
        `• Advanced frameworks and guides`,
        `• Better-choice lists for common situations`,
        `• Quick-reference printable guide`,
        `• Priority support`,
        ``,
        `Benefits:`,
        `• Plan ahead before the week gets away from you`,
        `• Know what to do when your options are limited`,
        `• Build a repeatable routine that works`,
        `• Make fewer rushed decisions during busy days`,
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
      headline = `You're In. Here's How to Get Started`;
      bodyContent = [
        `Subheadline: Your ${productName} access is ready.`,
        ``,
        `Confirmation:`,
        `Thanks for grabbing ${productName}. You now have access to the system built to help you ${benefit} more easily.`,
        ``,
        `Next Steps:`,
        `1. Check your inbox for your access email.`,
        `2. Open ${productName} and save the link somewhere easy to find.`,
        `3. Use it the next time you need to make a decision.`,
        `4. Start with one better choice. You do not need to overhaul everything at once.`,
        ``,
        `Support:`,
        `If you do not see your access email within a few minutes, check your spam folder or contact support.`,
        ``,
        `CTA: Open ${productName}`,
      ].join('\n');
      break;
    }

    // ================================================================
    // EMAIL FOLLOW-UP
    // ================================================================
    case 'Email Follow-up': {
      headline = `${productName} — Follow-Up Sequence`;
      bodyContent = [
        `Email 1 — Welcome (Day 0)`,
        `Subject: You're in — here's your ${productName} access`,
        `Body: Thanks for grabbing ${productName}. Your access is ready. Start simple — the next time you need to ${benefit}, use it to compare your options and choose one better option than you normally would. You do not need to be perfect. The goal is to make the next decision easier.`,
        `CTA: Open ${productName}`,
        ``,
        `Email 2 — Quick Win (Day 2)`,
        `Subject: Try this next time`,
        `Body: Here is the easiest way to use ${productName} today. Before you make your next decision, ask yourself: "What option will work best for the next few hours?" That one question changes the decision. Instead of choosing whatever is fastest, use ${productName} to look for a better option.`,
        `CTA: Use ${productName} Now`,
        ``,
        `Email 3 — Common Mistake (Day 4)`,
        `Subject: The mistake that makes ${pain} harder`,
        `Body: One of the easiest mistakes is choosing only because it is fast. Fast matters — but if the choice makes things harder later, it costs you more than a few minutes. ${productName} helps you find the better option inside the choices you already have.`,
        `CTA: Find a Better Option`,
        ``,
        `Email 4 — Simple Routine (Day 6)`,
        `Subject: A simple routine you can repeat`,
        `Body: The easiest way to make better decisions is to stop treating every situation like a brand-new problem. Use a simple repeatable routine: identify your best option, avoid the choice that always backfires, and keep a backup ready. ${productName} helps you build that routine without overcomplicating things.`,
        `CTA: Build Your Routine`,
        ``,
        `Email 5 — Upgrade Reminder (Day 8)`,
        `Subject: Want the weekly planning system too?`,
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

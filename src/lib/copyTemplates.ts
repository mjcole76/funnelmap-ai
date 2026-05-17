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

// Helper: create a short product reference (last 2-3 meaningful words)
function shortProduct(productName: string): string {
  const words = productName.split(' ').filter(w => !['the', 'a', 'an', 'my', 'your'].includes(w.toLowerCase()));
  if (words.length <= 3) return productName;
  return words.slice(-3).join(' ');
}

// Helper: create a benefit-oriented transformation of the problem
function problemToBenefit(problem: string): string {
  let benefit = problem.trim();
  if (benefit.startsWith('finding ')) benefit = 'find ' + benefit.slice(8);
  else if (benefit.startsWith('getting ')) benefit = 'get ' + benefit.slice(8);
  else if (benefit.startsWith('struggling with ')) benefit = benefit.slice(16);
  else if (benefit.startsWith('not being able to ')) benefit = benefit.slice(18);
  else if (benefit.startsWith('having trouble ')) benefit = benefit.slice(15);
  else if (benefit.startsWith('dealing with ')) benefit = benefit.slice(13);
  return benefit;
}

// Helper: extract the core pain (before "without" clauses)
function problemToNegative(problem: string): string {
  if (problem.includes(' without ')) {
    return problem.split(' without ')[0].trim();
  }
  return problem;
}

// Helper: capitalize first letter
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Helper: singular form of audience
function singularAudience(audience: string): string {
  if (audience.endsWith('ers')) return audience.slice(0, -1);
  if (audience.endsWith('ors')) return audience.slice(0, -1);
  if (audience.endsWith('s') && !audience.endsWith('ss')) return audience.slice(0, -1);
  return audience;
}

export function generateCopy(stepType: string, context: FunnelContext): GeneratedCopy {
  const {
    productName = 'The Product',
    audience = 'your audience',
    price = '$29',
    problem = 'the main challenge',
    goal = 'achieve their desired outcome',
    previewTemplate
  } = context;

  const benefit = problemToBenefit(problem);
  const pain = problemToNegative(problem);
  const short = shortProduct(productName);
  const singular = singularAudience(audience);

  let headline = '';
  let bodyContent = '';

  switch (stepType) {
    case 'Landing Page':
    case 'Opt-in Page': {
      if (previewTemplate === 'video_opt_in') {
        headline = `Watch: How ${cap(audience)} Are Solving "${pain}" in Under 10 Minutes`;
        bodyContent = [
          `Video Promise: In this short video, discover the exact method ${audience} are using to ${benefit} — faster and easier than you thought possible.`,
          ``,
          `What You'll Learn:`,
          `• Why most ${audience} struggle with ${pain} (it's not what you think)`,
          `• The simple 3-step system that eliminates the guesswork`,
          `• Real results from ${audience} who made the switch`,
          ``,
          `CTA: Watch the Free Video`
        ].join('\n');
      } else if (previewTemplate === 'lead_magnet') {
        headline = `Free Download: The ${short} Quick-Start Guide`;
        bodyContent = [
          `Resource: Everything ${audience} need to ${benefit} — organized into one simple, actionable guide.`,
          ``,
          `What's Inside:`,
          `• The complete system for ${benefit}`,
          `• Ready-to-use templates you can apply today`,
          `• The #1 mistake ${audience} make (and how to avoid it)`,
          `• Quick-reference sheet you can save to your phone`,
          ``,
          `CTA: Download the Free Guide`
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
          `CTA: Get the Full Checklist Free`
        ].join('\n');
      } else if (previewTemplate === 'split_layout') {
        headline = `A Simpler Way to ${cap(benefit)}`;
        bodyContent = [
          `For ${audience} who are tired of overcomplicating things.`,
          ``,
          `Benefits:`,
          `• Works in under 2 minutes`,
          `• No technical skills needed`,
          `• Proven by 1,000+ ${audience}`,
          ``,
          `CTA: Get Started Free`
        ].join('\n');
      } else {
        // hero_cta or default
        headline = `${cap(audience)}: ${cap(benefit)} — Without the Guesswork`;
        bodyContent = [
          `Subheadline: The free guide that shows ${audience} exactly how to ${benefit} — in under 2 minutes.`,
          ``,
          `Benefits:`,
          `• Know exactly what to do instead of wasting time guessing`,
          `• Save 20+ minutes every time with pre-filtered options`,
          `• Works immediately — no learning curve, no setup`,
          `• Simple enough to use even when you're tired or in a rush`,
          `• Updated regularly so it stays useful long-term`,
          ``,
          `CTA: Get the Free Guide Now`,
          ``,
          `Trust: Join 1,200+ ${audience} who already use this. No spam, unsubscribe anytime.`
        ].join('\n');
      }
      break;
    }

    case 'Sales Page': {
      if (previewTemplate === 'short_offer') {
        headline = `${productName}: The Fastest Way to ${cap(benefit)}`;
        bodyContent = [
          `Key Benefits:`,
          `• Solves "${pain}" in under 2 minutes`,
          `• Built specifically for ${audience}`,
          `• Works immediately — no learning curve`,
          ``,
          `Price: ${price}`,
          ``,
          `CTA: Get ${productName} Now`,
          ``,
          `Guarantee: 30-day money-back guarantee. Try it risk-free.`
        ].join('\n');
      } else if (previewTemplate === 'problem_solution') {
        headline = `Tired of ${pain}? There's a Better Way.`;
        bodyContent = [
          `THE PROBLEM:`,
          `You're dealing with "${pain}" and it's costing you time, energy, and results. You've tried figuring it out on your own, but nothing sticks.`,
          ``,
          `THE SOLUTION:`,
          `${productName} is the system built exactly for ${audience} who want to ${benefit} — without the complexity, without the guesswork, without settling.`,
          ``,
          `CTA: Get the Solution — ${price}`
        ].join('\n');
      } else if (previewTemplate === 'proof_first') {
        headline = `"${productName} completely changed how I ${benefit}."`;
        bodyContent = [
          `★★★★★`,
          `"I was struggling to ${benefit}, but ${productName} made it simple. I wish I'd found this sooner."`,
          `— A verified ${singular} user`,
          ``,
          `Join hundreds of ${audience} who made the switch.`,
          ``,
          `CTA: Join Them — ${price}`
        ].join('\n');
      } else if (previewTemplate === 'stacked_offer') {
        headline = `Everything You Need to ${cap(benefit)}`;
        bodyContent = [
          `What's Included:`,
          `✓ ${productName} — Core System (Value: $49)`,
          `✓ Quick-Start Guide (Value: $19)`,
          `✓ Bonus Templates (Value: $29)`,
          `✓ Priority Support (Value: $19)`,
          `✓ Lifetime Updates (Value: $49)`,
          ``,
          `Total Value: $165`,
          `Your Price Today: ${price}`,
          ``,
          `CTA: Get Everything for ${price}`
        ].join('\n');
      } else {
        // classic_long_form or default
        headline = `${cap(benefit)} — In Under 2 Minutes, Every Single Time`;
        bodyContent = [
          `Hook: You know the feeling. You need to ${benefit}, but every option seems complicated, overpriced, or just not built for ${audience} like you.`,
          ``,
          `Problem: Every ${singular} knows the struggle. You want to ${benefit}, but it feels like you're stuck choosing between bad options. You waste time, waste money, and end up settling for "good enough."`,
          ``,
          `Promise: Imagine knowing exactly what to do — every time. No guesswork. No wasted effort. Just clear, simple decisions that get you the result you want.`,
          ``,
          `What You Get:`,
          `• ${productName} (${price})`,
          `• Complete system for ${benefit}`,
          `• Works immediately — no setup, no learning curve`,
          `• Built specifically for ${audience}`,
          `• Regular updates included`,
          ``,
          `Benefits:`,
          `• Save 20+ minutes every time you need to make a decision`,
          `• Never settle for a bad option again`,
          `• Works even when you're tired, rushed, or distracted`,
          `• Simple enough that anyone can use it`,
          `• Built by someone who understands ${audience}`,
          ``,
          `Who It's For:`,
          `• ${cap(audience)} who are tired of guessing`,
          `• Anyone who wants to ${benefit} without overthinking`,
          `• People who value their time and want a faster way`,
          `• Anyone who's tried other solutions and been disappointed`,
          ``,
          `Guarantee: Try ${productName} for 30 days. If it doesn't help you ${benefit}, email us for a full refund. No questions asked.`,
          ``,
          `CTA: Get ${productName} — ${price}`,
          ``,
          `Q: How fast can I start using it?`,
          `A: Immediately. You get access right after purchase — no waiting, no setup.`,
          ``,
          `Q: Is this really built for ${audience}?`,
          `A: Yes. Every feature was designed specifically for ${audience} dealing with "${pain}."`,
          ``,
          `Q: What if it doesn't work for me?`,
          `A: Full 30-day money-back guarantee. Try it risk-free.`,
          ``,
          `Q: Is this a subscription?`,
          `A: No. One-time payment of ${price}. No hidden fees, no recurring charges.`
        ].join('\n');
      }
      break;
    }

    case 'Checkout': {
      headline = 'Complete Your Order';
      if (previewTemplate === 'trust_checkout') {
        bodyContent = [
          `Summary: ${productName} — ${price}`,
          ``,
          `Included:`,
          `• Full access to ${productName}`,
          `• All features and updates`,
          `• 30-day money-back guarantee`,
          ``,
          `Trust: 🔒 Secure checkout. Your payment is encrypted and protected. Instant access after purchase.`,
          ``,
          `Reminder: One-time payment of ${price}. No subscriptions, no hidden fees.`,
          ``,
          `CTA: Complete My Purchase — ${price}`
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
          `CTA: Pay ${price} — Get Instant Access`
        ].join('\n');
      } else {
        bodyContent = [
          `Product: ${productName}`,
          `Price: ${price}`,
          ``,
          `Included:`,
          `• Full access to ${productName}`,
          `• Instant delivery`,
          `• 30-day money-back guarantee`,
          ``,
          `Trust: 🔒 Secure, encrypted checkout. Instant access after purchase.`,
          ``,
          `CTA: Complete My Purchase — ${price}`
        ].join('\n');
      }
      break;
    }

    case 'Order Bump': {
      const bumpPrice = parseInt(price.replace(/[^0-9]/g, '')) > 20 ? '$7' : '$4';
      const bumpName = context.stepTitle || 'Fast Track Add-On';

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
          `Normally $${parseInt(bumpPrice.replace('$', '')) * 2} on its own.`,
          `Yours today for just ${bumpPrice} when you add it now.`,
          ``,
          `Checkbox: ✅ Yes, add the ${bumpName} to my order for ${bumpPrice}`
        ].join('\n');
      } else if (previewTemplate === 'cheat_sheet') {
        headline = `Add the Printable Cheat Sheet — ${bumpPrice}`;
        bodyContent = [
          `Get a one-page printable cheat sheet with the top shortcuts for ${benefit}.`,
          ``,
          `• Fits on one page — print it, save it, reference it anytime`,
          `• The best options at a glance`,
          `• No phone needed — works offline`,
          ``,
          `Checkbox: ✅ Yes, add the Cheat Sheet to my order for ${bumpPrice}`
        ].join('\n');
      } else {
        // checkbox_bump default
        headline = `Add the ${bumpName} — Just ${bumpPrice}`;
        bodyContent = [
          `Get a shortcut to faster results. The ${bumpName} gives you:`,
          ``,
          `• The top recommendations pre-filtered and ready to use`,
          `• A printable quick-reference you can access anytime`,
          `• Advanced tips that aren't in the main product`,
          ``,
          `Checkbox: ✅ Yes, add the ${bumpName} to my order for ${bumpPrice}`,
          ``,
          `Normally sold separately. Yours for ${bumpPrice} only when you add it now.`
        ].join('\n');
      }
      break;
    }

    case 'Upsell': {
      const upsellName = context.stepTitle || `${short} Pro`;
      const upsellPrice = '$' + (Math.max(parseInt(price.replace(/[^0-9]/g, '')) * 2, 19) || 19) + '/month';

      if (previewTemplate === 'premium_bundle') {
        headline = `You're In! Want the Complete ${short} Bundle?`;
      } else if (previewTemplate === 'done_for_you') {
        headline = `You're In! Want Us to Do It For You?`;
      } else {
        headline = `You're In! Want ${upsellName} Too?`;
      }

      bodyContent = [
        `Promise: Get the done-for-you upgraded version. We handle the hard parts so you get better results with less effort.`,
        ``,
        `What's Included:`,
        `• Everything in the base ${productName}`,
        `• Personalized recommendations based on your situation`,
        `• Priority updates and new features first`,
        `• Advanced options not available in the standard version`,
        `• Direct support when you need help`,
        ``,
        `Benefits:`,
        `• Save 30+ minutes per day with the automated system`,
        `• Get better results without extra effort`,
        `• Works alongside ${productName} for full coverage`,
        `• Cancel anytime — no commitment`,
        ``,
        `CTA: Yes! Add ${upsellName} — ${upsellPrice}`,
        ``,
        `No-Thanks: No thanks, I'll stick with the basic version.`
      ].join('\n');
      break;
    }

    case 'Downsell': {
      const downsellName = context.stepTitle || `${short} Basic`;
      const downsellPrice = '$' + Math.max(Math.floor(parseInt(price.replace(/[^0-9]/g, '')) * 0.7) || 7, 5);

      headline = `Not Ready for the Full Upgrade? Here's a Simpler Option.`;
      bodyContent = [
        `Promise: Get ${downsellName} — a streamlined version with the essentials. Less features, but still way better than going without.`,
        ``,
        `What's Different:`,
        `The full upgrade gives you personalized, automated recommendations. ${downsellName} is a one-time download — the core system without the extras. Less customization, but still effective.`,
        ``,
        `What You Get:`,
        `• The essential system for ${benefit}`,
        `• Core templates and shortcuts`,
        `• One-time purchase — no subscription`,
        `• Printable/saveable format`,
        `• A solid starting point`,
        ``,
        `CTA: Yes, I'll Take ${downsellName} — ${downsellPrice}`,
        ``,
        `No-Thanks: No thanks, I'm good with just ${productName}.`
      ].join('\n');
      break;
    }

    case 'Thank You Page': {
      headline = `You're In! Here's How to Get Started`;
      bodyContent = [
        `Confirmation: Your purchase is confirmed. You now have full access to ${productName}.`,
        ``,
        `Next Steps:`,
        `1. Check your email for your access link`,
        `2. Open ${productName} on your device`,
        `3. Use it to ${benefit} — starting right now`,
        ``,
        `Access: Your login link was sent to the email you used at checkout. Can't find it? Check spam, or email support for help.`,
        ``,
        `Support: Need help? Reply to your confirmation email. We typically respond within 4 hours.`,
        ``,
        `Bonus: Know someone who'd love ${productName}? Share your referral link and earn credit toward upgrades.`
      ].join('\n');
      break;
    }

    case 'Email Follow-up': {
      headline = `${productName} — Follow-Up Sequence`;
      bodyContent = [
        `Email 1 — Welcome (Day 0)`,
        `Subject: You're in — here's your ${productName} access`,
        `Preview: Welcome aboard. Here's how to get the most out of ${productName} starting today.`,
        `Purpose: Deliver access, set expectations, encourage first use.`,
        `CTA: Open ${productName} Now`,
        ``,
        `Email 2 — Quick Win (Day 2)`,
        `Subject: Try this: your first result takes 30 seconds`,
        `Preview: Here's the fastest way to ${benefit} using ${productName}.`,
        `Purpose: Drive first engagement, show immediate value.`,
        `CTA: Get Your First Result`,
        ``,
        `Email 3 — Story (Day 4)`,
        `Subject: How one ${singular} solved "${pain}"`,
        `Preview: They were struggling with the same thing. Here's what changed.`,
        `Purpose: Build belief through social proof and relatability.`,
        `CTA: Start Using ${productName}`,
        ``,
        `Email 4 — Objection Crusher (Day 6)`,
        `Subject: Think ${benefit} is too hard? Think again.`,
        `Preview: The #1 objection we hear — and why it's wrong.`,
        `Purpose: Address the most common hesitation or misconception.`,
        `CTA: See How Easy It Is`,
        ``,
        `Email 5 — Upgrade Push (Day 8)`,
        `Subject: Your upgrade offer expires tomorrow`,
        `Preview: The premium version is still available — but not for long.`,
        `Purpose: Drive upsell conversions with urgency.`,
        `CTA: Upgrade Now`
      ].join('\n');
      break;
    }

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
        `CTA: Reserve Your Free Spot`
      ].join('\n');
      break;
    }

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
        `CTA: Submit & Get Early Access`
      ].join('\n');
      break;
    }

    case 'Application Page': {
      headline = `Apply for the ${short} Accelerator Program`;
      bodyContent = [
        `Qualification: This program is for ${audience} who are serious about ${benefit} — faster and with expert guidance.`,
        ``,
        `Questions:`,
        `1. What's your name?`,
        `2. How long have you been dealing with "${pain}"?`,
        `3. What's your biggest challenge right now?`,
        `4. What would success look like for you in 90 days?`,
        `5. Are you ready to invest in solving this?`,
        ``,
        `CTA: Submit My Application`,
        ``,
        `Confirmation: Applications reviewed within 48 hours. If you're a fit, we'll send a booking link.`
      ].join('\n');
      break;
    }

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
        `CTA: Book My Free Strategy Call`
      ].join('\n');
      break;
    }

    default: {
      headline = `${cap(benefit)} — The Simple Way`;
      bodyContent = `Discover how ${audience} are using ${productName} to ${benefit} — quickly and without the guesswork.\n\nCTA: Learn More`;
      break;
    }
  }

  return {
    headline,
    sections: [
      { title: 'Generated Funnel Copy', content: bodyContent }
    ]
  };
}

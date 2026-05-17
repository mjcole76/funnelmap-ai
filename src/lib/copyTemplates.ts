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
}

export interface GeneratedCopy {
  headline: string;
  sections: Array<{ title: string; content: string }>;
}

export function generateCopy(stepType: string, context: FunnelContext): GeneratedCopy {
  const { 
    productName = 'The Product', 
    audience = 'your audience', 
    price = '$99', 
    problem = 'the main problem',
    goal = 'their goal'
  } = context;

  let headline = '';
  let bodyContent = '';

  switch (stepType) {
    case 'Landing Page':
    case 'Opt-in Page':
      headline = `Stop Wasting Time Struggling With ${problem}`;
      bodyContent = `Subheadline: The free guide that helps ${audience} solve ${problem} and achieve ${goal} — in under 10 minutes.

Benefits:
• Find the exact solution to ${problem} without the usual frustration
• Save hours of wasted effort with our pre-filtered options
• Never settle for mediocre results again
• Works instantly — no complex setup needed
• Updated regularly with the latest strategies

CTA: Get Your Free Guide Now

Trust: Join thousands of ${audience} already getting better results. No spam, unsubscribe anytime.`;
      break;

    case 'Sales Page':
      headline = `Overcome ${problem} Faster Than Ever`;
      bodyContent = `Hook: You've been trying to solve ${problem} for a while now. You're exhausted, frustrated, and the only options you can see just don't seem to work...

Problem: Every one of the ${audience} knows the feeling. You want to achieve ${goal} without the hassle, but dealing with ${problem} feels impossible. You end up settling for whatever's closest, spending too much time, and feeling like you're spinning your wheels.

Promise: Imagine waking up and knowing exactly what to do — a proven system that works, costs just ${price}, and won't wreck your schedule.

What You Get:
- ${productName} (${price} early access)
- Comprehensive database of solutions
- Time-saving templates and recommendations
- Offline mode for when you're disconnected
- Regular updates

Benefits:
• Clear solutions to ${problem} clearly marked
• Budget-friendly strategies
• Works for all types of ${audience}
• Simple to use — just open and go
• Built by experts, for ${audience}

Who It's For:
• ${audience} who deal with ${problem} regularly
• Anyone trying to achieve ${goal}
• People sick of guessing what works
• Those who want to save time and money

Guarantee: Try it for 30 days. If ${productName} doesn't save you time and help you overcome ${problem}, email us and we'll refund every penny. No questions.

CTA: Get ${productName} — ${price} Early Access

FAQ:
Q: Will this work for my specific situation?
A: Yes. We've built this specifically for ${audience} dealing with ${problem}.

Q: Is it easy to use?
A: Absolutely. No technical skills required.

Q: Can I get a refund?
A: Yes. 30-day money-back guarantee, no questions asked.`;
      break;

    case 'Checkout':
      headline = `Complete Your Order`;
      bodyContent = `Summary: ${productName} — Early Access (${price})

Included:
• Full access to ${productName}
• Complete system to solve ${problem}
• Time-saving tools and templates
• Priority support
• Regular updates

Trust: 🔒 Secure checkout. Your payment is encrypted and protected. Instant access after purchase.

Reminder: One-time payment of ${price}. No subscriptions, no hidden fees.

CTA: Complete My Purchase — ${price}`;
      break;

    case 'Order Bump':
      headline = `Add the Ultimate Cheat Sheet — Just $9`;
      bodyContent = `Pitch: Get a printable one-page cheat sheet with the top strategies to solve ${problem} instantly. Keep it handy and never think twice about what to do next.

Bullets:
• Top 3 proven strategies
• All designed for maximum efficiency
• Printable PDF — works without your phone

Checkbox: ✅ Yes! Add the Cheat Sheet to my order for $9

Justification: Normally $29 on its own. Yours today for just $9 when you add it now.`;
      break;

    case 'Upsell':
      headline = `You're In! Want the Complete Mastery System Too?`;
      bodyContent = `Promise: Get a done-for-you advanced system built around your specific needs. We do the heavy lifting, you just follow the plan — save time, avoid mistakes, and reach ${goal} faster.

Included:
• Personalized strategies based on your unique situation
• Custom targets to track your progress
• Advanced templates
• Priority access to new features

Bullets:
• Save 10+ hours a week avoiding ${problem}
• Reach ${goal} without the usual frustration
• Strategies update automatically as things change
• Works alongside ${productName} for full coverage
• Cancel anytime — no commitment

CTA: Yes! Add the Mastery System — $49/month

No-Thanks: No thanks, I'll figure it out on my own.`;
      break;

    case 'Downsell':
      headline = `Not Ready for the Full System? Here's a Simpler Option.`;
      bodyContent = `Promise: Get the Quick-Start Guide — a static list of the best solutions for ${problem}. No personalization, no weekly updates. Just a solid guide you can reference anytime.

What Changed: The Mastery System gives you personalized, updating plans. The Quick-Start Guide is a one-time download. Less customization, but still way better than guessing.

Bullets:
• Best strategies specifically for ${audience}
• Sorted by ease of use and impact
• One-time purchase — no subscription
• Printable PDF format
• Great starting point if you're not ready for a full plan

CTA: Yes, I'll Take the Quick-Start Guide — $19

No-Thanks: No thanks, I'm good with just ${productName}.`;
      break;

    case 'Thank You Page':
      headline = `You're In! Here's How to Get Started`;
      bodyContent = `Confirmation: Your purchase is confirmed. You now have full access to ${productName}.

Next Steps:
1. Check your email for your login link
2. Open the platform on your device
3. Start using it to solve ${problem} right away

Access: Your login link was sent to the email you used at checkout. Can't find it? Check spam, or email support@example.com.

Support: Need help? Reply to your confirmation email or reach us at support@example.com. We typically respond within 4 hours.

Bonus CTA: Know someone else in ${audience} who'd love this? Share your referral link and earn rewards for every signup.`;
      break;

    case 'Email Follow-up':
      headline = `5-Email Welcome Sequence`;
      bodyContent = `Email 1 — Welcome
Subject: You're in — here's your access to ${productName}
Body: Welcome message, login link, quick-start instructions, reminder of what you got.
CTA: Log in now

Email 2 — Quick Win (Day 2)
Subject: Try this: your first win takes 2 minutes
Body: Walk them through their first action step to solve ${problem}, show how easy it is.
CTA: Get your first win

Email 3 — Story (Day 4)
Subject: How one user achieved ${goal} effortlessly
Body: Short story about someone in ${audience} who used the tool, solved ${problem}, and got results.
CTA: Start seeing results today

Email 4 — Objection Crusher (Day 6)
Subject: Think solving ${problem} is too hard? Think again.
Body: Address the biggest objection, show how ${productName} makes it simple.
CTA: See how easy it can be

Email 5 — Final Push (Day 8)
Subject: Your upgrade offer expires tomorrow
Body: Remind them about the upsell, emphasize time savings, add urgency.
CTA: Upgrade your access now`;
      break;

    case 'Webinar':
      headline = `Free Training: How ${audience} Can Solve ${problem} Without Wasting Time`;
      bodyContent = `Promise: In 45 minutes, you'll learn exactly how to overcome ${problem} and achieve ${goal} — no stress, no huge budget, no willpower required.

Bullets:
• The top 3 strategies that actually work for ${audience}
• How to automate the hardest parts of ${problem}
• The "2-minute method" that eliminates decision fatigue
• Why most advice fails (and what actually works)
• Live Q&A — get your specific questions answered

Host: Hosted by an expert who overcame ${problem} and now helps others do the same.

CTA: Reserve Your Free Spot

Reminder Email Subject: Your training on solving ${problem} is tomorrow
Reminder Body: Quick reminder with time, link, and one major benefit to show up for.`;
      break;

    case 'Survey':
      headline = `Quick Survey: Help Us Build Better Solutions for You`;
      bodyContent = `Intro: We're building something to help ${audience} solve ${problem}. Your answers (2 minutes) will help us make it work perfectly for YOUR needs.

Questions:
1. How often do you deal with ${problem}?
2. What's your biggest frustration right now?
3. What solutions have you tried in the past?
4. How much do you typically spend trying to solve this?
5. Do you have any specific goals right now?
6. Would you use a tool that specifically helps with this?
7. What would make a solution worth paying for?

Completion: Thanks! Your answers help us build exactly what ${audience} need. We'll email you when the tool is ready — you'll get first access.

CTA: Submit & Get Early Access`;
      break;

    case 'Application Page':
      headline = `Apply for the Advanced Accelerator Program`;
      bodyContent = `Qualification: This program is for ${audience} who are serious about solving ${problem} once and for all. We work with a limited number of people each month to create personalized plans.

Questions:
1. What's your name?
2. How long have you been dealing with ${problem}?
3. What's your biggest challenge right now?
4. Have you tried to improve this before? What happened?
5. What would success look like for you in 90 days?
6. Are you willing to invest time and money if the program is a good fit?
7. What's the best email to reach you?

CTA: Submit My Application

Confirmation: Application received! We review applications within 48 hours. If you're a good fit, we'll send you a link to book your strategy call.`;
      break;

    case 'Booking Page':
      headline = `Book Your Free 15-Minute Strategy Call`;
      bodyContent = `Promise: In 15 minutes, we'll map out a simple plan to help you overcome ${problem} and achieve ${goal} — based on YOUR specific situation. No sales pitch unless you ask.

Who Should Book:
• ${audience} who are ready for change
• People who want to stop struggling with ${problem}
• Those open to expert guidance
• Anyone who has tried and failed to fix this on their own

Who Should NOT Book:
• People looking for a magic button with zero effort
• Those not willing to try new approaches
• Anyone not currently dealing with ${problem}

Preparation: Before your call, think about your biggest hurdle and one specific goal you'd like to achieve in the next 30 days.

CTA: Book My Free Strategy Call`;
      break;

    default:
      headline = `Ready to overcome ${problem}?`;
      bodyContent = `Discover how ${audience} are using ${productName} to achieve ${goal} and solve ${problem} quickly.`;
      break;
  }

  return {
    headline,
    sections: [
      { title: 'Generated Funnel Copy', content: bodyContent }
    ]
  };
}

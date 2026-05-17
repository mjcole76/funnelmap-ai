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

export function generateCopy(stepType: string, context: FunnelContext): GeneratedCopy {
  const { 
    productName = 'The Product', 
    audience = 'your audience', 
    price = '$99', 
    problem = 'the main problem',
    goal = 'their goal',
    previewTemplate
  } = context;

  let headline = '';
  let bodyContent = '';

  switch (stepType) {
    case 'Landing Page':
    case 'Opt-in Page':
      if (previewTemplate === 'video_opt_in') {
        headline = `Watch: How To Solve ${problem} In 10 Minutes`;
        bodyContent = `Video Promise: In this short video, you'll discover the exact method to achieve ${goal}.\n\nWhat You'll Learn:\n• The real reason you struggle with ${problem}\n• Our 3-step framework\n• Real examples of success\n\nCTA: Watch Video Now`;
      } else if (previewTemplate === 'lead_magnet') {
        headline = `Free Guide: The Ultimate Guide to ${goal}`;
        bodyContent = `Resource Title: The ${audience} Survival Guide\n\nWhat's Inside:\n• 10 templates to solve ${problem}\n• The secret to reaching ${goal} faster\n• Avoid the #1 mistake people make\n\nCTA: Download The Free Guide`;
      } else if (previewTemplate === 'split_layout') {
        headline = `The Better Way to Achieve ${goal}`;
        bodyContent = `Left Column:\nTired of ${problem}? Discover the system that changes everything.\n\nBenefits:\n• Fast\n• Easy\n• Proven\n\nCTA: Get Started\n\nRight Column (Image):\n[Image showing happy ${audience} achieving ${goal}]`;
      } else if (previewTemplate === 'checklist_opt_in') {
        headline = `The 5-Step Checklist to Solve ${problem}`;
        bodyContent = `Checklist:\n☐ Step 1: Identify your biggest hurdle\n☐ Step 2: Implement the core framework\n☐ Step 3: Automate the process\n☐ Step 4: Review your progress\n☐ Step 5: Achieve ${goal}\n\nCTA: Get The Full Checklist`;
      } else { // hero_cta or default
        headline = `Stop Wasting Time Struggling With ${problem}`;
        bodyContent = `Subheadline: The free guide that helps ${audience} solve ${problem} and achieve ${goal} — in under 10 minutes.\n\nBenefits:\n• Find the exact solution without frustration\n• Save hours of wasted effort\n• Never settle for mediocre results again\n\nCTA: Get Your Free Guide Now`;
      }
      break;

    case 'Sales Page':
      if (previewTemplate === 'short_offer') {
        headline = `Get ${productName} and Achieve ${goal}`;
        bodyContent = `Key Benefits:\n• Overcome ${problem} quickly\n• Easy for ${audience}\n• Proven results\n\nPrice: Just ${price}\n\nCTA: Buy Now`;
      } else if (previewTemplate === 'problem_solution') {
        headline = `Struggling with ${problem}? We Have the Fix.`;
        bodyContent = `The Problem:\nDealing with ${problem} is exhausting. You've tried everything, but nothing sticks.\n\nThe Solution:\n${productName} is the system built exactly for this. It handles the hard parts so you can reach ${goal}.\n\nCTA: Get The Solution`;
      } else if (previewTemplate === 'proof_first') {
        headline = `"This completely solved ${problem} for me!"`;
        bodyContent = `Testimonial:\n"I was struggling to achieve ${goal}, but ${productName} changed everything in just a week!"\n\nOffer:\nJoin hundreds of successful ${audience}.\n\nCTA: Join Them Today`;
      } else { // classic_long_form or default
        headline = `Overcome ${problem} Faster Than Ever`;
        bodyContent = `Hook: You've been trying to solve ${problem} for a while now...\n\nProblem: Every ${audience} knows the feeling.\n\nPromise: Imagine knowing exactly what to do.\n\nOffer Stack:\n- ${productName}\n- Bonus templates\n- Support\n\nBenefits:\n• Clear solutions\n• Simple to use\n\nFAQ:\nQ: Will it work? A: Yes.\n\nCTA: Get ${productName} for ${price}`;
      }
      break;

    case 'Checkout':
      if (previewTemplate === 'trust_checkout') {
        headline = `Secure Your Order`;
        bodyContent = `Summary: ${productName} for ${price}\n\nGuarantee: 30-Day Money-Back Guarantee.\nSecurity: 🔒 SSL Encrypted Checkout.\n\nCTA: Complete Secure Purchase`;
      } else if (previewTemplate === 'two_column') {
        headline = `Complete Your Checkout`;
        bodyContent = `Product Summary (Left):\n${productName} helps you solve ${problem} and achieve ${goal}.\n\nPayment Section (Right):\nEnter your details to unlock access instantly.\n\nCTA: Pay ${price}`;
      } else { // simple_checkout or default
        headline = `Complete Your Order`;
        bodyContent = `Product: ${productName}\nPrice: ${price}\n\nCTA: Complete My Purchase — ${price}`;
      }
      break;

    case 'Order Bump':
      if (previewTemplate === 'bonus_box') {
        headline = `Add the Bonus Pack!`;
        bodyContent = `Bonus Offer: Get extra templates and advanced training to speed up your journey to ${goal}.\n\nCheckbox: Yes, add the Bonus Pack for $19.`;
      } else if (previewTemplate === 'cheat_sheet') {
        headline = `Add the Printable Cheat Sheet`;
        bodyContent = `Pitch: Get a printable one-page cheat sheet with the top strategies to solve ${problem} instantly.\n\nCheckbox: Yes, add the Cheat Sheet for $9.`;
      } else { // checkbox_bump or default
        headline = `Want to upgrade your order?`;
        bodyContent = `Pitch: Add our advanced workshop to your order.\n\nCheckbox: Yes, add the workshop.\n\nJustification: Normally $99, today only $27!`;
      }
      break;

    case 'Upsell':
      headline = `You're In! Want the Complete Mastery System Too?`;
      bodyContent = `Promise: Get a done-for-you advanced system built around your specific needs.\n\nIncluded:\n• Personalized strategies\n• Advanced templates\n\nCTA: Yes! Add the Mastery System\n\nNo-Thanks: No thanks, I'll figure it out on my own.`;
      break;

    case 'Downsell':
      headline = `Not Ready for the Full System? Here's a Simpler Option.`;
      bodyContent = `Promise: Get the Quick-Start Guide — a static list of the best solutions for ${problem}.\n\nCTA: Yes, I'll Take the Quick-Start Guide\n\nNo-Thanks: No thanks, I'm good with just ${productName}.`;
      break;

    case 'Thank You Page':
      headline = `You're In! Here's How to Get Started`;
      bodyContent = `Confirmation: Your purchase is confirmed. You now have full access to ${productName}.\n\nNext Steps:\n1. Check your email for your login link\n2. Open the platform on your device\n3. Start using it to solve ${problem} right away\n\nSupport: Need help? Reply to your confirmation email.`;
      break;

    case 'Email Follow-up':
      headline = `Email Sequence`;
      bodyContent = `Email 1 — Welcome\nSubject: You're in — here's your access\n\nEmail 2 — Quick Win\nSubject: Try this: your first win takes 2 minutes\n\nEmail 3 — Story\nSubject: How one user achieved ${goal}`;
      break;

    case 'Webinar':
      headline = `Free Training: How ${audience} Can Solve ${problem}`;
      bodyContent = `Promise: In 45 minutes, you'll learn exactly how to overcome ${problem} and achieve ${goal}.\n\nCTA: Reserve Your Free Spot`;
      break;

    case 'Survey':
      headline = `Quick Survey: Help Us Build Better Solutions for You`;
      bodyContent = `Intro: We're building something to help ${audience} solve ${problem}. Your answers (2 minutes) will help us make it work perfectly for YOUR needs.\n\nCTA: Submit & Get Early Access`;
      break;

    case 'Application Page':
      headline = `Apply for the Advanced Accelerator Program`;
      bodyContent = `Qualification: This program is for ${audience} who are serious about solving ${problem} once and for all.\n\nCTA: Submit My Application`;
      break;

    case 'Booking Page':
      headline = `Book Your Free Strategy Call`;
      bodyContent = `Promise: In 15 minutes, we'll map out a simple plan to help you overcome ${problem} and achieve ${goal} — based on YOUR specific situation.\n\nCTA: Book My Free Strategy Call`;
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

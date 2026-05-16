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
  const { productName = '[Product]', audience = '[Audience]', price = '[Price]', problem = '[Problem]' } = context;

  switch (stepType) {
    case 'Opt-in Page':
      return {
        headline: `Free Guide: How to solve ${problem} for ${audience}`,
        sections: [
          { title: 'Subheadline', content: `Stop struggling with ${problem}. Discover the proven framework.` },
          { title: 'Benefits', content: `• Learn the #1 mistake ${audience} make\n• A step-by-step system\n• Save time and energy\n• Actionable tips you can use today\n• Exclusive access to our framework` },
          { title: 'Form CTA', content: `Get Instant Access` },
          { title: 'Trust note', content: `No spam, unsubscribe anytime` }
        ]
      };
    case 'Sales Page':
      return {
        headline: `The Ultimate ${productName} for ${audience}`,
        sections: [
          { title: 'Hook', content: `Are you tired of dealing with ${problem}? What if there was a better way?` },
          { title: 'Problem', content: `Most ${audience} struggle with ${problem} because they lack the right tools. It leads to frustration, lost time, and missed opportunities. You've probably tried other solutions that promised the world but delivered nothing.` },
          { title: 'Promise', content: `Imagine waking up tomorrow with a clear path forward. With ${productName}, you'll finally be able to overcome ${problem} and achieve your goals faster than ever.` },
          { title: 'Offer Stack', content: `• ${productName} Core System ($X value)\n• Bonus 1: Implementation Guide ($Y value)\n• Bonus 2: Templates ($Z value)\n• Access to Community ($W value)` },
          { title: 'Benefits', content: `• Instant clarity on your next steps\n• Proven frameworks that work\n• Lifetime access to updates\n• Expert support when you need it\n• No technical skills required\n• Money-back guarantee\n• Join 1000+ happy customers` },
          { title: 'Who It\'s For', content: `• ${audience} ready to take action\n• People frustrated with ${problem}\n• Those looking for a proven system\n• Beginners and experts alike` },
          { title: 'Who It\'s NOT For', content: `• People who aren't willing to do the work\n• Those looking for a "get rich quick" scheme\n• Anyone not serious about solving ${problem}` },
          { title: 'Guarantee', content: `30-day money-back guarantee. Try it risk-free.` },
          { title: 'CTA', content: `Get ${productName} Now for ${price}` },
          { title: 'FAQ', content: `Q: How long do I have access?\nA: Lifetime access!\n\nQ: Is there a refund policy?\nA: Yes, 30 days.\n\nQ: Do I need experience?\nA: No, it's beginner-friendly.\n\nQ: When do I get access?\nA: Immediately after purchase.\n\nQ: How do I get support?\nA: Email us anytime.` }
        ]
      };
    case 'Checkout':
      return {
        headline: `Complete Your Order`,
        sections: [
          { title: 'Order Summary', content: `${productName} - ${price}` },
          { title: 'What\'s Included', content: `• Lifetime access to ${productName}\n• All bonuses mentioned\n• Priority support` },
          { title: 'Trust Copy', content: `Secure 256-bit SSL encryption. Instant access after payment.` },
          { title: 'Payment Reminder', content: `One-time payment of ${price}. No hidden fees.` },
          { title: 'Final CTA', content: `Complete Purchase` }
        ]
      };
    case 'Order Bump':
      return {
        headline: `Wait! Add [Bump Product] for just [bump price]`,
        sections: [
          { title: 'Pitch', content: `Want to get results even faster? Add our VIP implementation pack. It pairs perfectly with ${productName}.` },
          { title: 'Benefits', content: `• Done-for-you templates\n• Video walkthroughs\n• Expert review` },
          { title: 'Checkbox Copy', content: `Yes! Add this to my order` },
          { title: 'Price Justification', content: `Normally $97, yours today for just $27.` }
        ]
      };
    case 'Upsell':
      return {
        headline: `You're In! But Before You Go...`,
        sections: [
          { title: 'Upgrade Promise', content: `Upgrade your order to get the advanced mastery course.` },
          { title: 'Why Now', content: `This is a one-time offer. You won't see this price again.` },
          { title: 'What\'s Included', content: `• Advanced modules\n• 1-on-1 coaching call\n• VIP community access\n• Software templates` },
          { title: 'Benefits', content: `• Skip the trial and error\n• Get personalized feedback\n• Network with top performers\n• Save hundreds of hours\n• Guarantee your success` },
          { title: 'CTA', content: `Yes, Upgrade My Order!` },
          { title: 'No-Thanks', content: `No thanks, I'll stick with the basic version` }
        ]
      };
    case 'Downsell':
      return {
        headline: `Wait — Here's a Simpler Option`,
        sections: [
          { title: 'Simpler Offer', content: `If the VIP package was too much, how about just the templates?` },
          { title: 'What\'s Different', content: `You get the core assets without the expensive coaching.` },
          { title: 'Benefits', content: `• Instant template access\n• Easy to customize\n• Proven to convert\n• Huge time saver\n• Fraction of the cost` },
          { title: 'CTA', content: `Yes, I Want This Instead` },
          { title: 'No-Thanks', content: `No thanks, I'm good with what I have` }
        ]
      };
    case 'Thank You Page':
      return {
        headline: `You're In! Here's What Happens Next...`,
        sections: [
          { title: 'Confirmation', content: `Your order for ${productName} is confirmed.` },
          { title: 'Next Steps', content: `1. Check your email for login details.\n2. Whitelist our email address.\n3. Log in and start module 1.` },
          { title: 'Access Instructions', content: `You can log in at members.yoursite.com.` },
          { title: 'Support Note', content: `Need help? Email support@yoursite.com.` },
          { title: 'Bonus CTA', content: `Join our free Facebook group while you wait.` }
        ]
      };
    case 'Email Follow-up':
      return {
        headline: `5-Email Welcome Sequence`,
        sections: [
          { title: 'Email 1 (Welcome)', content: `Subject: Welcome to ${productName}!\n\nHere's how to get started...` },
          { title: 'Email 2 (Quick Win)', content: `Subject: Your first win with ${productName}\n\nDo this one thing today...` },
          { title: 'Email 3 (Story)', content: `Subject: How I overcame ${problem}\n\nHere is my story...` },
          { title: 'Email 4 (Objection Crusher)', content: `Subject: "But will this work for me?"\n\nYes, and here is why...` },
          { title: 'Email 5 (Final Push)', content: `Subject: Last chance to upgrade\n\nDon't miss out on this...` }
        ]
      };
    case 'Webinar':
      return {
        headline: `Free Training: How to solve ${problem} for ${audience}`,
        sections: [
          { title: 'Promise', content: `In this free training, you will learn the exact system we use to help ${audience} succeed.` },
          { title: 'Benefits', content: `• The 3 secrets to success\n• How to avoid common pitfalls\n• Live Q&A session\n• Exclusive bonuses for attendees\n• Actionable strategy` },
          { title: 'Host Intro', content: `Hosted by an industry expert who has helped thousands.` },
          { title: 'CTA', content: `Reserve Your Spot` },
          { title: 'Reminder Email', content: `Subject: We are starting in 15 minutes!\n\nClick here to join the room.` }
        ]
      };
    case 'Survey':
      return {
        headline: `Quick Survey: Help Us Serve You Better`,
        sections: [
          { title: 'Intro', content: `We want to create the best content for ${audience}. Please take 2 minutes to answer.` },
          { title: 'Questions', content: `1. What is your biggest challenge with ${problem}?\n2. What is your current goal?\n3. How much time do you have?\n4. What is your budget?\n5. What format do you prefer?\n6. What have you tried before?\n7. Any other comments?` },
          { title: 'Completion Message', content: `Thank you for your feedback! We will use this to improve.` },
          { title: 'CTA', content: `Return to homepage` }
        ]
      };
    case 'Application Page':
      return {
        headline: `Apply to ${productName}`,
        sections: [
          { title: 'Qualification', content: `This program is strictly for ${audience} who are serious about results.` },
          { title: 'Questions', content: `1. Full Name\n2. Email\n3. Business/Website\n4. Current Revenue\n5. Goal Revenue\n6. Biggest Hurdle\n7. Why are you a good fit?\n8. Are you ready to invest?` },
          { title: 'Submission CTA', content: `Submit Application` },
          { title: 'Confirmation', content: `We will review your application and get back to you within 48 hours.` }
        ]
      };
    case 'Booking Page':
      return {
        headline: `Book Your Strategy Call`,
        sections: [
          { title: 'Call Promise', content: `On this free call, we will map out a custom plan to solve ${problem}.` },
          { title: 'Who Should Book', content: `• ${audience} ready to scale\n• Action-takers\n• People with a budget\n• Those committed to success` },
          { title: 'Who Should NOT Book', content: `• Tire-kickers\n• People looking for free advice\n• Uncommitted individuals` },
          { title: 'Preparation', content: `Please complete the application before the call and be in a quiet room.` },
          { title: 'CTA', content: `Book Your Call Now` }
        ]
      };
    default:
      return {
        headline: `[Your Headline Here]`,
        sections: [
          { title: 'Content', content: `[Your content goes here]` }
        ]
      };
  }
}

import React, { useEffect, useState } from 'react';
import { X, Check, Shield, Lock, Play, Star, Calendar } from 'lucide-react';
import { STEP_TYPES } from './Sidebar';

interface PagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  stepType: string;
  title: string;
  previewTemplate: string;
  headline?: string;
  buttonText?: string;
  price?: string;
  funnelSettings: {
    productName: string;
    audience: string;
    price: string;
    problem: string;
    goal: string;
  };
}

// Named section parser — extracts labeled blocks from the generated copy body
interface ParsedSections {
  headline: string;
  subheadline: string;
  bullets: string[];
  cta: string;
  trust: string;
  paragraphs: string[];
  problem: string[];
  promise: string[];
  whatYouGet: string[];
  benefits: string[];
  whoFor: string[];
  whoNotFor: string[];
  guarantee: string;
  faq: { q: string; a: string }[];
  emails: { subject: string; body: string; cta: string }[];
  whyNow: string;
  whatChanged: string;
  nextSteps: string[];
  noThanks: string;
  openingHook: string[];
  confirmation: string;
  support: string;
  priceJustification: string;
}

function parseCopyContent(copyData: any, nodeHeadline?: string, nodeButtonText?: string): ParsedSections {
  const result: ParsedSections = {
    headline: '',
    subheadline: '',
    bullets: [],
    cta: '',
    trust: '',
    paragraphs: [],
    problem: [],
    promise: [],
    whatYouGet: [],
    benefits: [],
    whoFor: [],
    whoNotFor: [],
    guarantee: '',
    faq: [],
    emails: [],
    whyNow: '',
    whatChanged: '',
    nextSteps: [],
    noThanks: '',
    openingHook: [],
    confirmation: '',
    support: '',
    priceJustification: '',
  };

  if (!copyData) return result;

  if (copyData.headline) result.headline = copyData.headline;
  if (copyData.cta || copyData.button) result.cta = copyData.cta || copyData.button;

  const sections = copyData.sections || [];
  let allText = '';
  if (sections.length > 0) {
    sections.forEach((s: any) => {
      allText += `${s.content}\n\n`;
    });
  } else if (copyData.body) {
    allText = copyData.body;
  }

  if (!allText.trim()) return result;

  const lines = allText.split('\n');
  
  // Section detection — matches patterns like "Problem:", "What You Get:", "Opening hook:", etc.
  type SectionKey = 'subheadline' | 'opening_hook' | 'problem' | 'promise' | 'what_you_get' | 'benefits' | 'who_for' | 'who_not_for' | 'guarantee' | 'faq' | 'cta' | 'trust' | 'why_now' | 'what_changed' | 'next_steps' | 'no_thanks' | 'confirmation' | 'support' | 'price_justification' | 'order_summary' | 'included' | 'email' | 'general';
  
  let currentSection: SectionKey = 'general';
  let currentFaqQ = '';
  let currentEmailIdx = -1;

  const sectionMap: Record<string, SectionKey> = {
    'subheadline': 'subheadline',
    'sub headline': 'subheadline',
    'opening hook': 'opening_hook',
    'problem': 'problem',
    'the problem': 'problem',
    'promise': 'promise',
    'the solution': 'promise',
    'what you get': 'what_you_get',
    'what\'s included': 'included',
    'what is included': 'included',
    'included': 'included',
    'benefits': 'benefits',
    'benefit bullets': 'benefits',
    'key benefits': 'benefits',
    'who it\'s for': 'who_for',
    'who it is for': 'who_for',
    'who should book': 'who_for',
    'who it\'s not for': 'who_not_for',
    'who it is not for': 'who_not_for',
    'guarantee': 'guarantee',
    'faq': 'faq',
    'frequently asked questions': 'faq',
    'cta': 'cta',
    'trust': 'trust',
    'trust copy': 'trust',
    'why now': 'why_now',
    'what changed': 'what_changed',
    'next steps': 'next_steps',
    'no-thanks': 'no_thanks',
    'no thanks': 'no_thanks',
    'confirmation': 'confirmation',
    'support': 'support',
    'support note': 'support',
    'price justification': 'price_justification',
    'price': 'price_justification',
    'order summary': 'order_summary',
    'what you\'ll learn': 'benefits',
    'what\'s inside': 'what_you_get',
    'resource': 'general',
    'video promise': 'general',
    'preparation': 'general',
    'qualification': 'general',
    'questions': 'general',
    'intro': 'general',
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if this line is a section header (ends with ":" and matches known sections)
    const headerMatch = trimmed.match(/^([A-Za-z\s']+):(.*)$/);
    if (headerMatch) {
      const headerKey = headerMatch[1].toLowerCase().trim();
      const headerValue = headerMatch[2].trim();

      if (sectionMap[headerKey] !== undefined) {
        currentSection = sectionMap[headerKey];
        // If there's content after the colon, process it
        if (headerValue) {
          processLine(headerValue, currentSection);
        }
        continue;
      }
    }

    // Check for email headers
    const emailHeaderMatch = trimmed.match(/^Email \d+\s*[—–-]\s*(.+?)(?:\s*\(Day \d+\))?$/i);
    if (emailHeaderMatch) {
      currentSection = 'email';
      currentEmailIdx++;
      result.emails.push({ subject: '', body: '', cta: '' });
      continue;
    }

    // Check for subject line in email
    if (currentSection === 'email' && trimmed.toLowerCase().startsWith('subject:')) {
      if (result.emails[currentEmailIdx]) {
        result.emails[currentEmailIdx].subject = trimmed.substring(8).trim();
      }
      continue;
    }

    // Check for body line in email
    if (currentSection === 'email' && trimmed.toLowerCase().startsWith('body:')) {
      if (result.emails[currentEmailIdx]) {
        result.emails[currentEmailIdx].body = trimmed.substring(5).trim();
      }
      continue;
    }

    // CTA inside email
    if (currentSection === 'email' && trimmed.toLowerCase().startsWith('cta:')) {
      if (result.emails[currentEmailIdx]) {
        result.emails[currentEmailIdx].cta = trimmed.substring(4).trim();
      }
      continue;
    }

    // FAQ Q/A parsing
    if (currentSection === 'faq') {
      if (trimmed.startsWith('Q:') || trimmed.startsWith('q:')) {
        currentFaqQ = trimmed.substring(2).trim();
      } else if ((trimmed.startsWith('A:') || trimmed.startsWith('a:')) && currentFaqQ) {
        result.faq.push({ q: currentFaqQ, a: trimmed.substring(2).trim() });
        currentFaqQ = '';
      }
      continue;
    }

    processLine(trimmed, currentSection);
  }

  function processLine(text: string, section: SectionKey) {
    const isBullet = text.startsWith('•') || text.startsWith('- ') || text.startsWith('✓ ') || text.startsWith('☐ ') || text.startsWith('✅');
    const bulletText = isBullet ? text.replace(/^[•\-✓☐✅]\s*/, '').trim() : text;

    switch (section) {
      case 'subheadline':
        if (!result.subheadline) result.subheadline = text;
        else result.subheadline += ' ' + text;
        break;
      case 'opening_hook':
        result.openingHook.push(text);
        break;
      case 'problem':
        if (isBullet) result.problem.push(bulletText);
        else result.problem.push(text);
        break;
      case 'promise':
        if (isBullet) result.promise.push(bulletText);
        else result.promise.push(text);
        break;
      case 'what_you_get':
      case 'included':
      case 'order_summary':
        if (isBullet) result.whatYouGet.push(bulletText);
        else result.whatYouGet.push(text);
        break;
      case 'benefits':
        if (isBullet) result.benefits.push(bulletText);
        else result.benefits.push(text);
        break;
      case 'who_for':
        if (isBullet) result.whoFor.push(bulletText);
        else result.whoFor.push(text);
        break;
      case 'who_not_for':
        if (isBullet) result.whoNotFor.push(bulletText);
        else result.whoNotFor.push(text);
        break;
      case 'guarantee':
        result.guarantee += (result.guarantee ? ' ' : '') + text;
        break;
      case 'cta':
        if (!result.cta) result.cta = text;
        break;
      case 'trust':
        result.trust += (result.trust ? ' ' : '') + text;
        break;
      case 'why_now':
        result.whyNow += (result.whyNow ? ' ' : '') + text;
        break;
      case 'what_changed':
        result.whatChanged += (result.whatChanged ? ' ' : '') + text;
        break;
      case 'next_steps':
        result.nextSteps.push(text);
        break;
      case 'no_thanks':
        result.noThanks = text;
        break;
      case 'confirmation':
        result.confirmation += (result.confirmation ? ' ' : '') + text;
        break;
      case 'support':
        result.support += (result.support ? ' ' : '') + text;
        break;
      case 'price_justification':
        result.priceJustification += (result.priceJustification ? ' ' : '') + text;
        break;
      default:
        // General section — bullets go to main bullets, text to paragraphs
        if (isBullet) result.bullets.push(bulletText);
        else if (text.toLowerCase().startsWith('cta:')) result.cta = text.substring(4).trim();
        else if (text.toLowerCase().startsWith('trust:')) result.trust = text.substring(6).trim();
        else if (text.toLowerCase().startsWith('guarantee:')) result.guarantee = text.substring(10).trim();
        else if (text.toLowerCase().startsWith('no-thanks:')) result.noThanks = text.substring(10).trim();
        else result.paragraphs.push(text);
        break;
    }
  }

  // Fill subheadline from first paragraph if empty
  if (!result.subheadline && result.paragraphs.length > 0) {
    result.subheadline = result.paragraphs.shift() || '';
  }

  // Override with node-level data if present
  if (nodeHeadline && !result.headline) result.headline = nodeHeadline;
  if (nodeButtonText && !result.cta) result.cta = nodeButtonText;

  return result;
}

export default function PagePreview({
  isOpen,
  onClose,
  nodeId,
  stepType,
  title,
  previewTemplate,
  headline: nodeHeadline,
  buttonText: nodeButtonText,
  price: nodePrice,
  funnelSettings,
}: PagePreviewProps) {
  const [copyData, setCopyData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`funnel-copy-${nodeId}`);
      if (saved) {
        try {
          setCopyData(JSON.parse(saved));
        } catch (e) {}
      } else {
        setCopyData(null);
      }
    }
  }, [isOpen, nodeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stepInfo = STEP_TYPES.find((s) => s.type === stepType) || STEP_TYPES[7];
  const color = stepInfo.color;

  // Parse copy using the new structured parser
  const parsed = parseCopyContent(copyData, nodeHeadline, nodeButtonText);
  const displayHeadline = parsed.headline || nodeHeadline || funnelSettings.productName || 'Your Product';
  const displaySub = parsed.subheadline || '';
  const displayCta = parsed.cta || nodeButtonText || 'Get Started';
  const displayBullets = parsed.bullets.length > 0 ? parsed.bullets : parsed.benefits;

  const renderContent = () => {
    if (!copyData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
          <p className="mb-4">No copy generated yet.</p>
          <p>Click <strong>&quot;Write&quot;</strong> on the node to generate copy for this page.</p>
        </div>
      );
    }

    const renderButton = (text: string, customColor?: string) => (
      <button 
        className="px-8 py-4 rounded-lg font-bold text-white text-lg shadow-lg transform transition-transform hover:scale-105"
        style={{ backgroundColor: customColor || color }}
      >
        {text}
      </button>
    );

    // ================================================================
    // LANDING PAGES
    // ================================================================
    if (previewTemplate === 'hero_cta') {
      return (
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{displayHeadline}</h1>
          <p className="text-xl text-gray-600 max-w-2xl">{displaySub}</p>
          
          {displayBullets.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl w-full max-w-lg mx-auto text-left space-y-4">
              {displayBullets.slice(0, 5).map((bullet, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{bullet}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4">
            {renderButton(displayCta)}
            {parsed.trust && (
              <p className="mt-4 text-sm text-gray-400 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" /> {parsed.trust}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (previewTemplate === 'lead_magnet' || previewTemplate === 'split_layout') {
      return (
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{displayHeadline}</h1>
            <p className="text-lg text-gray-600">{displaySub}</p>
            {displayBullets.length > 0 && (
              <div className="space-y-3 pt-2">
                {displayBullets.slice(0, 5).map((b, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-4">{renderButton(displayCta)}</div>
          </div>
          <div className="flex-1 w-full">
            {previewTemplate === 'lead_magnet' ? (
              <div className="w-64 h-80 mx-auto bg-white rounded-r-2xl shadow-2xl border-l-8 border-blue-600 flex items-center justify-center p-6 text-center transform -rotate-2">
                <div>
                  <div className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">Free Guide</div>
                  <h3 className="font-bold text-gray-900 text-xl">{funnelSettings.productName || 'The Blueprint'}</h3>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center">
                <span className="text-gray-400">Visual Placeholder</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (previewTemplate === 'checklist_opt_in') {
      return (
        <div className="max-w-xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-8 space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">{displayHeadline}</h2>
          <p className="text-gray-600">{displaySub}</p>
          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl">
            {(displayBullets.length > 0 ? displayBullets : ['Step 1', 'Step 2', 'Step 3']).slice(0, 5).map((b, i) => (
              <div key={i} className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{b}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-4">
            <input type="email" placeholder="Enter your email address..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" disabled />
            <button className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-md" style={{ backgroundColor: color }}>
              {displayCta}
            </button>
          </div>
        </div>
      );
    }

    if (previewTemplate === 'video_opt_in') {
      return (
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
          <div className="w-full aspect-video bg-gray-900 rounded-xl relative shadow-2xl flex items-center justify-center group overflow-hidden">
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 z-10">
               <Play className="w-8 h-8 text-white ml-1" />
             </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{displaySub}</p>
          {renderButton(displayCta)}
        </div>
      );
    }

    // ================================================================
    // SALES PAGES — LONG FORM
    // ================================================================
    if (previewTemplate === 'classic_long_form') {
      return (
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">{displayHeadline}</h1>
            <p className="text-2xl text-gray-600 font-light">{displaySub}</p>
          </div>

          {/* Opening Hook */}
          {parsed.openingHook.length > 0 && (
            <div className="space-y-4">
              {parsed.openingHook.map((p, i) => (
                <p key={i} className="text-lg text-gray-700 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* The Problem */}
          {parsed.problem.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">The Problem</h2>
              {parsed.problem.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* The Promise / Solution */}
          {parsed.promise.length > 0 && (
            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 space-y-4">
              <h2 className="text-2xl font-bold text-emerald-900">The Solution</h2>
              {parsed.promise.map((p, i) => (
                <p key={i} className="text-emerald-800 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* What You Get */}
          {parsed.whatYouGet.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">What You Get</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {parsed.whatYouGet.map((item, i) => (
                  <div key={i} className="flex p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {parsed.benefits.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Benefits</h2>
              <div className="space-y-3">
                {parsed.benefits.map((b, i) => (
                  <div key={i} className="flex items-start p-3">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-lg">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who It's For */}
          {parsed.whoFor.length > 0 && (
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">Who This Is For</h2>
              <div className="space-y-2">
                {parsed.whoFor.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who It's NOT For */}
          {parsed.whoNotFor.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">Who This Is NOT For</h2>
              <div className="space-y-2">
                {parsed.whoNotFor.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <X className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA + Price Block */}
          <div className="flex flex-col items-center p-10 bg-gray-900 rounded-3xl text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl font-bold text-white">Get {funnelSettings.productName || 'Access'} Today</h2>
            <div className="text-5xl font-black text-white">{nodePrice || funnelSettings.price || '$97'}</div>
            {renderButton(displayCta, color)}
            {parsed.guarantee && (
              <div className="flex items-center text-gray-400 text-sm max-w-md">
                <Shield className="w-4 h-4 mr-2 flex-shrink-0" /> {parsed.guarantee}
              </div>
            )}
          </div>

          {/* FAQ */}
          {parsed.faq.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {parsed.faq.map((faq, i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Short / Stacked / Problem-Solution sales pages
    if (previewTemplate === 'short_offer' || previewTemplate === 'stacked_offer' || previewTemplate === 'problem_solution') {
      const allBullets = [...parsed.bullets, ...parsed.benefits, ...parsed.whatYouGet];
      return (
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
            <p className="text-xl text-gray-600">{displaySub}</p>
          </div>

          {/* Problem section for problem_solution template */}
          {previewTemplate === 'problem_solution' && parsed.problem.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">The Problem</h3>
              {parsed.problem.map((p, i) => (
                <p key={i} className="text-gray-700">{p}</p>
              ))}
            </div>
          )}

          {/* Promise section for problem_solution */}
          {previewTemplate === 'problem_solution' && parsed.promise.length > 0 && (
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-3">
              <h3 className="font-bold text-emerald-800 uppercase text-sm tracking-wide">The Solution</h3>
              {parsed.promise.map((p, i) => (
                <p key={i} className="text-emerald-700">{p}</p>
              ))}
            </div>
          )}
          
          {allBullets.length > 0 && (
            <div className="py-6 border-y border-gray-100 space-y-4">
              {allBullets.slice(0, 6).map((b, i) => (
                <div key={i} className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{b}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="text-5xl font-black text-gray-900 py-4">{nodePrice || funnelSettings.price || '$97'}</div>
            {renderButton(displayCta, color)}
            {parsed.guarantee && (
              <p className="text-sm text-gray-500 mt-4">{parsed.guarantee}</p>
            )}
          </div>
        </div>
      );
    }

    if (previewTemplate === 'proof_first') {
      return (
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-1 text-yellow-400 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-8 h-8 fill-current" />)}
            </div>
            <p className="text-3xl font-serif italic text-gray-700 leading-relaxed">
              {parsed.paragraphs[0] || `"This completely changed how we approach the problem. Results were immediate."`}
            </p>
            <p className="font-bold text-gray-900 uppercase tracking-widest text-sm">— Verified User</p>
          </div>
          
          <div className="bg-gray-50 p-12 rounded-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">{displaySub}</p>
            <div className="pt-6">{renderButton(displayCta)}</div>
          </div>
        </div>
      );
    }

    // ================================================================
    // CHECKOUT PAGES
    // ================================================================
    if (previewTemplate === 'simple_checkout' || previewTemplate === 'trust_checkout' || previewTemplate === 'two_column') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-6 bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">Order Summary</h2>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-lg">{funnelSettings.productName || 'Product'}</span>
              <span className="font-bold text-lg">{nodePrice || funnelSettings.price || '$97'}</span>
            </div>
            
            {parsed.whatYouGet.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {parsed.whatYouGet.slice(0, 5).map((b, i) => (
                  <div key={i} className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    {b}
                  </div>
                ))}
              </div>
            )}
            
            {parsed.guarantee && (
              <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-100 flex items-start">
                <Shield className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <strong>Guarantee.</strong> {parsed.guarantee}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment Info</h2>
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" value="customer@example.com" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Card Information</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between text-gray-400">
                  <span>•••• •••• •••• 4242</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-md mt-6" style={{ backgroundColor: color }}>
                {displayCta}
              </button>
              
              {parsed.trust && (
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" /> {parsed.trust}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ================================================================
    // ORDER BUMP
    // ================================================================
    if (previewTemplate === 'checkbox_bump' || previewTemplate === 'bonus_box' || previewTemplate === 'cheat_sheet') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="border border-gray-200 bg-white shadow-sm p-6 rounded-xl space-y-4">
            <div className="flex items-start">
              <input type="checkbox" checked readOnly className="mt-1 w-5 h-5 text-emerald-600 rounded" />
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  {displayHeadline}
                  <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">+ {nodePrice || '$7'}</span>
                </h3>
                <p className="text-gray-600 mt-2">{displaySub || parsed.paragraphs[0] || ''}</p>
                {displayBullets.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {displayBullets.slice(0, 4).map((b, i) => (
                      <div key={i} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
                {parsed.priceJustification && (
                  <p className="text-xs text-gray-500 mt-3 italic">{parsed.priceJustification}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ================================================================
    // UPSELL / DOWNSELL
    // ================================================================
    if (previewTemplate === 'upgrade_offer' || previewTemplate === 'lite_version') {
      return (
        <div className="max-w-3xl mx-auto text-center space-y-8 pt-8">
          <div className="inline-block px-4 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full mb-4">
            {previewTemplate === 'upgrade_offer' ? 'One-Time Upgrade Offer' : 'Wait — Simpler Option Available'}
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
          <p className="text-xl text-gray-600">{displaySub}</p>

          {parsed.whyNow && (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{parsed.whyNow}</p>
          )}

          {parsed.whatChanged && (
            <p className="text-gray-600 max-w-2xl mx-auto italic">{parsed.whatChanged}</p>
          )}
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8 space-y-6 text-left">
            {parsed.whatYouGet.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-gray-900 text-center">What&#39;s Included</h3>
                <div className="space-y-3">
                  {parsed.whatYouGet.map((b, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-800">{b}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {parsed.benefits.length > 0 && parsed.whatYouGet.length === 0 && (
              <div className="space-y-3">
                {parsed.benefits.map((b, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 space-y-4 flex flex-col items-center">
            {renderButton(displayCta, color)}
            <button className="text-sm text-gray-400 hover:text-gray-600 underline">
              {parsed.noThanks || 'No thanks, continue to my order.'}
            </button>
          </div>
        </div>
      );
    }

    // ================================================================
    // THANK YOU PAGE
    // ================================================================
    if (previewTemplate === 'simple_confirmation') {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
          <p className="text-xl text-gray-600">{displaySub}</p>
          
          {parsed.confirmation && (
            <p className="text-gray-700 max-w-lg mx-auto">{parsed.confirmation}</p>
          )}

          {parsed.nextSteps.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-2xl text-left space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {parsed.nextSteps.map((step, i) => (
                  <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </div>
          )}

          {parsed.support && (
            <p className="text-sm text-gray-500">{parsed.support}</p>
          )}

          <div className="pt-4">{renderButton(displayCta, color)}</div>
        </div>
      );
    }

    // ================================================================
    // EMAIL SEQUENCE
    // ================================================================
    if (previewTemplate === 'five_day_sequence') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">{displayHeadline}</h1>
          <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
            {(parsed.emails.length > 0 ? parsed.emails : [
              { subject: 'Welcome — Your access is ready', body: 'Thanks for your purchase. Check your inbox for access details.', cta: 'Open Now' },
              { subject: 'Quick tip to get started', body: 'The easiest way to get value right away...', cta: 'Try It' },
              { subject: 'Common mistake to avoid', body: 'Most people make this mistake early on...', cta: 'Learn More' },
            ]).map((email, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-4 border-2 border-white"></div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">Email {i + 1}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Subject: {email.subject}</h3>
                  <p className="text-gray-600 text-sm">{email.body}</p>
                  {email.cta && (
                    <p className="text-blue-600 font-medium text-sm mt-2">CTA: {email.cta}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ================================================================
    // WEBINAR
    // ================================================================
    if (previewTemplate === 'registration_page') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded">Free Training</div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{displayHeadline}</h1>
            <p className="text-lg text-gray-600">{displaySub}</p>
            
            {displayBullets.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-gray-900">What You&#39;ll Learn:</h3>
                {displayBullets.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-80 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 space-y-6 h-fit sticky top-8">
            <h3 className="text-xl font-bold text-center text-gray-900">Reserve Your Spot</h3>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center space-x-2 text-sm text-gray-700">
               <Calendar className="w-4 h-4" />
               <span>Choose a time...</span>
            </div>
            <input type="text" placeholder="First Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" disabled />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" disabled />
            <button className="w-full py-4 rounded-lg font-bold text-white shadow-md" style={{ backgroundColor: color }}>
              {displayCta}
            </button>
          </div>
        </div>
      );
    }

    // ================================================================
    // SURVEY / APPLICATION / BOOKING
    // ================================================================
    if (previewTemplate === 'simple_survey' || previewTemplate === 'simple_application' || previewTemplate === 'calendar_booking') {
      return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{displayHeadline}</h1>
            <p className="text-gray-600">{displaySub}</p>
          </div>
          
          <div className="space-y-6 pt-6">
            {parsed.paragraphs.slice(0, 4).map((p, i) => (
              <div key={i} className="space-y-2">
                <label className="font-medium text-gray-700">{p}</label>
                <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none h-20 bg-gray-50" disabled></textarea>
              </div>
            ))}
            {parsed.paragraphs.length === 0 && (
              <>
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">1. What is your biggest challenge right now?</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none h-20 bg-gray-50" disabled></textarea>
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">2. Where do you want to be in 6 months?</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none h-20 bg-gray-50" disabled></textarea>
                </div>
              </>
            )}
            <button className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-md mt-4" style={{ backgroundColor: color }}>
              {displayCta}
            </button>
          </div>
        </div>
      );
    }

    // ================================================================
    // DEFAULT FALLBACK
    // ================================================================
    return (
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
        <p className="text-xl text-gray-600">{displaySub}</p>
        {displayBullets.length > 0 && (
          <div className="text-left max-w-lg mx-auto space-y-3">
            {displayBullets.map((b, i) => (
              <div key={i} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        )}
        <div className="pt-8">
          {renderButton(displayCta)}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] flex flex-col bg-transparent animate-in fade-in zoom-in duration-200">
        
        {/* Close Button Outside Frame */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Fake Browser Window */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* Browser Chrome */}
          <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 flex-shrink-0">
            <div className="flex space-x-2 mr-6">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 max-w-xl mx-auto bg-white rounded-md h-7 px-3 flex items-center justify-center text-xs text-gray-500 shadow-sm border border-gray-200 font-mono">
              https://yourfunnel.com/{title.toLowerCase().replace(/\s+/g, '-')}
            </div>
            <div className="w-16"></div>
          </div>

          {/* Page Content Area */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="min-h-full px-6 py-12 md:px-12 md:py-16">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
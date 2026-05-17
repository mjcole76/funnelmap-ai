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

  // Parse copy
  let parsedHeadline = nodeHeadline || funnelSettings.productName || 'Amazing Product';
  let parsedSubheadline = '';
  let parsedBullets: string[] = [];
  let parsedButton = nodeButtonText || 'Get Started Now';
  let parsedParagraphs: string[] = [];
  let parsedFaq: { q: string; a: string }[] = [];
  let parsedEmails: { subject: string; body: string }[] = [];

  if (copyData) {
    if (copyData.headline) parsedHeadline = copyData.headline;
    if (copyData.cta || copyData.button) parsedButton = copyData.cta || copyData.button;

    const sections = copyData.sections || [];
    let allText = '';
    
    if (sections.length > 0) {
        sections.forEach((s: any) => {
            allText += `${s.title}\n${s.content}\n\n`;
        });
    } else if (copyData.body) {
        allText = copyData.body;
    }

    const lines = allText.split('\n').map(l => l.trim()).filter(l => l);
    
    let currentFaqQ = '';
    let currentEmailSubject = '';

    lines.forEach(line => {
      if (line.toLowerCase().startsWith('headline:')) {
        parsedHeadline = line.substring(9).trim();
      } else if (line.toLowerCase().startsWith('subheadline:')) {
        parsedSubheadline = line.substring(12).trim();
      } else if (line.startsWith('•') || line.startsWith('- ')) {
        parsedBullets.push(line.substring(line.indexOf(' ') + 1).trim());
      } else if (line.toLowerCase().startsWith('cta:')) {
        parsedButton = line.substring(4).trim();
      } else if (line.toLowerCase().startsWith('q:')) {
        currentFaqQ = line.substring(2).trim();
      } else if (line.toLowerCase().startsWith('a:') && currentFaqQ) {
        parsedFaq.push({ q: currentFaqQ, a: line.substring(2).trim() });
        currentFaqQ = '';
      } else if (line.toLowerCase().match(/^email \d+/i) || line.toLowerCase().startsWith('subject:')) {
        currentEmailSubject = line.replace(/^(email \d+:|subject:)/i, '').trim();
        parsedEmails.push({ subject: currentEmailSubject, body: '' });
      } else {
        if (currentEmailSubject && parsedEmails.length > 0) {
            parsedEmails[parsedEmails.length - 1].body += line + ' ';
        } else {
            parsedParagraphs.push(line);
        }
      }
    });

    if (!parsedSubheadline && parsedParagraphs.length > 0) {
      parsedSubheadline = parsedParagraphs[0];
    }
  }

  const renderContent = () => {
    if (!copyData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
          <p className="mb-4">No copy generated yet.</p>
          <p>Click <strong>"Write"</strong> on the node to generate copy for this page.</p>
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

    // LANDING PAGES
    if (previewTemplate === 'hero_cta') {
      return (
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{parsedHeadline}</h1>
          <p className="text-xl text-gray-600 max-w-2xl">{parsedSubheadline || funnelSettings.problem}</p>
          
          {parsedBullets.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl w-full max-w-lg mx-auto text-left space-y-4">
              {parsedBullets.slice(0, 5).map((bullet, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{bullet}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4">
            {renderButton(parsedButton)}
            <p className="mt-4 text-sm text-gray-400 flex items-center justify-center">
              <Shield className="w-4 h-4 mr-1" /> 100% Secure & Spam-Free
            </p>
          </div>
        </div>
      );
    }

    if (previewTemplate === 'lead_magnet' || previewTemplate === 'split_layout') {
      return (
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{parsedHeadline}</h1>
            <p className="text-lg text-gray-600">{parsedSubheadline}</p>
            {parsedBullets.length > 0 && (
              <div className="space-y-3 pt-2">
                {parsedBullets.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-4">{renderButton(parsedButton)}</div>
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
          <h2 className="text-3xl font-bold text-gray-900">{parsedHeadline}</h2>
          <p className="text-gray-600">{parsedSubheadline}</p>
          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl">
            {(parsedBullets.length > 0 ? parsedBullets : ['Step 1', 'Step 2', 'Step 3']).slice(0, 5).map((b, i) => (
              <div key={i} className="flex items-center">
                <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{b}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-4">
            <input type="email" placeholder="Enter your email address..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" disabled />
            <button className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-md" style={{ backgroundColor: color }}>
              {parsedButton}
            </button>
          </div>
        </div>
      );
    }

    if (previewTemplate === 'video_opt_in') {
      return (
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">{parsedHeadline}</h1>
          <div className="w-full aspect-video bg-gray-900 rounded-xl relative shadow-2xl flex items-center justify-center group overflow-hidden">
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 z-10">
               <Play className="w-8 h-8 text-white ml-1" />
             </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{parsedSubheadline}</p>
          {renderButton(parsedButton)}
        </div>
      );
    }

    // SALES PAGES
    if (previewTemplate === 'classic_long_form') {
      return (
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">{parsedHeadline}</h1>
            <p className="text-2xl text-gray-600 font-light">{parsedSubheadline}</p>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl border border-red-100 space-y-4">
            <h2 className="text-2xl font-bold text-red-900">The Problem</h2>
            <p className="text-red-800 text-lg leading-relaxed">{funnelSettings.problem}</p>
            {parsedParagraphs.slice(0, 2).map((p, i) => (
              <p key={i} className="text-red-800 leading-relaxed">{p}</p>
            ))}
          </div>

          <div className="bg-green-50 p-8 rounded-2xl border border-green-100 space-y-4">
            <h2 className="text-2xl font-bold text-green-900">The Solution</h2>
            <p className="text-green-800 text-lg leading-relaxed">{funnelSettings.goal}</p>
            {parsedParagraphs.slice(2, 4).map((p, i) => (
              <p key={i} className="text-green-800 leading-relaxed">{p}</p>
            ))}
          </div>

          {parsedBullets.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Here's What You Get</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {parsedBullets.map((b, i) => (
                  <div key={i} className="flex p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center p-10 bg-gray-900 rounded-3xl text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl font-bold text-white">Get {funnelSettings.productName} Today</h2>
            <div className="text-5xl font-black text-white">{nodePrice || funnelSettings.price || '$97'}</div>
            {renderButton(parsedButton, color)}
            <div className="flex items-center text-gray-400 text-sm">
              <Shield className="w-4 h-4 mr-2" /> 30-Day Money-Back Guarantee
            </div>
          </div>

          {parsedFaq.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {parsedFaq.map((faq, i) => (
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

    if (previewTemplate === 'short_offer' || previewTemplate === 'stacked_offer' || previewTemplate === 'problem_solution') {
      return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900">{parsedHeadline}</h1>
          <p className="text-xl text-gray-600">{parsedSubheadline}</p>
          
          <div className="py-6 border-y border-gray-100 text-left space-y-4">
            {parsedBullets.slice(0, 4).map((b, i) => (
              <div key={i} className="flex items-center bg-gray-50 p-4 rounded-xl">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-800">{b}</span>
              </div>
            ))}
          </div>

          <div className="text-5xl font-black text-gray-900 py-4">{nodePrice || funnelSettings.price || '$97'}</div>
          {renderButton(parsedButton, color)}
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
              "This completely changed how we handle {funnelSettings.problem}. The results were immediate and massive."
            </p>
            <p className="font-bold text-gray-900 uppercase tracking-widest text-sm">— Happy Customer</p>
          </div>
          
          <div className="bg-gray-50 p-12 rounded-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{parsedHeadline}</h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">{parsedSubheadline}</p>
            <div className="pt-6">{renderButton(parsedButton)}</div>
          </div>
        </div>
      );
    }

    // CHECKOUT PAGES
    if (previewTemplate === 'simple_checkout' || previewTemplate === 'trust_checkout' || previewTemplate === 'two_column') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-6 bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">Order Summary</h2>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-lg">{funnelSettings.productName || 'Product'}</span>
              <span className="font-bold text-lg">{nodePrice || funnelSettings.price || '$97'}</span>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {parsedBullets.slice(0, 3).map((b, i) => (
                <div key={i} className="flex items-start text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  {b}
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-100 flex items-start">
              <Shield className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <p className="text-sm text-green-800">
                <strong>100% Risk-Free Guarantee.</strong> If you aren't completely satisfied, let us know within 30 days for a full refund.
              </p>
            </div>
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
                {parsedButton || 'Complete Order'}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" /> Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ORDER BUMP
    if (previewTemplate === 'checkbox_bump' || previewTemplate === 'bonus_box') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-dashed border-red-400 bg-red-50 p-6 rounded-xl space-y-4">
            <div className="flex items-start">
              <input type="checkbox" checked readOnly className="mt-1 w-5 h-5 text-red-600 rounded" />
              <div className="ml-3">
                <h3 className="text-lg font-bold text-red-900 flex items-center">
                  Yes! Add {parsedHeadline} to my order
                  <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">+ {nodePrice || '$19'}</span>
                </h3>
                <p className="text-red-800 mt-2">{parsedSubheadline || parsedParagraphs[0]}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // UPSELL / DOWNSELL
    if (previewTemplate === 'upgrade_offer' || previewTemplate === 'lite_version') {
      return (
        <div className="max-w-3xl mx-auto text-center space-y-8 pt-8">
          <div className="inline-block px-4 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full mb-4">
            Wait! Your order is not complete yet...
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">{parsedHeadline}</h1>
          <p className="text-xl text-gray-600">{parsedSubheadline}</p>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8 space-y-6 text-left">
            <h3 className="text-xl font-bold text-gray-900 text-center">Special One-Time Offer</h3>
            <div className="space-y-4">
              {parsedBullets.map((b, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 space-y-4 flex flex-col items-center">
            {renderButton(parsedButton, color)}
            <button className="text-sm text-gray-400 hover:text-gray-600 underline">
              No thanks, I'll pass on this huge discount and continue to my order.
            </button>
          </div>
        </div>
      );
    }

    // THANK YOU
    if (previewTemplate === 'simple_confirmation') {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{parsedHeadline || "You're In!"}</h1>
          <p className="text-xl text-gray-600">{parsedSubheadline || "Check your email for access details."}</p>
          
          <div className="bg-gray-50 p-8 rounded-2xl text-left space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Check your inbox for the welcome email</li>
              <li>Whitelist our email address</li>
              <li>Click the link inside to get started</li>
            </ol>
          </div>
        </div>
      );
    }

    // EMAIL SEQUENCE
    if (previewTemplate === 'five_day_sequence') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">{parsedHeadline || 'Email Sequence'}</h1>
          <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
            {(parsedEmails.length > 0 ? parsedEmails : [
              { subject: "Welcome to the club", body: "Here is what to expect..." },
              { subject: "The big secret", body: "Most people fail because..." },
              { subject: "Your next step", body: "Reply and let me know..." }
            ]).map((email, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-4 border-2 border-white"></div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">Email {i + 1}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Subject: {email.subject}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{email.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // WEBINAR
    if (previewTemplate === 'registration_page') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded">Free Masterclass</div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{parsedHeadline}</h1>
            <p className="text-lg text-gray-600">{parsedSubheadline}</p>
            
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-gray-900">What You'll Learn:</h3>
              {parsedBullets.slice(0, 4).map((b, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{b}</span>
                </div>
              ))}
            </div>
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
              {parsedButton}
            </button>
          </div>
        </div>
      );
    }

    // SURVEY / APPLICATION / BOOKING
    if (previewTemplate === 'simple_survey' || previewTemplate === 'simple_application' || previewTemplate === 'calendar_booking') {
      return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{parsedHeadline}</h1>
            <p className="text-gray-600">{parsedSubheadline}</p>
          </div>
          
          <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="font-medium text-gray-700">1. What is your biggest challenge with {funnelSettings.problem}?</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none h-24 bg-gray-50" disabled></textarea>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-gray-700">2. Where do you want to be in 6 months?</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none h-24 bg-gray-50" disabled></textarea>
            </div>
            <button className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-md mt-4" style={{ backgroundColor: color }}>
              {parsedButton}
            </button>
          </div>
        </div>
      );
    }

    // DEFAULT FALLBACK
    return (
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{parsedHeadline}</h1>
        <p className="text-xl text-gray-600">{parsedSubheadline}</p>
        <div className="pt-8">
          {renderButton(parsedButton)}
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
            <div className="w-16"></div> {/* Spacer to balance dots */}
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

'use client';
import React, { useEffect, useState } from 'react';
import { X, Check, Shield, Lock, Play, Star, Calendar, Zap, ChevronRight, ArrowRight } from 'lucide-react';
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

function parseCopyContent(copyData: any): ParsedSections {
  const result: ParsedSections = {
    headline: '', subheadline: '', bullets: [], cta: '', trust: '',
    paragraphs: [], problem: [], promise: [], whatYouGet: [], benefits: [],
    whoFor: [], whoNotFor: [], guarantee: '', faq: [], emails: [],
    whyNow: '', whatChanged: '', nextSteps: [], noThanks: '',
    openingHook: [], confirmation: '', support: '', priceJustification: '',
  };
  if (!copyData) return result;
  if (copyData.headline) result.headline = copyData.headline;
  if (copyData.cta || copyData.button) result.cta = copyData.cta || copyData.button;

  const sections = copyData.sections || [];
  let allText = '';
  if (sections.length > 0) {
    sections.forEach((s: any) => { allText += `${s.content}\n\n`; });
  } else if (copyData.body) {
    allText = copyData.body;
  }
  if (!allText.trim()) return result;

  const lines = allText.split('\n');
  type SK = 'subheadline'|'opening_hook'|'problem'|'promise'|'what_you_get'|'benefits'|'who_for'|'who_not_for'|'guarantee'|'faq'|'cta'|'trust'|'why_now'|'what_changed'|'next_steps'|'no_thanks'|'confirmation'|'support'|'price_justification'|'included'|'email'|'general';
  let cur: SK = 'general';
  let faqQ = '';
  let emailIdx = -1;

  const smap: Record<string, SK> = {
    'subheadline':'subheadline','sub headline':'subheadline','opening hook':'opening_hook',
    'problem':'problem','the problem':'problem',
    'promise':'promise','the solution':'promise',
    'what you get':'what_you_get',"what's included":'included','included':'included',
    'benefits':'benefits','key benefits':'benefits','benefit bullets':'benefits',
    "who it's for":'who_for','who it is for':'who_for','who should book':'who_for',
    "who it's not for":'who_not_for','who it is not for':'who_not_for',
    'guarantee':'guarantee','faq':'faq','frequently asked questions':'faq',
    'cta':'cta','trust':'trust','trust copy':'trust',
    'why now':'why_now','what changed':'what_changed',
    'next steps':'next_steps','no-thanks':'no_thanks','no thanks':'no_thanks',
    'confirmation':'confirmation','support':'support','support note':'support',
    'price justification':'price_justification','price':'price_justification',
    'order summary':'what_you_get',"what you'll learn":'benefits',"what's inside":'what_you_get',
    'resource':'general','video promise':'general','preparation':'general',
    'qualification':'general','questions':'general','intro':'general',
    'payment':'general','product summary':'general',
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const hm = t.match(/^([A-Za-z\s'\u2019\u2018]+):(.*)$/);
    if (hm) {
      const k = hm[1].toLowerCase().replace(/[\u2019\u2018'']/g, "'").trim();
      const v = hm[2].trim();
      if (smap[k] !== undefined) { cur = smap[k]; if (v) proc(v, cur); continue; }
    }
    const em = t.match(/^Email \d+\s*[\u2014\u2013\-]\s*(.+?)(?:\s*\(Day \d+\))?$/i);
    if (em) { cur = 'email'; emailIdx++; result.emails.push({subject:'',body:'',cta:''}); continue; }
    if (cur === 'email') {
      if (t.toLowerCase().startsWith('subject:')) { if (result.emails[emailIdx]) result.emails[emailIdx].subject = t.substring(8).trim(); continue; }
      if (t.toLowerCase().startsWith('body:')) { if (result.emails[emailIdx]) result.emails[emailIdx].body = t.substring(5).trim(); continue; }
      if (t.toLowerCase().startsWith('cta:')) { if (result.emails[emailIdx]) result.emails[emailIdx].cta = t.substring(4).trim(); continue; }
    }
    if (cur === 'faq') {
      if (t.startsWith('Q:')||t.startsWith('q:')) { faqQ = t.substring(2).trim(); }
      else if ((t.startsWith('A:')||t.startsWith('a:')) && faqQ) { result.faq.push({q:faqQ, a:t.substring(2).trim()}); faqQ=''; }
      continue;
    }
    proc(t, cur);
  }

  function proc(text: string, section: SK) {
    const isB = /^[\u2022\-\u2713\u2610\u2705\u2605]/.test(text);
    const bText = isB ? text.replace(/^[\u2022\-\u2713\u2610\u2705\u2605]\s*/, '').trim() : text;
    switch(section) {
      case 'subheadline': result.subheadline += (result.subheadline?' ':'')+text; break;
      case 'opening_hook': result.openingHook.push(text); break;
      case 'problem': result.problem.push(isB?bText:text); break;
      case 'promise': result.promise.push(isB?bText:text); break;
      case 'what_you_get': case 'included': result.whatYouGet.push(isB?bText:text); break;
      case 'benefits': result.benefits.push(isB?bText:text); break;
      case 'who_for': result.whoFor.push(isB?bText:text); break;
      case 'who_not_for': result.whoNotFor.push(isB?bText:text); break;
      case 'guarantee': result.guarantee+=(result.guarantee?' ':'')+text; break;
      case 'cta': if(!result.cta) result.cta=text; break;
      case 'trust': result.trust+=(result.trust?' ':'')+text; break;
      case 'why_now': result.whyNow+=(result.whyNow?' ':'')+text; break;
      case 'what_changed': result.whatChanged+=(result.whatChanged?' ':'')+text; break;
      case 'next_steps': result.nextSteps.push(text); break;
      case 'no_thanks': result.noThanks=text; break;
      case 'confirmation': result.confirmation+=(result.confirmation?' ':'')+text; break;
      case 'support': result.support+=(result.support?' ':'')+text; break;
      case 'price_justification': result.priceJustification+=(result.priceJustification?' ':'')+text; break;
      default:
        if(isB) result.bullets.push(bText);
        else if(text.toLowerCase().startsWith('cta:')) result.cta=text.substring(4).trim();
        else if(text.toLowerCase().startsWith('trust:')) result.trust=text.substring(6).trim();
        else if(text.toLowerCase().startsWith('guarantee:')) result.guarantee=text.substring(10).trim();
        else if(text.toLowerCase().startsWith('no-thanks:')) result.noThanks=text.substring(10).trim();
        else result.paragraphs.push(text);
        break;
    }
  }
  if (!result.subheadline && result.paragraphs.length > 0) result.subheadline = result.paragraphs.shift() || '';
  return result;
}

export default function PagePreview({ isOpen, onClose, nodeId, stepType, title, previewTemplate, headline: nodeHeadline, buttonText: nodeButtonText, price: nodePrice, funnelSettings }: PagePreviewProps) {
  const [copyData, setCopyData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`funnel-copy-${nodeId}`);
      if (saved) { try { setCopyData(JSON.parse(saved)); } catch { setCopyData(null); } }
      else setCopyData(null);
    }
  }, [isOpen, nodeId]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stepInfo = STEP_TYPES.find((s) => s.type === stepType) || STEP_TYPES[7];
  const color = stepInfo.color;
  const parsed = parseCopyContent(copyData);
  const hasCopy = copyData && parsed.headline && !parsed.headline.toLowerCase().includes('set up your offer');
  const displayHeadline = hasCopy ? parsed.headline : (nodeHeadline || `Get ${funnelSettings.productName || 'Your Product'} Today`);
  const displaySub = parsed.subheadline || '';
  const displayCta = parsed.cta || nodeButtonText || 'Get Started Now';
  const allBullets = [...parsed.bullets, ...parsed.benefits, ...parsed.whatYouGet];
  const productName = funnelSettings.productName || 'Your Product';
  const audience = funnelSettings.audience || 'your customers';
  const price = nodePrice || funnelSettings.price || '$29';

  const Btn = ({ text, c, xl }: { text: string; c?: string; xl?: boolean }) => (
    <button className={`px-8 ${xl ? 'py-5 text-xl' : 'py-4 text-lg'} rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] transition-transform`} style={{ backgroundColor: c || color }}>{text}</button>
  );

  const renderContent = () => {
    // ═══════════════ EMPTY STATE ═══════════════
    if (!hasCopy) {
      return (
        <div className="space-y-0">
          <div className="-mt-12 -mx-6 md:-mx-12 px-6 md:px-12 pt-20 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{displayHeadline}</h1>
              <p className="text-xl text-slate-300">{funnelSettings.goal || `Built for ${audience}`}</p>
              <div className="pt-4 opacity-60"><Btn text={nodeButtonText || 'Get Started'} xl /></div>
            </div>
          </div>
          <div className="max-w-lg mx-auto py-12">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p className="font-semibold text-amber-900">⚡ Copy not generated yet</p>
              <p className="mt-2 text-sm text-amber-700">Click <strong>&quot;Write Full Funnel&quot;</strong> or the <strong>✍️ Write</strong> button on this node to generate real copy.</p>
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ LANDING: hero_cta ═══════════════
    if (previewTemplate === 'hero_cta') {
      return (
        <div className="space-y-0">
          <div className="-mt-12 -mx-6 md:-mx-12 px-6 md:px-12 pt-20 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',backgroundSize:'32px 32px'}}></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-blue-200 font-medium">Free guide for {audience}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{displayHeadline}</h1>
              {displaySub && <p className="text-xl text-slate-300 max-w-2xl mx-auto">{displaySub}</p>}
              <div className="pt-6"><Btn text={displayCta} xl /></div>
              {parsed.trust && <p className="text-sm text-slate-400 pt-3 flex items-center justify-center"><Shield className="w-4 h-4 mr-2" />{parsed.trust}</p>}
            </div>
          </div>
          <div className="py-16 flex justify-center">
            <div className="relative">
              <div className="w-56 h-72 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 text-center transform -rotate-2 hover:rotate-0 transition-transform">
                <Zap className="w-10 h-10 text-white/80 mb-4" />
                <h3 className="font-bold text-white text-lg mb-2">{productName}</h3>
                <p className="text-blue-200 text-sm">Free Guide</p>
              </div>
            </div>
          </div>
          {allBullets.length > 0 && (
            <div className="py-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What You Will Learn</h2>
              <div className="space-y-4">
                {allBullets.slice(0, 6).map((b, i) => (
                  <div key={i} className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0 mt-0.5"><Check className="w-4 h-4 text-green-600" /></div>
                    <span className="text-gray-800 text-lg">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-14 bg-gray-50 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Get the guide before your next stop.</h2>
            <Btn text={displayCta} />
          </div>
        </div>
      );
    }

    // ═══════════════ LANDING: lead_magnet / split_layout ═══════════════
    if (previewTemplate === 'lead_magnet' || previewTemplate === 'split_layout') {
      return (
        <div className="flex flex-col md:flex-row gap-12 items-center py-8">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">Free Download</div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{displayHeadline}</h1>
            <p className="text-lg text-gray-600">{displaySub}</p>
            {allBullets.length > 0 && (
              <div className="space-y-3 pt-2">
                {allBullets.slice(0, 5).map((b, i) => (
                  <div key={i} className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{b}</span></div>
                ))}
              </div>
            )}
            <div className="pt-4"><Btn text={displayCta} /></div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="w-56 h-72 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 text-center transform -rotate-2">
              <Zap className="w-10 h-10 text-white/80 mb-4" />
              <h3 className="font-bold text-white text-xl mb-2">{productName}</h3>
              <p className="text-blue-200 text-sm">Free Guide</p>
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ LANDING: checklist_opt_in ═══════════════
    if (previewTemplate === 'checklist_opt_in') {
      return (
        <div className="max-w-xl mx-auto py-8">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-10 space-y-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-blue-600" /></div>
            <h2 className="text-3xl font-bold text-gray-900">{displayHeadline}</h2>
            <p className="text-gray-600">{displaySub}</p>
            <div className="space-y-3 text-left bg-gray-50 p-6 rounded-xl">
              {(allBullets.length > 0 ? allBullets : ['Step 1','Step 2','Step 3']).slice(0,5).map((b,i) => (
                <div key={i} className="flex items-center py-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-3 flex-shrink-0 font-bold">{i+1}</div>
                  <span className="text-gray-800 font-medium">{b}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4">
              <input type="email" placeholder="Enter your best email..." className="w-full px-5 py-4 border border-gray-200 rounded-xl outline-none text-lg" disabled />
              <button className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg" style={{backgroundColor:color}}>{displayCta}</button>
              <p className="text-xs text-gray-400">🔒 No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ LANDING: video_opt_in ═══════════════
    if (previewTemplate === 'video_opt_in') {
      return (
        <div className="max-w-4xl mx-auto text-center space-y-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
          <div className="w-full aspect-video bg-gray-900 rounded-2xl relative shadow-2xl flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 z-10 group-hover:scale-110 transition-transform cursor-pointer"><Play className="w-8 h-8 text-white ml-1" /></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{displaySub}</p>
          <Btn text={displayCta} />
        </div>
      );
    }

    // ═══════════════ SALES PAGE: classic_long_form ═══════════════
    if (previewTemplate === 'classic_long_form') {
      return (
        <div className="space-y-0">
          {/* HERO */}
          <div className="-mt-12 -mx-6 md:-mx-12 px-6 md:px-12 pt-20 pb-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',backgroundSize:'40px 40px'}}></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-slate-300 font-medium">For {audience}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">{displayHeadline}</h1>
              {displaySub && <p className="text-xl text-gray-300 max-w-2xl mx-auto">{displaySub}</p>}
              <div className="pt-6"><Btn text={displayCta} xl /></div>
              {parsed.trust && <p className="text-sm text-gray-400 pt-3 flex items-center justify-center"><Lock className="w-3 h-3 mr-1.5" />{parsed.trust}</p>}
            </div>
          </div>

          {/* PRODUCT VISUAL STACK */}
          {parsed.whatYouGet.length > 0 && (
            <div className="py-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Everything Inside</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parsed.whatYouGet.slice(0, 6).map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Zap className="w-5 h-5 text-blue-600" /></div>
                    <p className="font-medium text-gray-900 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPENING HOOK / WHY THIS MATTERS */}
          {parsed.openingHook.length > 0 && (
            <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-16 bg-gray-50">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Why This Matters</h2>
                {parsed.openingHook.map((p, i) => (
                  <p key={i} className="text-lg text-gray-700 leading-relaxed">{p}</p>
                ))}
                {/* Dark callout */}
                {parsed.openingHook.length > 1 && (
                  <div className="bg-gray-900 text-white p-6 rounded-xl mt-6">
                    <p className="text-gray-200 leading-relaxed italic">{parsed.openingHook[parsed.openingHook.length - 1]}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROBLEM */}
          {parsed.problem.length > 0 && (
            <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-16 bg-red-50 border-y border-red-100">
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-red-900">The Problem</h2>
                {parsed.problem.map((p, i) => (
                  <p key={i} className="text-red-800 text-lg leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          )}

          {/* SOLUTION / PROMISE */}
          {parsed.promise.length > 0 && (
            <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-16 bg-emerald-50 border-y border-emerald-100">
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-emerald-900">The Solution</h2>
                {parsed.promise.map((p, i) => (
                  <p key={i} className="text-emerald-800 text-lg leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          )}

          {/* BENEFITS */}
          {parsed.benefits.length > 0 && (
            <div className="py-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Benefits</h2>
              <div className="space-y-4">
                {parsed.benefits.map((b, i) => (
                  <div key={i} className="flex items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Check className="w-5 h-5 text-green-500 mr-4 mt-0.5 flex-shrink-0" /><span className="text-gray-800 text-lg">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOW IT WORKS */}
          <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
              <div className="grid sm:grid-cols-3 gap-8">
                {[{t:'Pick your situation',d:`Choose from common scenarios ${audience} face.`},{t:'Check better options',d:`See quick recommendations and better-choice shortcuts.`},{t:'Choose and keep moving',d:`Make a better decision without overthinking it.`}].map((step, i) => (
                  <div key={i} className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto">{i+1}</div>
                    <h3 className="font-bold text-gray-900">{step.t}</h3>
                    <p className="text-sm text-gray-600">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WHO IT'S FOR */}
          {parsed.whoFor.length > 0 && (
            <div className="py-16 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Who This Is For</h2>
              <div className="space-y-3">
                {parsed.whoFor.map((item, i) => (
                  <div key={i} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" /><span className="text-gray-700 text-lg">{item}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* WHO IT'S NOT FOR */}
          {parsed.whoNotFor.length > 0 && (
            <div className="py-8 max-w-2xl mx-auto border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-500 mb-4">Who This Is NOT For</h2>
              <div className="space-y-2">
                {parsed.whoNotFor.map((item, i) => (
                  <div key={i} className="flex items-start"><X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" /><span className="text-gray-500">{item}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* OFFER BOX + CTA */}
          <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-20 bg-gradient-to-b from-gray-900 to-black text-center">
            <div className="max-w-lg mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white">Get {productName} Today</h2>
              <div className="text-6xl font-black text-white py-4">{price}</div>
              {parsed.whatYouGet.length > 0 && (
                <div className="text-left space-y-2 max-w-sm mx-auto pb-4">
                  {parsed.whatYouGet.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start text-gray-300 text-sm"><Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />{item}</div>
                  ))}
                </div>
              )}
              <Btn text={displayCta} xl />
              {parsed.guarantee && (
                <p className="text-gray-400 text-sm max-w-md mx-auto pt-4 flex items-center justify-center"><Shield className="w-4 h-4 mr-2 flex-shrink-0" />{parsed.guarantee}</p>
              )}
            </div>
          </div>

          {/* FAQ */}
          {parsed.faq.length > 0 && (
            <div className="py-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {parsed.faq.map((f, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                    <p className="text-gray-600">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FINAL CTA */}
          <div className="-mx-6 md:-mx-12 px-6 md:px-12 py-16 bg-gray-50 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Make your next decision easier.</h2>
            <Btn text={displayCta} />
          </div>
        </div>
      );
    }

    // ═══════════════ SALES: short_offer / stacked_offer / problem_solution / proof_first ═══════════════
    if (previewTemplate === 'short_offer' || previewTemplate === 'stacked_offer' || previewTemplate === 'problem_solution' || previewTemplate === 'proof_first') {
      return (
        <div className="max-w-2xl mx-auto space-y-10 py-8">
          {previewTemplate === 'proof_first' && (
            <div className="text-center py-8 border-b border-gray-100">
              <div className="flex justify-center space-x-1 text-yellow-400 mb-4">{[1,2,3,4,5].map(i=><Star key={i} className="w-6 h-6 fill-current" />)}</div>
              <p className="text-2xl font-serif italic text-gray-700 leading-relaxed">&ldquo;{parsed.paragraphs[0] || `This completely changed how I approach ${funnelSettings.problem}.`}&rdquo;</p>
              <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mt-4">&mdash; Verified User</p>
            </div>
          )}
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
            <p className="text-xl text-gray-600">{displaySub}</p>
          </div>
          {previewTemplate === 'problem_solution' && parsed.problem.length > 0 && (
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 space-y-3">
              <h3 className="font-bold text-red-900">The Problem</h3>
              {parsed.problem.map((p, i) => <p key={i} className="text-red-800">{p}</p>)}
            </div>
          )}
          {previewTemplate === 'problem_solution' && parsed.promise.length > 0 && (
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-3">
              <h3 className="font-bold text-emerald-900">The Solution</h3>
              {parsed.promise.map((p, i) => <p key={i} className="text-emerald-800">{p}</p>)}
            </div>
          )}
          {allBullets.length > 0 && (
            <div className="space-y-3">
              {allBullets.slice(0, 8).map((b, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-gray-800 font-medium">{b}</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-center space-y-4 pt-6 pb-4">
            <div className="text-5xl font-black text-gray-900">{price}</div>
            <Btn text={displayCta} xl />
            {parsed.guarantee && <p className="text-sm text-gray-500 mt-4"><Shield className="w-4 h-4 inline mr-1" />{parsed.guarantee}</p>}
          </div>
        </div>
      );
    }

    // ═══════════════ CHECKOUT ═══════════════
    if (previewTemplate === 'simple_checkout' || previewTemplate === 'trust_checkout' || previewTemplate === 'two_column') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start py-8">
          <div className="flex-1 w-full space-y-6 bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">Order Summary</h2>
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="font-semibold text-lg text-gray-900">{productName}</span>
                <p className="text-sm text-gray-500 mt-1">Lifetime Early Access</p>
              </div>
              <span className="font-bold text-xl text-gray-900">{price}</span>
            </div>
            {parsed.whatYouGet.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">What&apos;s Included</p>
                {parsed.whatYouGet.slice(0, 5).map((b, i) => (
                  <div key={i} className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />{b}</div>
                ))}
              </div>
            )}
            {parsed.guarantee && (
              <div className="mt-6 bg-green-50 p-5 rounded-xl border border-green-100 flex items-start">
                <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800"><strong>Guarantee.</strong> {parsed.guarantee}</p>
              </div>
            )}
          </div>
          <div className="flex-1 w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-900">Payment Info</h2><Lock className="w-5 h-5 text-gray-400" /></div>
            <div className="space-y-4">
              <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Email Address</label><input type="email" disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" value="customer@example.com" /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Card Information</label><div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between text-gray-400"><span>•••• •••• •••• 4242</span><div className="flex space-x-1"><div className="w-8 h-5 bg-gray-200 rounded"></div><div className="w-8 h-5 bg-gray-200 rounded"></div></div></div></div>
              <button className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg mt-4" style={{backgroundColor:color}}>{displayCta}</button>
              {parsed.trust && <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center"><Lock className="w-3 h-3 mr-1" />{parsed.trust}</p>}
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ ORDER BUMP ═══════════════
    if (previewTemplate === 'checkbox_bump' || previewTemplate === 'bonus_box' || previewTemplate === 'cheat_sheet') {
      return (
        <div className="max-w-2xl mx-auto py-8">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 text-center">Add This to Your Order</p>
          <div className="border border-amber-200 bg-amber-50/50 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-start">
              <input type="checkbox" checked readOnly className="mt-1.5 w-5 h-5 accent-emerald-600 rounded" />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center flex-wrap gap-2">
                  {displayHeadline}
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs rounded-full font-bold">+ {nodePrice || '$7'}</span>
                </h3>
                <p className="text-gray-600 mt-2">{displaySub || parsed.paragraphs[0] || ''}</p>
                {allBullets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {allBullets.slice(0, 4).map((b, i) => (
                      <div key={i} className="flex items-start text-sm"><Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" /><span className="text-gray-700">{b}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ UPSELL ═══════════════
    if (previewTemplate === 'upgrade_offer') {
      return (
        <div className="max-w-3xl mx-auto text-center space-y-10 py-8">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">Wait — your order is not complete yet</div>
            <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{displaySub}</p>
          </div>

          {/* Product Stack */}
          {parsed.whatYouGet.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
              {parsed.whatYouGet.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <Zap className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" /><span className="text-sm font-medium text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Why Now */}
          {parsed.whyNow && (
            <div className="bg-gray-50 p-6 rounded-xl max-w-xl mx-auto text-left">
              <h3 className="font-bold text-gray-900 mb-2">Why add this now?</h3>
              <p className="text-gray-700">{parsed.whyNow}</p>
            </div>
          )}

          {/* Benefits */}
          {parsed.benefits.length > 0 && (
            <div className="max-w-lg mx-auto text-left space-y-3">
              {parsed.benefits.map((b, i) => (
                <div key={i} className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-800">{b}</span></div>
              ))}
            </div>
          )}

          <div className="pt-4 space-y-4 flex flex-col items-center">
            <Btn text={displayCta} xl />
            <button className="text-sm text-gray-400 hover:text-gray-600 underline">{parsed.noThanks || 'No thanks, continue to my order.'}</button>
          </div>
        </div>
      );
    }

    // ═══════════════ DOWNSELL ═══════════════
    if (previewTemplate === 'lite_version') {
      return (
        <div className="max-w-3xl mx-auto text-center space-y-10 py-8">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">Still want something simpler?</div>
            <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{displaySub}</p>
          </div>

          {parsed.whatChanged && (
            <p className="text-gray-600 max-w-lg mx-auto bg-gray-50 p-4 rounded-lg text-sm">{parsed.whatChanged}</p>
          )}

          {parsed.whatYouGet.length > 0 && (
            <div className="max-w-md mx-auto text-left space-y-3">
              <h3 className="font-bold text-gray-900 text-center mb-4">What&apos;s Included</h3>
              {parsed.whatYouGet.map((item, i) => (
                <div key={i} className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-800">{item}</span></div>
              ))}
            </div>
          )}

          <div className="pt-4 space-y-4 flex flex-col items-center">
            <Btn text={displayCta} />
            <button className="text-sm text-gray-400 hover:text-gray-600 underline">{parsed.noThanks || 'No thanks, continue to my order.'}</button>
          </div>
        </div>
      );
    }

    // ═══════════════ THANK YOU ═══════════════
    if (previewTemplate === 'simple_confirmation') {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto"><Check className="w-12 h-12" /></div>
          <h1 className="text-4xl font-bold text-gray-900">{displayHeadline}</h1>
          <p className="text-xl text-gray-600">{displaySub}</p>
          {parsed.confirmation && <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">{parsed.confirmation}</p>}
          {parsed.nextSteps.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-2xl text-left space-y-4 max-w-lg mx-auto">
              <h3 className="font-bold text-lg text-gray-900">Next Steps:</h3>
              <ol className="space-y-3">
                {parsed.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-3 flex-shrink-0 font-bold mt-0.5">{i+1}</div>
                    <span className="text-gray-700">{s.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {parsed.support && <p className="text-sm text-gray-500">{parsed.support}</p>}
          <Btn text={displayCta} />
        </div>
      );
    }

    // ═══════════════ EMAIL SEQUENCE ═══════════════
    if (previewTemplate === 'five_day_sequence') {
      return (
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">{displayHeadline}</h1>
          <div className="relative border-l-2 border-blue-200 ml-4 space-y-8 pb-4">
            {(parsed.emails.length > 0 ? parsed.emails : [
              {subject:'Welcome — your access is ready',body:'Start here and use it today.',cta:'Open Now'},
              {subject:'Quick tip to try next',body:'The easiest way to get value right away.',cta:'Try It'},
              {subject:'Common mistake to avoid',body:'Most people make this mistake early on.',cta:'Learn More'},
            ]).map((email, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-5 border-2 border-white"></div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Email {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Subject: {email.subject}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{email.body}</p>
                  {email.cta && <p className="text-blue-600 font-medium text-sm mt-3">CTA: {email.cta}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ═══════════════ WEBINAR ═══════════════
    if (previewTemplate === 'registration_page') {
      return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 py-8">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">Free Training</div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{displayHeadline}</h1>
            <p className="text-lg text-gray-600">{displaySub}</p>
            {allBullets.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-gray-900">What You&apos;ll Learn:</h3>
                {allBullets.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" /><span className="text-gray-700">{b}</span></div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-80 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 space-y-5 h-fit">
            <h3 className="text-xl font-bold text-center text-gray-900">Reserve Your Spot</h3>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center space-x-2 text-sm text-gray-600"><Calendar className="w-4 h-4" /><span>Choose a time...</span></div>
            <input type="text" placeholder="First Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" disabled />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" disabled />
            <button className="w-full py-4 rounded-xl font-bold text-white shadow-md" style={{backgroundColor:color}}>{displayCta}</button>
          </div>
        </div>
      );
    }

    // ═══════════════ SURVEY / APPLICATION / BOOKING ═══════════════
    if (previewTemplate === 'simple_survey' || previewTemplate === 'simple_application' || previewTemplate === 'calendar_booking') {
      return (
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{displayHeadline}</h1>
              <p className="text-gray-600">{displaySub}</p>
            </div>
            <div className="space-y-6 pt-4">
              {parsed.paragraphs.length > 0 ? parsed.paragraphs.slice(0, 4).map((p, i) => (
                <div key={i} className="space-y-2">
                  <label className="font-medium text-gray-700">{p}</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20 bg-gray-50" disabled></textarea>
                </div>
              )) : (
                <>
                  <div className="space-y-2"><label className="font-medium text-gray-700">1. What is your biggest challenge?</label><textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20 bg-gray-50" disabled></textarea></div>
                  <div className="space-y-2"><label className="font-medium text-gray-700">2. Where do you want to be in 6 months?</label><textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20 bg-gray-50" disabled></textarea></div>
                </>
              )}
              <button className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-md" style={{backgroundColor:color}}>{displayCta}</button>
            </div>
          </div>
        </div>
      );
    }

    // ═══════════════ DEFAULT FALLBACK ═══════════════
    return (
      <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900">{displayHeadline}</h1>
        <p className="text-xl text-gray-600">{displaySub}</p>
        {allBullets.length > 0 && (
          <div className="text-left max-w-lg mx-auto space-y-3">
            {allBullets.slice(0, 6).map((b, i) => (
              <div key={i} className="flex items-start p-3 bg-gray-50 rounded-xl"><Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-700">{b}</span></div>
            ))}
          </div>
        )}
        <div className="pt-8"><Btn text={displayCta} /></div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-4xl h-[90vh] flex flex-col bg-transparent animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 z-50"><X className="w-6 h-6" /></button>
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Browser Chrome */}
          <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 flex-shrink-0">
            <div className="flex space-x-2 mr-6"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
            <div className="flex-1 max-w-xl mx-auto bg-white rounded-md h-7 px-3 flex items-center justify-center text-xs text-gray-500 shadow-sm border border-gray-200 font-mono">https://yourfunnel.com/{title.toLowerCase().replace(/\s+/g, '-')}</div>
            <div className="w-16"></div>
          </div>
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="min-h-full px-6 py-12 md:px-12 md:py-16">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { X, LayoutTemplate, Save, Trash2, ChevronRight } from 'lucide-react';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: FunnelTemplate) => void;
  currentNodes: any[];
  currentEdges: any[];
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  steps: TemplateStep[];
  edges: TemplateEdge[];
  isBuiltIn?: boolean;
}

interface TemplateStep {
  type: string;
  title: string;
  template: string;
  buttonText?: string;
  relativePosition: { x: number; y: number };
}

interface TemplateEdge {
  sourceIdx: number;
  targetIdx: number;
  label: string;
}

const STORAGE_KEY = 'funnelmap-templates';

const BUILT_IN_TEMPLATES: FunnelTemplate[] = [
  {
    id: 'low-ticket-digital',
    name: 'Low-Ticket Digital Product',
    description: 'Landing → Sales Page → Checkout → Order Bump → Upsell → Downsell → Thank You → Email',
    isBuiltIn: true,
    steps: [
      { type: 'Landing Page', title: 'Free Guide', template: 'hero_cta', relativePosition: { x: 0, y: 0 } },
      { type: 'Sales Page', title: 'Main Offer', template: 'classic_long_form', relativePosition: { x: 320, y: 0 } },
      { type: 'Checkout', title: 'Checkout', template: 'simple_checkout', relativePosition: { x: 640, y: 0 } },
      { type: 'Order Bump', title: 'Quick Add-On', template: 'checkbox_bump', relativePosition: { x: 960, y: 0 } },
      { type: 'Upsell', title: 'Pro Upgrade', template: 'upgrade_offer', relativePosition: { x: 0, y: 300 } },
      { type: 'Downsell', title: 'Lite Version', template: 'lite_version', relativePosition: { x: 320, y: 300 } },
      { type: 'Thank You Page', title: 'Access Your Purchase', template: 'simple_confirmation', relativePosition: { x: 640, y: 300 } },
      { type: 'Email Follow-up', title: 'Follow-Up Sequence', template: 'five_day_sequence', relativePosition: { x: 960, y: 300 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Next' },
      { sourceIdx: 1, targetIdx: 2, label: 'Next' },
      { sourceIdx: 2, targetIdx: 3, label: 'Buys' },
      { sourceIdx: 3, targetIdx: 4, label: 'Next' },
      { sourceIdx: 4, targetIdx: 5, label: 'Declines' },
      { sourceIdx: 5, targetIdx: 6, label: 'Next' },
      { sourceIdx: 6, targetIdx: 7, label: 'Next' },
    ],
  },
  {
    id: 'lead-magnet-offer',
    name: 'Lead Magnet to Offer',
    description: 'Opt-in → Thank You → Email Nurture → Sales Page → Checkout → Thank You',
    isBuiltIn: true,
    steps: [
      { type: 'Landing Page', title: 'Free Download', template: 'checklist_opt_in', relativePosition: { x: 0, y: 0 } },
      { type: 'Thank You Page', title: 'Check Your Email', template: 'simple_confirmation', relativePosition: { x: 320, y: 0 } },
      { type: 'Email Follow-up', title: 'Nurture Sequence', template: 'five_day_sequence', relativePosition: { x: 640, y: 0 } },
      { type: 'Sales Page', title: 'Main Offer', template: 'classic_long_form', relativePosition: { x: 0, y: 300 } },
      { type: 'Checkout', title: 'Checkout', template: 'trust_checkout', relativePosition: { x: 320, y: 300 } },
      { type: 'Thank You Page', title: 'Welcome Aboard', template: 'simple_confirmation', relativePosition: { x: 640, y: 300 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Opts In' },
      { sourceIdx: 1, targetIdx: 2, label: 'Next' },
      { sourceIdx: 2, targetIdx: 3, label: 'Pitch' },
      { sourceIdx: 3, targetIdx: 4, label: 'Buys' },
      { sourceIdx: 4, targetIdx: 5, label: 'Next' },
    ],
  },
  {
    id: 'webinar-funnel',
    name: 'Webinar Funnel',
    description: 'Registration → Thank You → Webinar → Sales Page → Checkout → Upsell → Thank You',
    isBuiltIn: true,
    steps: [
      { type: 'Landing Page', title: 'Register for Training', template: 'hero_cta', relativePosition: { x: 0, y: 0 } },
      { type: 'Webinar', title: 'Free Training', template: 'registration_page', relativePosition: { x: 320, y: 0 } },
      { type: 'Thank You Page', title: 'You Are Registered', template: 'simple_confirmation', relativePosition: { x: 640, y: 0 } },
      { type: 'Sales Page', title: 'Main Offer', template: 'classic_long_form', relativePosition: { x: 0, y: 300 } },
      { type: 'Checkout', title: 'Checkout', template: 'trust_checkout', relativePosition: { x: 320, y: 300 } },
      { type: 'Upsell', title: 'VIP Upgrade', template: 'upgrade_offer', relativePosition: { x: 640, y: 300 } },
      { type: 'Thank You Page', title: 'Welcome', template: 'simple_confirmation', relativePosition: { x: 960, y: 300 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Registers' },
      { sourceIdx: 1, targetIdx: 2, label: 'Confirms' },
      { sourceIdx: 2, targetIdx: 3, label: 'Attends' },
      { sourceIdx: 3, targetIdx: 4, label: 'Buys' },
      { sourceIdx: 4, targetIdx: 5, label: 'Next' },
      { sourceIdx: 5, targetIdx: 6, label: 'Next' },
    ],
  },
  {
    id: 'application-funnel',
    name: 'Application Funnel',
    description: 'Landing → Application → Booking → Thank You → Email',
    isBuiltIn: true,
    steps: [
      { type: 'Landing Page', title: 'Learn More', template: 'hero_cta', relativePosition: { x: 0, y: 0 } },
      { type: 'Application Page', title: 'Apply Now', template: 'simple_application', relativePosition: { x: 320, y: 0 } },
      { type: 'Booking Page', title: 'Book Your Call', template: 'calendar_booking', relativePosition: { x: 640, y: 0 } },
      { type: 'Thank You Page', title: 'You Are Booked', template: 'simple_confirmation', relativePosition: { x: 960, y: 0 } },
      { type: 'Email Follow-up', title: 'Pre-Call Sequence', template: 'five_day_sequence', relativePosition: { x: 0, y: 300 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Applies' },
      { sourceIdx: 1, targetIdx: 2, label: 'Approved' },
      { sourceIdx: 2, targetIdx: 3, label: 'Books' },
      { sourceIdx: 3, targetIdx: 4, label: 'Next' },
    ],
  },
  {
    id: 'simple-checkout',
    name: 'Simple Checkout Funnel',
    description: 'Sales Page → Checkout → Thank You',
    isBuiltIn: true,
    steps: [
      { type: 'Sales Page', title: 'Product Page', template: 'classic_long_form', relativePosition: { x: 0, y: 0 } },
      { type: 'Checkout', title: 'Checkout', template: 'simple_checkout', relativePosition: { x: 320, y: 0 } },
      { type: 'Thank You Page', title: 'Order Confirmed', template: 'simple_confirmation', relativePosition: { x: 640, y: 0 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Buys' },
      { sourceIdx: 1, targetIdx: 2, label: 'Next' },
    ],
  },
  {
    id: 'upsell-downsell',
    name: 'Upsell / Downsell Funnel',
    description: 'Checkout → Order Bump → Upsell → Downsell → Thank You',
    isBuiltIn: true,
    steps: [
      { type: 'Checkout', title: 'Checkout', template: 'trust_checkout', relativePosition: { x: 0, y: 0 } },
      { type: 'Order Bump', title: 'Add-On', template: 'checkbox_bump', relativePosition: { x: 320, y: 0 } },
      { type: 'Upsell', title: 'Pro Upgrade', template: 'upgrade_offer', relativePosition: { x: 640, y: 0 } },
      { type: 'Downsell', title: 'Basic Version', template: 'lite_version', relativePosition: { x: 0, y: 300 } },
      { type: 'Thank You Page', title: 'Order Complete', template: 'simple_confirmation', relativePosition: { x: 320, y: 300 } },
    ],
    edges: [
      { sourceIdx: 0, targetIdx: 1, label: 'Buys' },
      { sourceIdx: 1, targetIdx: 2, label: 'Next' },
      { sourceIdx: 2, targetIdx: 3, label: 'Declines' },
      { sourceIdx: 2, targetIdx: 4, label: 'Accepts' },
      { sourceIdx: 3, targetIdx: 4, label: 'Next' },
    ],
  },
];

export default function TemplateLibrary({ isOpen, onClose, onLoadTemplate, currentNodes, currentEdges }: TemplateLibraryProps) {
  const [userTemplates, setUserTemplates] = useState<FunnelTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [includeCopy, setIncludeCopy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { try { setUserTemplates(JSON.parse(saved)); } catch { /* */ } }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allTemplates = [...BUILT_IN_TEMPLATES, ...userTemplates];

  const handleSaveCurrentAsTemplate = () => {
    if (!saveName.trim() || currentNodes.length === 0) return;

    const newTemplate: FunnelTemplate = {
      id: `user-${Date.now()}`,
      name: saveName.trim(),
      description: currentNodes.map(n => n.data.type).join(' → '),
      steps: currentNodes.map(n => ({
        type: n.data.type as string,
        title: n.data.title as string,
        template: (n.data.previewTemplate as string) || 'hero_cta',
        buttonText: n.data.buttonText as string,
        relativePosition: n.position,
      })),
      edges: currentEdges.map(e => ({
        sourceIdx: currentNodes.findIndex(n => n.id === e.source),
        targetIdx: currentNodes.findIndex(n => n.id === e.target),
        label: (e.label as string) || 'Next',
      })).filter(e => e.sourceIdx >= 0 && e.targetIdx >= 0),
    };

    const updated = [...userTemplates, newTemplate];
    setUserTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowSaveDialog(false);
    setSaveName('');
  };

  const handleDeleteUserTemplate = (id: string) => {
    const updated = userTemplates.filter(t => t.id !== id);
    setUserTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Template Library</h2>
          </div>
          <div className="flex items-center space-x-2">
            {currentNodes.length > 0 && (
              <button onClick={() => setShowSaveDialog(true)} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="w-3.5 h-3.5 mr-1.5" />Save Current
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200 space-y-3">
            <h3 className="font-semibold text-sm text-blue-900">Save Current Funnel as Template</h3>
            <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Template name..." className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-copy" checked={includeCopy} onChange={(e) => setIncludeCopy(e.target.checked)} className="rounded" />
              <label htmlFor="include-copy" className="text-sm text-blue-800">Include generated copy</label>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleSaveCurrentAsTemplate} disabled={!saveName.trim()} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
              <button onClick={() => { setShowSaveDialog(false); setSaveName(''); }} className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Built-in */}
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Built-In Templates</h3>
          <div className="space-y-2 mb-6">
            {BUILT_IN_TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { onLoadTemplate(t); onClose(); }} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-200 transition-colors text-left group">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-blue-200">
                  <LayoutTemplate className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{t.description}</p>
                </div>
                <div className="flex items-center text-xs text-gray-400 ml-2 flex-shrink-0">
                  <span>{t.steps.length} steps</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:text-blue-600" />
                </div>
              </button>
            ))}
          </div>

          {/* User Templates */}
          {userTemplates.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Your Templates</h3>
              <div className="space-y-2">
                {userTemplates.map(t => (
                  <div key={t.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <button onClick={() => { onLoadTemplate(t); onClose(); }} className="flex-1 flex items-center text-left">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <LayoutTemplate className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{t.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 mx-2">{t.steps.length} steps</span>
                    </button>
                    <button onClick={() => handleDeleteUserTemplate(t.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">Loading a template will replace your current canvas</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { LayoutTemplate, CheckCircle2, Cloud, CloudOff, Play, Globe, Trash, Wand2, X, Download, Settings, LayoutGrid, RefreshCcw, ClipboardCheck, Library } from 'lucide-react';
import { FunnelContext } from '../lib/copyTemplates';

interface HeaderProps {
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onPreview: () => void;
  isPublished: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onClearAll: () => void;
  onGenerate: (data: any) => void;
  funnelContext: FunnelContext | null;
  setFunnelContext: (context: FunnelContext) => void;
  onExportFunnel: () => void;
  onAutoArrange?: () => void;
  onResetLayout?: () => void;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (isOpen: boolean) => void;
  onWriteFullFunnel?: () => void;
  isGeneratingFullCopy?: boolean;
  onOpenQualityReport?: () => void;
  onOpenTemplateLibrary?: () => void;
}

export default function Header({ 
  saveStatus, 
  onPreview, 
  isPublished, 
  onPublish, 
  onUnpublish, 
  onClearAll, 
  onGenerate, 
  funnelContext, 
  setFunnelContext, 
  onExportFunnel,
  onAutoArrange,
  onResetLayout,
  isSettingsOpen = false,
  setIsSettingsOpen,
  onWriteFullFunnel,
  isGeneratingFullCopy,
  onOpenQualityReport,
  onOpenTemplateLibrary
}: HeaderProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSettingsModalLocal, setShowSettingsModalLocal] = useState(false);
  const [showStylePickerModal, setShowStylePickerModal] = useState(false);
  
  const showSettingsModal = setIsSettingsOpen ? isSettingsOpen : showSettingsModalLocal;
  const setShowSettingsModal = setIsSettingsOpen ? setIsSettingsOpen : setShowSettingsModalLocal;

  const PAGE_STYLES = [
    {
      id: 'Bold Direct Response',
      name: 'Bold Direct Response',
      bestFor: 'Low-ticket digital offers and sprint products.',
      sections: 'Hero, product stack, proof block, offer box, FAQ, guarantee.'
    },
    {
      id: 'Clean SaaS',
      name: 'Clean SaaS',
      bestFor: 'Software tools and AI apps.',
      sections: 'Hero, app mockup, features, workflow, pricing, FAQ.'
    },
    {
      id: 'Editorial Letter',
      name: 'Editorial Letter',
      bestFor: 'Info products, coaching, newsletter-style offers.',
      sections: 'Personal opening, problem story, new mechanism, offer card, FAQ.'
    },
    {
      id: 'Compact Tripwire',
      name: 'Compact Tripwire',
      bestFor: '$7 to $27 offers, quick downloads, beta access.',
      sections: 'Hero with price, quick benefits, offer stack, guarantee, FAQ.'
    },
    {
      id: 'Premium Minimal',
      name: 'Premium Minimal',
      bestFor: 'Higher-ticket simple offers, consulting, service packages.',
      sections: 'Clean hero, outcome, framework, pricing, FAQ.'
    }
  ];

  const [formData, setFormData] = useState({
    funnelName: 'My Funnel',
    productName: '',
    audience: '',
    price: '',
    problem: '',
    goal: 'Sell product',
    offerType: 'Low-ticket ($7-$47)',
    pageStyle: 'Bold Direct Response',
    desiredOutcome: '',
    whatsIncluded: '',
    whyNow: '',
    trafficSource: '',
    buyerObjection: '',
    tone: 'Practical and direct',
  });

  useEffect(() => {
    if (showSettingsModal && funnelContext) {
      setFormData(funnelContext as any);
    }
  }, [showSettingsModal, funnelContext]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setFunnelContext(formData);
    onGenerate(formData);
    setShowGenerateModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFunnelContext(formData);
    setShowSettingsModal(false);
  };

  const openSettings = () => {
    if (funnelContext) {
      setFormData(funnelContext as any);
    }
    setShowSettingsModal(true);
  };

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">FunnelMap AI</h1>
          
          {funnelContext && funnelContext.productName && (
            <button 
              onClick={openSettings}
              className="ml-4 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center"
              title="Edit Funnel Settings"
            >
              <span className="mr-1.5">📋</span>
              {funnelContext.productName}
              {funnelContext.audience && <span className="mx-1.5 text-gray-400">•</span>}
              {funnelContext.audience}
              {funnelContext.price && <span className="mx-1.5 text-gray-400">•</span>}
              {funnelContext.price}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm text-gray-500">
            {saveStatus === 'saved' && (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Saved ✓
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center text-blue-500">
                <Cloud className="w-4 h-4 mr-1.5 animate-pulse" />
                Saving...
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center">
                <CloudOff className="w-4 h-4 mr-1.5" />
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {onWriteFullFunnel && (
              <button 
                onClick={onWriteFullFunnel}
                disabled={isGeneratingFullCopy}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4 mr-1.5" />
                {isGeneratingFullCopy ? 'Generating...' : 'Write Full Funnel'}
              </button>
            )}

            {onOpenQualityReport && (
              <button 
                onClick={onOpenQualityReport}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                title="Copy Quality Report"
              >
                <ClipboardCheck className="w-4 h-4 mr-1.5" />
                QA
              </button>
            )}

            {onOpenTemplateLibrary && (
              <button 
                onClick={onOpenTemplateLibrary}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                title="Template Library"
              >
                <Library className="w-4 h-4 mr-1.5" />
                Templates
              </button>
            )}

            <button 
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
            >
              <Wand2 className="w-4 h-4 mr-1.5" />
              Generate Funnel
            </button>

            <button 
              onClick={onExportFunnel}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            
            {onAutoArrange && (
              <button 
                onClick={onAutoArrange}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Auto-Arrange Layout"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}

            {onResetLayout && (
              <button 
                onClick={onResetLayout}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Reset Layout"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}
            
            <button 
              onClick={openSettings}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-1.5" />
              Settings
            </button>

            <button 
              onClick={onClearAll}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
              title="Clear Canvas"
            >
              <Trash className="w-4 h-4 mr-1.5" />
            </button>

            <div className="flex rounded-md shadow-sm">
              {!isPublished ? (
                <button 
                  onClick={onPublish}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-1.5" />
                  Publish
                </button>
              ) : (
                <button 
                  onClick={onUnpublish}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Unpublish
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Generate & Settings Modals */}
      {(showGenerateModal || showSettingsModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                {showGenerateModal ? <Wand2 className="w-5 h-5 text-purple-600" /> : <Settings className="w-5 h-5 text-gray-600" />}
                <h2 className="text-lg font-semibold text-gray-900">{showGenerateModal ? 'Generate Funnel' : 'Funnel Settings'}</h2>
              </div>
              <button 
                onClick={() => { setShowGenerateModal(false); setShowSettingsModal(false); }}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={showGenerateModal ? handleGenerate : handleSaveSettings} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* SECTION 1: Basic Offer */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">Basic Offer</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Name</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.funnelName} onChange={(e) => setFormData({...formData, funnelName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} placeholder="e.g. Weekend Faceless Channel Sprint" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} placeholder="e.g. Beginners who want to start a faceless YouTube channel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. $27" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.offerType} onChange={(e) => setFormData({...formData, offerType: e.target.value})}>
                    <option>Low-ticket ($7-$47)</option>
                    <option>Mid-ticket ($47-$297)</option>
                    <option>High-ticket ($297+)</option>
                    <option>Free lead magnet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Goal</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                    <option>Sell product</option>
                    <option>Collect leads</option>
                    <option>Book calls</option>
                    <option>Webinar registration</option>
                  </select>
                </div>
              </div>

              {/* SECTION 2: Copy Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">Copy Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What problem does this solve?</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={2} value={formData.problem} onChange={(e) => setFormData({...formData, problem: e.target.value})} placeholder="Example: Truck drivers waste time guessing what to eat at truck stops and often end up choosing meals that leave them tired." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What result does the buyer want?</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={2} value={formData.desiredOutcome || ''} onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})} placeholder="Example: Find better food options on the road in less time without following a strict diet." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What does the buyer get?</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={3} value={formData.whatsIncluded || ''} onChange={(e) => setFormData({...formData, whatsIncluded: e.target.value})} placeholder="Example: Meal finder tool, road meal guide, fast-food shortcuts, snack swaps, weekly meal ideas." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why would someone want this now?</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={2} value={formData.whyNow || ''} onChange={(e) => setFormData({...formData, whyNow: e.target.value})} placeholder="Example: They are tired of wasting time guessing and want something they can use today." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Where will traffic come from?</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.trafficSource || ''} onChange={(e) => setFormData({...formData, trafficSource: e.target.value})}>
                    <option value="">Select...</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Facebook group</option>
                    <option>Paid ads</option>
                    <option>Email list</option>
                    <option>Organic social</option>
                    <option>Direct link</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What might stop them from buying?</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={2} value={formData.buyerObjection || ''} onChange={(e) => setFormData({...formData, buyerObjection: e.target.value})} placeholder="Example: They may think this is too technical, too basic, or not worth paying for." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Writing Tone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.tone || 'Practical and direct'} onChange={(e) => setFormData({...formData, tone: e.target.value})}>
                    <option>Practical and direct</option>
                    <option>Bold direct-response</option>
                    <option>Friendly and simple</option>
                    <option>Premium and polished</option>
                    <option>Urgent and punchy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Style (Global Funnel Design)</label>
                  <div className="flex space-x-2">
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formData.pageStyle || 'Bold Direct Response'} onChange={(e) => setFormData({...formData, pageStyle: e.target.value})}>
                      {PAGE_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setShowStylePickerModal(true)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium"
                    >
                      Browse Styles
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 pb-2 sticky bottom-0 bg-white border-t border-gray-100 -mx-6 px-6 py-3">
                <button type="button" onClick={() => { setShowGenerateModal(false); setShowSettingsModal(false); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">
                  {showGenerateModal ? 'Generate' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Style Picker Modal */}
      {showStylePickerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <LayoutTemplate className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Choose Global Page Style</h2>
              </div>
              <button 
                onClick={() => setShowStylePickerModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAGE_STYLES.map(style => (
                <div 
                  key={style.id} 
                  className={`border rounded-lg p-4 flex flex-col transition-all ${formData.pageStyle === style.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
                >
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{style.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-1"><span className="font-semibold text-gray-700">Best for:</span> {style.bestFor}</p>
                  <div className="bg-gray-100 p-3 rounded-md mb-4 text-xs text-gray-500 border border-gray-200">
                    <span className="font-semibold text-gray-600 block mb-1">Sections:</span>
                    {style.sections}
                  </div>
                  <button 
                    onClick={() => {
                      setFormData({...formData, pageStyle: style.id});
                      setShowStylePickerModal(false);
                    }}
                    className={`w-full py-2 rounded-md font-medium text-sm transition-colors ${formData.pageStyle === style.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {formData.pageStyle === style.id ? 'Selected' : 'Use This Style'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

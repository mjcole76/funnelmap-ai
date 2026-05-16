import React, { useState } from 'react';
import { LayoutTemplate, CheckCircle2, Cloud, CloudOff, Play, Globe, Trash, Wand2, X, Download, Settings } from 'lucide-react';
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
}

export default function Header({ saveStatus, onPreview, isPublished, onPublish, onUnpublish, onClearAll, onGenerate, funnelContext, setFunnelContext, onExportFunnel }: HeaderProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [formData, setFormData] = useState({
    funnelName: 'My Funnel',
    productName: '',
    audience: '',
    price: '',
    problem: 'low conversions',
    goal: 'Sell product',
    offerType: 'Low-ticket ($7-$47)'
  });

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
              Export Funnel
            </button>
            
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
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
            
            <form onSubmit={showGenerateModal ? handleGenerate : handleSaveSettings} className="p-6 space-y-4 h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.funnelName}
                  onChange={(e) => setFormData({...formData, funnelName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="e.g. AI Content Creator"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.audience}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  placeholder="e.g. Digital Marketers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. $47"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Problem</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  placeholder="e.g. low conversions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Goal</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                >
                  <option>Sell product</option>
                  <option>Collect leads</option>
                  <option>Book calls</option>
                  <option>Webinar registration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.offerType}
                  onChange={(e) => setFormData({...formData, offerType: e.target.value})}
                >
                  <option>Low-ticket ($7-$47)</option>
                  <option>Mid-ticket ($47-$297)</option>
                  <option>High-ticket ($297+)</option>
                  <option>Free lead magnet</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 pb-2">
                <button 
                  type="button"
                  onClick={() => { setShowGenerateModal(false); setShowSettingsModal(false); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {showGenerateModal ? 'Generate' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

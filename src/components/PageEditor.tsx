'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCcw, Undo2, Eye, Wand2 } from 'lucide-react';

interface PageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeTitle: string;
  stepType: string;
  copyData: any;
  onSave: (nodeId: string, copyData: any) => void;
  onRegenerate: (nodeId: string) => void;
  onPreview: (nodeId: string) => void;
}

export default function PageEditor({ isOpen, onClose, nodeId, nodeTitle, stepType, copyData, onSave, onRegenerate, onPreview }: PageEditorProps) {
  const [editData, setEditData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (copyData && isOpen) {
      const clone = JSON.parse(JSON.stringify(copyData));
      setEditData(clone);
      setOriginalData(JSON.parse(JSON.stringify(copyData)));
      setHasChanges(false);
    }
  }, [copyData, isOpen]);

  if (!isOpen || !editData) return null;

  const handleHeadlineChange = (value: string) => {
    setEditData({ ...editData, headline: value });
    setHasChanges(true);
  };

  const handleCtaChange = (value: string) => {
    setEditData({ ...editData, cta: value });
    setHasChanges(true);
  };

  const handleSectionTitleChange = (idx: number, value: string) => {
    const sections = [...(editData.sections || [])];
    sections[idx] = { ...sections[idx], title: value };
    setEditData({ ...editData, sections });
    setHasChanges(true);
  };

  const handleSectionContentChange = (idx: number, value: string) => {
    const sections = [...(editData.sections || [])];
    sections[idx] = { ...sections[idx], content: value };
    setEditData({ ...editData, sections });
    setHasChanges(true);
  };

  const handleRemoveSection = (idx: number) => {
    const sections = (editData.sections || []).filter((_: any, i: number) => i !== idx);
    setEditData({ ...editData, sections });
    setHasChanges(true);
  };

  const handleAddSection = () => {
    const sections = [...(editData.sections || []), { title: 'New Section', content: 'Add your content here.' }];
    setEditData({ ...editData, sections });
    setHasChanges(true);
  };

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const sections = [...(editData.sections || [])];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    [sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]];
    setEditData({ ...editData, sections });
    setHasChanges(true);
  };

  const handleUndo = () => {
    setEditData(JSON.parse(JSON.stringify(originalData)));
    setHasChanges(false);
  };

  const handleSave = () => {
    onSave(nodeId, editData);
    setOriginalData(JSON.parse(JSON.stringify(editData)));
    setHasChanges(false);
  };

  const handleRegenerate = () => {
    onRegenerate(nodeId);
    onClose();
  };

  const wordCount = (() => {
    const text = `${editData.headline || ''} ${(editData.sections || []).map((s: any) => `${s.title} ${s.content}`).join(' ')}`;
    return text.split(/\s+/).filter(Boolean).length;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              ✏️ Edit Page Copy
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{nodeTitle} • {stepType} • {wordCount} words</p>
          </div>
          <div className="flex items-center space-x-2">
            {hasChanges && <span className="text-xs text-amber-600 font-medium px-2 py-0.5 bg-amber-50 rounded-full">Unsaved</span>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={!hasChanges}
              className="flex items-center text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-40"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1.5" />Undo All
            </button>
            <button
              onClick={handleRegenerate}
              className="flex items-center text-xs px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />Regenerate
            </button>
            <button
              onClick={() => onPreview(nodeId)}
              className="flex items-center text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />Preview
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center text-xs px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />Save Changes
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Headline */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Headline</label>
            <input
              type="text"
              value={editData.headline || ''}
              onChange={(e) => handleHeadlineChange(e.target.value)}
              className="w-full mt-2 px-4 py-3 text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Your main headline..."
            />
          </div>

          {/* CTA */}
          {editData.cta !== undefined && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">CTA Button Text</label>
              <input
                type="text"
                value={editData.cta || ''}
                onChange={(e) => handleCtaChange(e.target.value)}
                className="w-full mt-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Get Started Now..."
              />
            </div>
          )}

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Page Sections</label>
              <button
                onClick={handleAddSection}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4">
              {(editData.sections || []).map((section: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  {/* Section header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => handleSectionTitleChange(idx, e.target.value)}
                      className="flex-1 text-sm font-semibold bg-transparent border-none focus:outline-none"
                      placeholder="Section title..."
                    />
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >↑</button>
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === (editData.sections || []).length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move down"
                      >↓</button>
                      <button
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1 text-gray-400 hover:text-red-500"
                        title="Remove section"
                      >×</button>
                    </div>
                  </div>
                  {/* Section content */}
                  <textarea
                    value={section.content || ''}
                    onChange={(e) => handleSectionContentChange(idx, e.target.value)}
                    rows={Math.max(4, (section.content || '').split('\n').length + 1)}
                    className="w-full px-4 py-3 text-sm border-none focus:outline-none focus:ring-0 resize-none leading-relaxed"
                    placeholder="Section content..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">Edit your copy directly. Changes are saved to this page only.</p>
          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-40"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

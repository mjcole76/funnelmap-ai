import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Save, Copy, Download } from 'lucide-react';
import { STEP_TYPES } from './Sidebar';
import { Node } from '@xyflow/react';

interface CopyPanelProps {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, copyData: any) => void;
  generatedCopy: any;
  onRegenerate: () => void;
}

export default function CopyPanel({ node, onClose, onSave, generatedCopy, onRegenerate }: CopyPanelProps) {
  const [copyData, setCopyData] = useState<any>(null);

  useEffect(() => {
    if (generatedCopy) {
      setCopyData(JSON.parse(JSON.stringify(generatedCopy)));
    }
  }, [generatedCopy]);

  if (!node || !copyData) return null;

  const stepInfo = STEP_TYPES.find(s => s.type === node.data.type) || STEP_TYPES[7];

  const handleCopyClipboard = () => {
    let text = `# ${copyData.headline}\n\n`;
    copyData.sections.forEach((s: any) => {
      text += `## ${s.title}\n${s.content}\n\n`;
    });
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleExportMarkdown = () => {
    let text = `# ${copyData.headline}\n\n`;
    copyData.sections.forEach((s: any) => {
      text += `## ${s.title}\n${s.content}\n\n`;
    });
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(node.data.title as string) || (node.data.type as string)}-copy.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSave(node.id, {
      ...copyData,
      generatedAt: new Date().toISOString()
    });
  };

  const updateSection = (index: number, newContent: string) => {
    const newData = { ...copyData };
    newData.sections[index].content = newContent;
    setCopyData(newData);
  };

  const updateHeadline = (newHeadline: string) => {
    setCopyData({ ...copyData, headline: newHeadline });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-[480px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stepInfo.color }}
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                Copy Preview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{(node.data.title as string) || (node.data.type as string)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={onRegenerate}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Regenerate
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700"
            >
              <Save className="w-3 h-3 mr-1.5" />
              Save to Step
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCopyClipboard}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
              title="Copy to Clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={handleExportMarkdown}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
              title="Export Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Headline</label>
              <textarea
                value={copyData.headline}
                onChange={(e) => updateHeadline(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={2}
              />
            </div>

            {copyData.sections.map((section: any, idx: number) => (
              <div key={idx}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section.title}</label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(idx, e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y min-h-[100px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { LayoutTemplate, CheckCircle2, Cloud, CloudOff, Play, Globe, Trash } from 'lucide-react';

interface HeaderProps {
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onPreview: () => void;
  isPublished: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onClearAll: () => void;
}

export default function Header({ saveStatus, onPreview, isPublished, onPublish, onUnpublish, onClearAll }: HeaderProps) {
  return (
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

        {isPublished && (
          <div className="text-sm px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors">
            Live at <a href="#" className="underline font-medium">my-funnel.ai/live</a>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button 
            onClick={onClearAll}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
            title="Clear Canvas"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Reset
          </button>

          <button 
            onClick={onPreview}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Play className="w-4 h-4 mr-1.5" />
            Preview
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
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Edit3, FolderOpen, Play, X, Check } from 'lucide-react';
import { listFunnels, createNewFunnel, deleteFunnel, duplicateFunnel, renameFunnel, setActiveFunnelId, SavedFunnel } from '../lib/funnelStorage';
import { createDemoFunnel } from '../lib/demoFunnel';
import { saveFunnel } from '../lib/funnelStorage';

interface FunnelManagerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFunnelId: string | null;
  onLoadFunnel: (funnel: SavedFunnel) => void;
  onNewFunnel: () => void;
}

export default function FunnelManager({ isOpen, onClose, activeFunnelId, onLoadFunnel, onNewFunnel }: FunnelManagerProps) {
  const [funnels, setFunnels] = useState<SavedFunnel[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [newName, setNewName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  useEffect(() => {
    if (isOpen) setFunnels(listFunnels());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNew = () => {
    if (!newName.trim()) return;
    const funnel = createNewFunnel(newName.trim());
    setActiveFunnelId(funnel.id);
    onLoadFunnel(funnel);
    setShowNewInput(false);
    setNewName('');
    onClose();
  };

  const handleLoadDemo = () => {
    const demo = createDemoFunnel();
    const savedFunnel: SavedFunnel = {
      ...demo,
      copyData: {},
    };
    saveFunnel(savedFunnel);
    setActiveFunnelId(savedFunnel.id);
    onLoadFunnel(savedFunnel);
    onClose();
  };

  const handleOpen = (funnel: SavedFunnel) => {
    setActiveFunnelId(funnel.id);
    onLoadFunnel(funnel);
    onClose();
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateFunnel(id);
    if (dup) setFunnels(listFunnels());
  };

  const handleDelete = (id: string) => {
    deleteFunnel(id);
    setFunnels(listFunnels());
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    renameFunnel(id, renameValue.trim());
    setRenamingId(null);
    setFunnels(listFunnels());
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📁 My Funnels</h2>
            <p className="text-xs text-gray-500 mt-0.5">{funnels.length} funnel{funnels.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setShowNewInput(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> New Funnel
            </button>
            <button onClick={handleLoadDemo} className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100">
              <Play className="w-4 h-4" /> Try Demo Funnel
            </button>
          </div>

          {/* New funnel input */}
          {showNewInput && (
            <div className="mb-4 flex gap-2">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Funnel name..." className="flex-1 border rounded-lg px-3 py-2 text-sm" autoFocus onKeyDown={e => e.key === 'Enter' && handleNew()} />
              <button onClick={handleNew} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Create</button>
              <button onClick={() => { setShowNewInput(false); setNewName(''); }} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">Cancel</button>
            </div>
          )}

          {/* Funnel list */}
          {funnels.length === 0 && !showNewInput && (
            <div className="text-center py-12 text-gray-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No funnels yet</p>
              <p className="text-sm mt-1">Create a new funnel or try the demo.</p>
            </div>
          )}

          <div className="space-y-2">
            {funnels.sort((a, b) => b.updatedAt - a.updatedAt).map(funnel => (
              <div key={funnel.id} className={`border rounded-xl p-4 transition-all hover:shadow-md ${funnel.id === activeFunnelId ? 'border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {renamingId === funnel.id ? (
                      <div className="flex gap-1 items-center">
                        <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} className="border rounded px-2 py-1 text-sm flex-1" autoFocus onKeyDown={e => e.key === 'Enter' && handleRename(funnel.id)} />
                        <button onClick={() => handleRename(funnel.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setRenamingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-sm text-gray-900 truncate">{funnel.name}</h3>
                        {funnel.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{funnel.description}</p>}
                      </>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                      <span>{funnel.nodes.length} steps</span>
                      <span>{funnel.edges.length} connections</span>
                      <span>Updated {formatDate(funnel.updatedAt)}</span>
                    </div>
                  </div>
                  {funnel.id === activeFunnelId && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Active</span>
                  )}
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={() => handleOpen(funnel)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    <FolderOpen className="w-3 h-3" /> Open
                  </button>
                  <button onClick={() => { setRenamingId(funnel.id); setRenameValue(funnel.name); }} className="text-xs py-1.5 px-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDuplicate(funnel.id)} className="text-xs py-1.5 px-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(funnel.id)} className="text-xs py-1.5 px-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

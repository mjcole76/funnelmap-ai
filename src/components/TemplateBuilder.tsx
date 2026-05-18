'use client';
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Copy, ChevronUp, ChevronDown, Wand2, RotateCcw, Save, Upload, Download, Palette, Type, Layout, FolderOpen } from 'lucide-react';
import {
  PlacedBlock, BlockType, BlockContent, BlockStyles, SavedTemplate,
  TEMPLATE_BLOCKS, getBlockDef, createPlacedBlock, layoutFromStepType, getBlocksByCategory,
  DEFAULT_SECTION_STYLE, DEFAULT_TYPOGRAPHY, DEFAULT_BUTTON_STYLE, DEFAULT_IMAGE_STYLE, DEFAULT_VIDEO_STYLE, DEFAULT_COLUMN_STYLE,
  saveTemplate, loadTemplates, deleteTemplate, duplicateTemplate, exportTemplate, importTemplate, sectionToCSS, typographyToCSS, buttonToCSS, blockToHTML,
} from '../lib/templateBlocks';

interface TemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeTitle: string;
  stepType: string;
  currentLayout: PlacedBlock[] | null;
  onSaveLayout: (nodeId: string, layout: PlacedBlock[]) => void;
  onGenerateCopy: (nodeId: string, layout: PlacedBlock[]) => void;
}

type Tab = 'blocks' | 'styles' | 'templates';

const CATEGORIES = [
  { key: 'core', label: 'Core', icon: '🎯' },
  { key: 'sales', label: 'Sales', icon: '💰' },
  { key: 'trust', label: 'Trust', icon: '⭐' },
  { key: 'conversion', label: 'Conversion', icon: '🚀' },
  { key: 'media', label: 'Media', icon: '🖼️' },
  { key: 'layout', label: 'Layout', icon: '▐▌' },
  { key: 'button', label: 'Buttons', icon: '🔘' },
] as const;

export default function TemplateBuilder({ isOpen, onClose, nodeId, nodeTitle, stepType, currentLayout, onSaveLayout, onGenerateCopy }: TemplateBuilderProps) {
  const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('blocks');
  const [showAddPicker, setShowAddPicker] = useState<number | null>(null);
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [saveIncludeCopy, setSaveIncludeCopy] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (currentLayout && currentLayout.length > 0) {
        // Migrate old blocks that don't have styles
        const migrated = currentLayout.map(b => ({
          ...b,
          styles: b.styles || { section: { ...DEFAULT_SECTION_STYLE }, typography: { ...DEFAULT_TYPOGRAPHY } },
        }));
        setBlocks(migrated);
      } else {
        setBlocks(layoutFromStepType(stepType));
      }
      setTemplates(loadTemplates());
      setSelectedBlock(null);
    }
  }, [isOpen, currentLayout, stepType]);

  if (!isOpen) return null;

  const selectedBlockData = blocks.find(b => b.instanceId === selectedBlock);

  const addBlock = (type: BlockType, atIndex: number) => {
    const newBlock = createPlacedBlock(type);
    const updated = [...blocks];
    updated.splice(atIndex, 0, newBlock);
    setBlocks(updated);
    setSelectedBlock(newBlock.instanceId);
    setShowAddPicker(null);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.instanceId !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const dupBlock = (id: string) => {
    const idx = blocks.findIndex(b => b.instanceId === id);
    if (idx < 0) return;
    const src = blocks[idx];
    const dup: PlacedBlock = { ...JSON.parse(JSON.stringify(src)), instanceId: `${src.blockType}-${Date.now()}-${Math.random().toString(36).slice(2,6)}` };
    const updated = [...blocks];
    updated.splice(idx + 1, 0, dup);
    setBlocks(updated);
  };

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.instanceId === id);
    const newIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const updated = [...blocks];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setBlocks(updated);
  };

  const updateContent = (id: string, key: string, value: any) => {
    setBlocks(blocks.map(b => b.instanceId === id ? { ...b, content: { ...b.content, [key]: value } } : b));
  };

  const updateStyle = (id: string, group: keyof BlockStyles, key: string, value: any) => {
    setBlocks(blocks.map(b => {
      if (b.instanceId !== id) return b;
      const styles = { ...b.styles };
      if (group === 'section') styles.section = { ...styles.section, [key]: value };
      else if (group === 'typography') styles.typography = { ...styles.typography, [key]: value };
      else if (group === 'button') styles.button = { ...(styles.button || DEFAULT_BUTTON_STYLE), [key]: value };
      else if (group === 'image') styles.image = { ...(styles.image || DEFAULT_IMAGE_STYLE), [key]: value };
      else if (group === 'video') styles.video = { ...(styles.video || DEFAULT_VIDEO_STYLE), [key]: value };
      else if (group === 'columns') styles.columns = { ...(styles.columns || DEFAULT_COLUMN_STYLE), [key]: value };
      return { ...b, styles };
    }));
  };

  const handleSave = () => { onSaveLayout(nodeId, blocks); };
  const handleGenerate = () => { onGenerateCopy(nodeId, blocks); };
  const handleReset = () => { setBlocks(layoutFromStepType(stepType)); setSelectedBlock(null); };

  // Template library actions
  const handleSaveAsTemplate = () => {
    const tpl: SavedTemplate = {
      id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      name: saveName || `${stepType} Template`,
      description: saveDesc,
      pageType: stepType,
      pageStyle: '',
      blocks: saveIncludeCopy ? JSON.parse(JSON.stringify(blocks)) : blocks.map(b => ({ ...JSON.parse(JSON.stringify(b)), content: { ...getBlockDef(b.blockType).defaultContent } })),
      includeCopy: saveIncludeCopy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveTemplate(tpl);
    setTemplates(loadTemplates());
    setSaveModalOpen(false);
    setSaveName('');
    setSaveDesc('');
  };

  const handleApplyTemplate = (tpl: SavedTemplate) => {
    setBlocks(JSON.parse(JSON.stringify(tpl.blocks)));
    setSelectedBlock(null);
  };

  const handleDuplicateTemplate = (id: string) => { duplicateTemplate(id); setTemplates(loadTemplates()); };
  const handleDeleteTemplate = (id: string) => { deleteTemplate(id); setTemplates(loadTemplates()); };
  const handleExportTemplate = (id: string) => {
    const json = exportTemplate(id);
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `template-${id}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const handleImportTemplate = () => {
    const result = importTemplate(importJson);
    if (result) { setTemplates(loadTemplates()); setImportModalOpen(false); setImportJson(''); }
  };

  // Render style panel for selected block
  const renderStylePanel = () => {
    if (!selectedBlockData) return <div className="p-4 text-gray-400 text-sm text-center">Select a block to edit its styles</div>;
    const s = selectedBlockData.styles;
    const bt = selectedBlockData.blockType;

    return (
      <div className="p-3 space-y-4 text-xs">
        {/* SECTION STYLES */}
        <details open>
          <summary className="font-bold text-gray-700 cursor-pointer flex items-center"><Palette className="w-3.5 h-3.5 mr-1.5" />Section Style</summary>
          <div className="mt-2 space-y-2 pl-1">
            <label className="flex items-center justify-between">Background <input type="color" value={s.section.backgroundColor} onChange={e => updateStyle(selectedBlock!, 'section', 'backgroundColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
            <label className="flex items-center justify-between">Text Color <input type="color" value={s.section.textColor} onChange={e => updateStyle(selectedBlock!, 'section', 'textColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
            <label className="flex items-center justify-between">Accent <input type="color" value={s.section.accentColor} onChange={e => updateStyle(selectedBlock!, 'section', 'accentColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
            <label className="flex items-center justify-between">Border <input type="color" value={s.section.borderColor === 'transparent' ? '#ffffff' : s.section.borderColor} onChange={e => updateStyle(selectedBlock!, 'section', 'borderColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
            <label className="flex items-center justify-between">Border Radius <input type="range" min={0} max={24} value={s.section.borderRadius} onChange={e => updateStyle(selectedBlock!, 'section', 'borderRadius', Number(e.target.value))} className="w-24" /><span>{s.section.borderRadius}px</span></label>
            <label className="flex items-center justify-between">Shadow <input type="checkbox" checked={s.section.shadow} onChange={e => updateStyle(selectedBlock!, 'section', 'shadow', e.target.checked)} /></label>
            <label className="flex items-center justify-between">Top Padding <input type="range" min={0} max={120} step={8} value={s.section.paddingTop} onChange={e => updateStyle(selectedBlock!, 'section', 'paddingTop', Number(e.target.value))} className="w-24" /><span>{s.section.paddingTop}px</span></label>
            <label className="flex items-center justify-between">Bottom Padding <input type="range" min={0} max={120} step={8} value={s.section.paddingBottom} onChange={e => updateStyle(selectedBlock!, 'section', 'paddingBottom', Number(e.target.value))} className="w-24" /><span>{s.section.paddingBottom}px</span></label>
            <label className="flex items-center justify-between">Max Width
              <select value={s.section.maxWidth} onChange={e => updateStyle(selectedBlock!, 'section', 'maxWidth', e.target.value)} className="border rounded px-1.5 py-0.5">
                <option value="narrow">Narrow</option><option value="normal">Normal</option><option value="wide">Wide</option><option value="full">Full</option>
              </select>
            </label>
            <label className="flex items-center justify-between">Alignment
              <select value={s.section.alignment} onChange={e => updateStyle(selectedBlock!, 'section', 'alignment', e.target.value)} className="border rounded px-1.5 py-0.5">
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </label>
          </div>
        </details>

        {/* TYPOGRAPHY */}
        <details>
          <summary className="font-bold text-gray-700 cursor-pointer flex items-center"><Type className="w-3.5 h-3.5 mr-1.5" />Typography</summary>
          <div className="mt-2 space-y-2 pl-1">
            <label className="flex items-center justify-between">Headline Size
              <select value={s.typography.headlineSize} onChange={e => updateStyle(selectedBlock!, 'typography', 'headlineSize', e.target.value)} className="border rounded px-1.5 py-0.5">
                <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="huge">Huge</option>
              </select>
            </label>
            <label className="flex items-center justify-between">Body Size
              <select value={s.typography.bodySize} onChange={e => updateStyle(selectedBlock!, 'typography', 'bodySize', e.target.value)} className="border rounded px-1.5 py-0.5">
                <option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option>
              </select>
            </label>
            <label className="flex items-center justify-between">Weight
              <select value={s.typography.fontWeight} onChange={e => updateStyle(selectedBlock!, 'typography', 'fontWeight', e.target.value)} className="border rounded px-1.5 py-0.5">
                <option value="normal">Normal</option><option value="bold">Bold</option><option value="extrabold">Extra Bold</option>
              </select>
            </label>
          </div>
        </details>

        {/* BUTTON STYLES */}
        {s.button && (
          <details>
            <summary className="font-bold text-gray-700 cursor-pointer flex items-center">🔘 Button Style</summary>
            <div className="mt-2 space-y-2 pl-1">
              <label className="flex items-center justify-between">Text <input type="text" value={s.button.text} onChange={e => updateStyle(selectedBlock!, 'button', 'text', e.target.value)} className="w-32 border rounded px-1.5 py-0.5" /></label>
              <label className="flex items-center justify-between">URL <input type="text" value={s.button.url} onChange={e => updateStyle(selectedBlock!, 'button', 'url', e.target.value)} className="w-32 border rounded px-1.5 py-0.5" /></label>
              <label className="flex items-center justify-between">BG Color <input type="color" value={s.button.backgroundColor} onChange={e => updateStyle(selectedBlock!, 'button', 'backgroundColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
              <label className="flex items-center justify-between">Text Color <input type="color" value={s.button.textColor} onChange={e => updateStyle(selectedBlock!, 'button', 'textColor', e.target.value)} className="w-8 h-6 cursor-pointer" /></label>
              <label className="flex items-center justify-between">Size
                <select value={s.button.size} onChange={e => updateStyle(selectedBlock!, 'button', 'size', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Width
                <select value={s.button.width} onChange={e => updateStyle(selectedBlock!, 'button', 'width', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="auto">Auto</option><option value="full">Full Width</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Alignment
                <select value={s.button.alignment} onChange={e => updateStyle(selectedBlock!, 'button', 'alignment', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Radius <input type="range" min={0} max={24} value={s.button.borderRadius} onChange={e => updateStyle(selectedBlock!, 'button', 'borderRadius', Number(e.target.value))} className="w-24" /><span>{s.button.borderRadius}px</span></label>
            </div>
          </details>
        )}

        {/* IMAGE STYLES */}
        {s.image && (
          <details>
            <summary className="font-bold text-gray-700 cursor-pointer flex items-center">🖼️ Image</summary>
            <div className="mt-2 space-y-2 pl-1">
              <label className="block">URL <input type="text" value={s.image.url} onChange={e => updateStyle(selectedBlock!, 'image', 'url', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" placeholder="https://..." /></label>
              <label className="block">Alt <input type="text" value={s.image.alt} onChange={e => updateStyle(selectedBlock!, 'image', 'alt', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
              <label className="flex items-center justify-between">Aspect
                <select value={s.image.aspectRatio} onChange={e => updateStyle(selectedBlock!, 'image', 'aspectRatio', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="auto">Auto</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="16:9">16:9</option><option value="3:2">3:2</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Position
                <select value={s.image.position} onChange={e => updateStyle(selectedBlock!, 'image', 'position', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Width
                <select value={s.image.width} onChange={e => updateStyle(selectedBlock!, 'image', 'width', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="full">Full</option>
                </select>
              </label>
            </div>
          </details>
        )}

        {/* VIDEO STYLES */}
        {s.video && (
          <details>
            <summary className="font-bold text-gray-700 cursor-pointer flex items-center">🎬 Video</summary>
            <div className="mt-2 space-y-2 pl-1">
              <label className="block">YouTube/Vimeo URL <input type="text" value={s.video.url} onChange={e => updateStyle(selectedBlock!, 'video', 'url', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
              <label className="block">Embed URL <input type="text" value={s.video.embedUrl} onChange={e => updateStyle(selectedBlock!, 'video', 'embedUrl', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
              <label className="block">Thumbnail <input type="text" value={s.video.thumbnailUrl} onChange={e => updateStyle(selectedBlock!, 'video', 'thumbnailUrl', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
              <label className="flex items-center justify-between">Aspect
                <select value={s.video.aspectRatio} onChange={e => updateStyle(selectedBlock!, 'video', 'aspectRatio', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="16:9">16:9</option><option value="4:3">4:3</option><option value="1:1">1:1</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Autoplay <input type="checkbox" checked={s.video.autoplay} onChange={e => updateStyle(selectedBlock!, 'video', 'autoplay', e.target.checked)} /></label>
            </div>
          </details>
        )}

        {/* COLUMN STYLES */}
        {s.columns && (
          <details>
            <summary className="font-bold text-gray-700 cursor-pointer flex items-center">▐▌ Columns</summary>
            <div className="mt-2 space-y-2 pl-1">
              <label className="flex items-center justify-between">Ratio
                <select value={s.columns.ratio} onChange={e => updateStyle(selectedBlock!, 'columns', 'ratio', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="50/50">50/50</option><option value="60/40">60/40</option><option value="40/60">40/60</option><option value="70/30">70/30</option><option value="30/70">30/70</option>
                </select>
              </label>
              <label className="flex items-center justify-between">Stack on Mobile <input type="checkbox" checked={s.columns.stackOnMobile} onChange={e => updateStyle(selectedBlock!, 'columns', 'stackOnMobile', e.target.checked)} /></label>
              <label className="flex items-center justify-between">Gap
                <select value={s.columns.gap} onChange={e => updateStyle(selectedBlock!, 'columns', 'gap', e.target.value)} className="border rounded px-1.5 py-0.5">
                  <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                </select>
              </label>
            </div>
          </details>
        )}

        {/* CONTENT EDIT */}
        <details>
          <summary className="font-bold text-gray-700 cursor-pointer flex items-center">✏️ Content</summary>
          <div className="mt-2 space-y-2 pl-1">
            {selectedBlockData.content.headline !== undefined && (
              <label className="block">Headline <input type="text" value={selectedBlockData.content.headline || ''} onChange={e => updateContent(selectedBlock!, 'headline', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
            )}
            {selectedBlockData.content.subheadline !== undefined && (
              <label className="block">Subheadline <input type="text" value={selectedBlockData.content.subheadline || ''} onChange={e => updateContent(selectedBlock!, 'subheadline', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
            )}
            {selectedBlockData.content.body !== undefined && (
              <label className="block">Body <textarea value={selectedBlockData.content.body || ''} onChange={e => updateContent(selectedBlock!, 'body', e.target.value)} rows={3} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
            )}
            {selectedBlockData.content.cta !== undefined && (
              <label className="block">CTA Text <input type="text" value={selectedBlockData.content.cta || ''} onChange={e => updateContent(selectedBlock!, 'cta', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
            )}
            {selectedBlockData.content.imageUrl !== undefined && (
              <label className="block">Image URL <input type="text" value={selectedBlockData.content.imageUrl || ''} onChange={e => updateContent(selectedBlock!, 'imageUrl', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" placeholder="https://..." /></label>
            )}
            {selectedBlockData.content.videoUrl !== undefined && (
              <label className="block">Video URL <input type="text" value={selectedBlockData.content.videoUrl || ''} onChange={e => updateContent(selectedBlock!, 'videoUrl', e.target.value)} className="w-full border rounded px-1.5 py-0.5 mt-0.5" /></label>
            )}
          </div>
        </details>
      </div>
    );
  };

  // Render block preview
  const renderBlockPreview = (block: PlacedBlock) => {
    const s = block.styles;
    const secStyle: React.CSSProperties = {
      backgroundColor: s.section.backgroundColor,
      color: s.section.textColor,
      borderRadius: s.section.borderRadius,
      boxShadow: s.section.shadow ? '0 4px 12px rgba(0,0,0,0.1)' : undefined,
      border: s.section.borderColor !== 'transparent' ? `1px solid ${s.section.borderColor}` : undefined,
      paddingTop: Math.min(s.section.paddingTop, 24),
      paddingBottom: Math.min(s.section.paddingBottom, 24),
      paddingLeft: 12,
      paddingRight: 12,
      textAlign: s.section.alignment as any,
    };
    const hSize = { small: '0.8rem', medium: '0.9rem', large: '1rem', huge: '1.1rem' }[s.typography.headlineSize];
    const bSize = { small: '0.65rem', normal: '0.7rem', large: '0.75rem' }[s.typography.bodySize];
    const c = block.content;
    const def = getBlockDef(block.blockType);

    return (
      <div style={secStyle} className="text-left">
        <div className="text-[9px] opacity-40 mb-1">{def.icon} {def.label}</div>
        {c.headline && <div style={{ fontSize: hSize, fontWeight: s.typography.fontWeight === 'extrabold' ? 800 : s.typography.fontWeight === 'bold' ? 700 : 400, lineHeight: 1.2 }}>{c.headline}</div>}
        {c.body && <div style={{ fontSize: bSize, opacity: 0.7, marginTop: 4 }} className="line-clamp-2">{c.body}</div>}
        {c.bullets && c.bullets.length > 0 && <div style={{ fontSize: bSize, marginTop: 4 }}>• {c.bullets[0]}{c.bullets.length > 1 && ` (+${c.bullets.length - 1})`}</div>}
        {c.cta && s.button && (
          <div style={{ marginTop: 6, textAlign: s.button.alignment as any }}>
            <span style={{ display: 'inline-block', backgroundColor: s.button.backgroundColor, color: s.button.textColor, padding: '2px 8px', borderRadius: s.button.borderRadius, fontSize: '0.6rem', fontWeight: 600 }}>{c.cta}</span>
          </div>
        )}
        {block.blockType === 'image' && <div className="bg-gray-100 rounded text-center py-3 mt-1 text-[10px] text-gray-400">🖼️ Image</div>}
        {block.blockType === 'video_embed' && <div className="bg-gray-900 rounded text-center py-3 mt-1 text-[10px] text-gray-400">🎬 Video</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-6xl m-auto max-h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 className="text-base font-bold text-gray-900">🏗️ Template Builder</h2>
            <p className="text-xs text-gray-500">{nodeTitle} • {stepType} • {blocks.length} blocks</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleReset} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium flex items-center"><RotateCcw className="w-3 h-3 mr-1" />Reset</button>
            <button onClick={handleSave} className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium flex items-center"><Save className="w-3 h-3 mr-1" />Save Layout</button>
            <button onClick={handleGenerate} className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"><Wand2 className="w-3 h-3 mr-1" />Write Copy</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* BODY: 3-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Block List + Add */}
          <div className="w-72 border-r overflow-y-auto bg-gray-50 flex-shrink-0">
            {/* Tab bar */}
            <div className="flex border-b sticky top-0 bg-gray-50 z-10">
              {[{ key: 'blocks' as Tab, label: 'Blocks', icon: <Layout className="w-3 h-3" /> }, { key: 'styles' as Tab, label: 'Styles', icon: <Palette className="w-3 h-3" /> }, { key: 'templates' as Tab, label: 'Templates', icon: <FolderOpen className="w-3 h-3" /> }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 text-[10px] font-semibold flex items-center justify-center gap-1 ${activeTab === tab.key ? 'text-indigo-700 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >{tab.icon}{tab.label}</button>
              ))}
            </div>

            {activeTab === 'blocks' && (
              <div className="p-2 space-y-1">
                {blocks.map((block, idx) => {
                  const def = getBlockDef(block.blockType);
                  return (
                    <div key={block.instanceId}>
                      {/* Add button between blocks */}
                      <div className="flex justify-center py-0.5">
                        <button onClick={() => setShowAddPicker(showAddPicker === idx ? null : idx)} className="text-[9px] text-gray-400 hover:text-indigo-600 flex items-center"><Plus className="w-3 h-3" /></button>
                      </div>
                      {showAddPicker === idx && (
                        <div className="bg-white border rounded-lg shadow-lg p-2 mb-1 max-h-48 overflow-y-auto">
                          {CATEGORIES.map(cat => {
                            const catBlocks = getBlocksByCategory(cat.key as any);
                            if (!catBlocks.length) return null;
                            return (
                              <div key={cat.key}>
                                <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">{cat.icon} {cat.label}</div>
                                {catBlocks.map(b => (
                                  <button key={b.id} onClick={() => addBlock(b.type, idx)} className="w-full text-left text-[10px] px-2 py-1 rounded hover:bg-indigo-50 text-gray-700">{b.icon} {b.label}</button>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* Block card */}
                      <div
                        onClick={() => setSelectedBlock(block.instanceId)}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          selectedBlock === block.instanceId ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold text-gray-700">{def.icon} {def.label}</span>
                          <div className="flex items-center space-x-0.5">
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.instanceId, 'up'); }} className="p-0.5 text-gray-400 hover:text-gray-600"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.instanceId, 'down'); }} className="p-0.5 text-gray-400 hover:text-gray-600"><ChevronDown className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); dupBlock(block.instanceId); }} className="p-0.5 text-gray-400 hover:text-gray-600"><Copy className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.instanceId); }} className="p-0.5 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                        {renderBlockPreview(block)}
                      </div>
                    </div>
                  );
                })}
                {/* Add at end */}
                <div className="flex justify-center py-2">
                  <button onClick={() => setShowAddPicker(showAddPicker === blocks.length ? null : blocks.length)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center"><Plus className="w-3.5 h-3.5 mr-1" />Add Block</button>
                </div>
                {showAddPicker === blocks.length && (
                  <div className="bg-white border rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto">
                    {CATEGORIES.map(cat => {
                      const catBlocks = getBlocksByCategory(cat.key as any);
                      if (!catBlocks.length) return null;
                      return (
                        <div key={cat.key}>
                          <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">{cat.icon} {cat.label}</div>
                          {catBlocks.map(b => (
                            <button key={b.id} onClick={() => addBlock(b.type, blocks.length)} className="w-full text-left text-[10px] px-2 py-1 rounded hover:bg-indigo-50 text-gray-700">{b.icon} {b.label}</button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'styles' && renderStylePanel()}

            {activeTab === 'templates' && (
              <div className="p-3 space-y-3">
                <div className="flex items-center space-x-1">
                  <button onClick={() => { setSaveName(''); setSaveDesc(''); setSaveModalOpen(true); }} className="flex-1 text-[10px] px-2 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center justify-center"><Save className="w-3 h-3 mr-1" />Save As Template</button>
                  <button onClick={() => { setImportJson(''); setImportModalOpen(true); }} className="flex-1 text-[10px] px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center"><Upload className="w-3 h-3 mr-1" />Import</button>
                </div>
                {templates.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No saved templates yet.</p>}
                {templates.map(tpl => (
                  <div key={tpl.id} className="border rounded-lg p-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{tpl.name}</div>
                        <div className="text-[10px] text-gray-400">{tpl.pageType} • {tpl.blocks.length} blocks</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <button onClick={() => handleApplyTemplate(tpl)} className="flex-1 text-[9px] px-1.5 py-1 bg-indigo-50 text-indigo-700 rounded font-medium">Use</button>
                      <button onClick={() => handleDuplicateTemplate(tpl.id)} className="text-[9px] px-1.5 py-1 bg-gray-50 text-gray-600 rounded font-medium">Dup</button>
                      <button onClick={() => handleExportTemplate(tpl.id)} className="text-[9px] px-1.5 py-1 bg-gray-50 text-gray-600 rounded font-medium"><Download className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteTemplate(tpl.id)} className="text-[9px] px-1.5 py-1 bg-red-50 text-red-600 rounded font-medium"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Live Preview */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-sm border max-w-3xl mx-auto overflow-hidden">
              {blocks.map(block => (
                <div key={block.instanceId}
                  onClick={() => { setSelectedBlock(block.instanceId); setActiveTab('styles'); }}
                  className={`cursor-pointer transition-all ${selectedBlock === block.instanceId ? 'ring-2 ring-indigo-400 ring-inset' : 'hover:ring-1 hover:ring-gray-300 hover:ring-inset'}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: blockToHTML(block) }} />
                </div>
              ))}
              {blocks.length === 0 && <div className="p-16 text-center text-gray-400">Add blocks to start building your page</div>}
            </div>
          </div>
        </div>

        {/* MODALS */}
        {saveModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-5 w-96">
              <h3 className="font-bold text-sm mb-3">Save as Template</h3>
              <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Template name..." className="w-full border rounded-lg px-3 py-2 text-sm mb-2" />
              <input type="text" value={saveDesc} onChange={e => setSaveDesc(e.target.value)} placeholder="Description (optional)" className="w-full border rounded-lg px-3 py-2 text-sm mb-2" />
              <label className="flex items-center text-xs mb-3"><input type="checkbox" checked={saveIncludeCopy} onChange={e => setSaveIncludeCopy(e.target.checked)} className="mr-2" />Include current copy in template</label>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setSaveModalOpen(false)} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleSaveAsTemplate} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg font-medium">Save Template</button>
              </div>
            </div>
          </div>
        )}
        {importModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-5 w-96">
              <h3 className="font-bold text-sm mb-3">Import Template</h3>
              <textarea value={importJson} onChange={e => setImportJson(e.target.value)} placeholder="Paste template JSON here..." rows={6} className="w-full border rounded-lg px-3 py-2 text-xs font-mono mb-3" />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setImportModalOpen(false)} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleImportTemplate} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg font-medium">Import</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
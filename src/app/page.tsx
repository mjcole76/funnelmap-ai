"use client";

import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import AnalyticsPanel from '../components/AnalyticsPanel';
import SettingsDrawer from '../components/SettingsDrawer';
import PreviewModal from '../components/PreviewModal';
import PagePreview from '../components/PagePreview';
import CopyPanel from '../components/CopyPanel';
import CopyQualityReport, { analyzeCopy } from '../components/CopyQualityReport';
import ExportModal from '../components/ExportModal';
import TemplateLibrary, { FunnelTemplate } from '../components/TemplateLibrary';
import TemplateBuilder from '../components/TemplateBuilder';
import PageEditor from '../components/PageEditor';
import FunnelManager from '../components/FunnelManager';

import type { FunnelContext, SaveStatus } from '../types';
import type { PlacedBlock } from '../lib/templateBlocks';
import { useFunnelStorage } from '../hooks/useFunnelStorage';
import { saveFunnel, getActiveFunnelId, setActiveFunnelId, SavedFunnel } from '../lib/funnelStorage';
import { useCopyGeneration } from '../hooks/useCopyGeneration';
import { useQualityReport } from '../hooks/useQualityReport';
import { useFunnelGeneration } from '../hooks/useFunnelGeneration';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { usePageEditor } from '../hooks/usePageEditor';
import { useExportManager } from '../hooks/useExportManager';
import { v4 as uuidv4 } from 'uuid';

function FunnelMapInner() {
  // ═══════ CORE STATE ═══════
  const [nodes, setNodes, onNodesChangeCore] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChangeCore] = useEdgesState<Edge>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [isPublished, setIsPublished] = useState(false);
  const [funnelContext, setFunnelContext] = useState<FunnelContext>({
    funnelName: 'My Funnel', productName: '', audience: '', price: '', problem: '', goal: '',
    offerType: 'Low-ticket ($7-$47)', pageStyle: 'Bold Direct Response',
  });

  // ═══════ UI STATE ═══════
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [copyPanelNode, setCopyPanelNode] = useState<Node | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [isGeneratingFullCopy, setIsGeneratingFullCopy] = useState(false);
  const [showQualityReport, setShowQualityReport] = useState(false);
  // Export modal state managed by useExportManager hook
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showFunnelManager, setShowFunnelManager] = useState(false);
  const [activeFunnelId, setActiveFunnelIdState] = useState<string | null>(null);

  // ═══════ HOOKS ═══════
  const { isLoaded, saveCopyForNode, loadCopyForNode, saveLayoutForNode, loadLayoutForNode } = useFunnelStorage(
    nodes, edges, isPublished, funnelContext, saveStatus, setSaveStatus,
    setNodes as any, setEdges as any, setIsPublished, setFunnelContext,
  );

  const { generateForNode, writeFullFunnel, generateFromLayout, regenerateForNode, buildContext } = useCopyGeneration(
    funnelContext, nodes, setNodes as any, setSaveStatus, saveCopyForNode, saveLayoutForNode, loadLayoutForNode,
  );

  const { handleFixIssue: fixIssue, handleFixAllBySeverity } = useQualityReport(
    nodes, funnelContext, setNodes as any, setSaveStatus, saveCopyForNode, loadCopyForNode,
  );

  const { handleGenerate, handleAutoArrange, handleResetLayout } = useFunnelGeneration(
    nodes, edges, setNodes as any, setEdges as any, funnelContext, setFunnelContext, setSaveStatus,
  );

  const {
    showTemplateBuilder, templateBuilderNode, openTemplateBuilder, closeTemplateBuilder, saveLayout,
  } = useTemplateManager(nodes, setNodes as any, setSaveStatus, saveCopyForNode, saveLayoutForNode, loadCopyForNode);

  const {
    showPageEditor, pageEditorNode, openPageEditor, closePageEditor, savePageEdit, regenerateFromEditor,
  } = usePageEditor(nodes, setNodes as any, setSaveStatus, saveCopyForNode, loadCopyForNode, regenerateForNode);

  const { showExportModal, openExportModal, closeExportModal } = useExportManager();

  // Funnel management
  const handleLoadFunnel = useCallback((funnel: SavedFunnel) => {
    setNodes(funnel.nodes || []);
    setEdges(funnel.edges || []);
    if (funnel.offerBrief && funnel.offerBrief.productName) {
      setFunnelContext(prev => ({
        ...prev,
        productName: funnel.offerBrief.productName || '',
        audience: funnel.offerBrief.audience || '',
        price: funnel.offerBrief.price || '',
        problem: funnel.offerBrief.mainProblem || '',
        goal: funnel.offerBrief.desiredOutcome || '',
      }));
    }
    // Load layouts into nodes
    if (funnel.layouts) {
      setNodes(nds => nds.map(n => {
        if (funnel.layouts[n.id]) {
          return { ...n, data: { ...n.data, layout: funnel.layouts[n.id] } };
        }
        return n;
      }));
    }
    setActiveFunnelIdState(funnel.id);
    setActiveFunnelId(funnel.id);
    setSaveStatus('saved');
  }, [setNodes, setEdges, setFunnelContext, setSaveStatus]);

  // ═══════ EDGE/NODE CHANGE HANDLERS ═══════
  const onNodesChange = useCallback((changes: NodeChange[]) => { onNodesChangeCore(changes); setSaveStatus('unsaved'); }, [onNodesChangeCore]);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => { onEdgesChangeCore(changes); setSaveStatus('unsaved'); }, [onEdgesChangeCore]);
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params, type: 'smoothstep', animated: true, label: 'Next',
      labelStyle: { fontSize: '10px', color: '#9ca3af', fontWeight: 400, background: 'rgba(255,255,255,0.8)', padding: '1px 6px', borderRadius: '4px' },
      style: { stroke: '#9CA3AF', strokeWidth: 2 },
    }, eds));
    setSaveStatus('unsaved');
  }, [setEdges]);

  // ═══════ NODE ACTIONS ═══════
  const handleSaveNode = (id: string, newData: any) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: newData } : n));
    setEditingNode(null);
    setSaveStatus('unsaved');
  };

  const handleSaveCopy = (id: string, copyData: any) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, copy: copyData } } : n));
    setSaveStatus('unsaved');
  };

  const handleGenerateCopy = (node: Node) => {
    if (!funnelContext.productName) {
      if (window.confirm('Set up your funnel context first to write copy. Open Settings now?')) setIsSettingsOpen(true);
      return;
    }
    setCopyPanelNode(node);
    const copy = generateForNode(node);
    setGeneratedCopy(copy);
  };

  const handleRegenerateCopy = () => { if (copyPanelNode) { const copy = generateForNode(copyPanelNode); setGeneratedCopy(copy); } };

  // ═══════ FULL FUNNEL WRITE ═══════
  const handleWriteFullFunnel = () => {
    const hasExisting = nodes.some(n => localStorage.getItem(`funnel-copy-${n.id}`) || n.data.copy);
    if (hasExisting && nodes.every(n => localStorage.getItem(`funnel-copy-${n.id}`) || n.data.copy)) {
      setShowRewriteModal(true);
      return;
    }
    setIsGeneratingFullCopy(true);
    setTimeout(() => { writeFullFunnel(false); setIsGeneratingFullCopy(false); setTimeout(() => setShowQualityReport(true), 300); }, 500);
  };

  const handleRewriteAll = () => {
    setShowRewriteModal(false);
    setIsGeneratingFullCopy(true);
    setTimeout(() => { writeFullFunnel(true); setIsGeneratingFullCopy(false); setTimeout(() => setShowQualityReport(true), 300); }, 500);
  };

  // ═══════ QA HANDLERS ═══════
  const handleFixIssue = (issue: any) => { fixIssue(issue); };
  const handleFixAllCritical = () => { handleFixAllBySeverity('critical'); };
  const handleFixAllWarnings = () => { handleFixAllBySeverity('warning'); };
  const handleRerunQA = () => { setShowQualityReport(false); setTimeout(() => setShowQualityReport(true), 50); };
  const handleEditNode = (nodeId: string) => {
    setShowQualityReport(false);
    const node = nodes.find(n => n.id === nodeId);
    if (node) setCopyPanelNode(node);
  };

  // ═══════ TEMPLATE LIBRARY ═══════
  const handleLoadTemplate = (template: FunnelTemplate) => {
    if (nodes.length > 0 && !window.confirm('This will replace your current canvas. Continue?')) return;
    const newNodes: Node[] = template.steps.map((step) => ({
      id: uuidv4(), type: 'funnelNode', position: step.relativePosition,
      data: { title: step.title, type: step.type, url: step.title.toLowerCase().replace(/\s+/g, '-'), headline: '', buttonText: step.buttonText || 'Next Step', price: funnelContext.price || '', visitors: '0', conversion: '0%', revenue: '0', previewTemplate: step.template },
    }));
    const newEdges: Edge[] = template.edges.map(e => ({
      id: `e-${newNodes[e.sourceIdx]?.id}-${newNodes[e.targetIdx]?.id}`, source: newNodes[e.sourceIdx]?.id, target: newNodes[e.targetIdx]?.id,
      type: 'smoothstep' as const, animated: true, label: e.label,
      labelStyle: { fontSize: '10px', color: '#9ca3af', fontWeight: 400, background: 'rgba(255,255,255,0.8)', padding: '1px 6px', borderRadius: '4px' },
      style: { stroke: '#9CA3AF', strokeWidth: 2 },
    })).filter(e => e.source && e.target);
    setNodes(newNodes);
    setEdges(newEdges);
    setSaveStatus('unsaved');
  };

  // ═══════ LAYOUT COPY GEN (bridges TemplateBuilder → copy engine) ═══════
  const handleGenerateCopyFromLayout = (nodeId: string, layout: PlacedBlock[]) => {
    generateFromLayout(nodeId, layout);
    closeTemplateBuilder();
  };

  // ═══════ RENDER ═══════
  if (!isLoaded) return <div className="h-screen w-full bg-white flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>;

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden relative">
      <Header
        saveStatus={saveStatus}
        onPreview={() => setIsPreviewOpen(true)}
        isPublished={isPublished}
        onPublish={() => { setIsPublished(true); setSaveStatus('unsaved'); }}
        onUnpublish={() => { setIsPublished(false); setSaveStatus('unsaved'); }}
        onClearAll={() => { if (window.confirm('Are you sure you want to clear the canvas?')) { setNodes([]); setEdges([]); setSaveStatus('unsaved'); } }}
        onGenerate={handleGenerate}
        funnelContext={funnelContext}
        setFunnelContext={(ctx) => { setFunnelContext(ctx); setSaveStatus('unsaved'); }}
        onExportFunnel={openExportModal}
        onAutoArrange={handleAutoArrange}
        onResetLayout={handleResetLayout}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onWriteFullFunnel={handleWriteFullFunnel}
        isGeneratingFullCopy={isGeneratingFullCopy}
        onOpenQualityReport={() => setShowQualityReport(true)}
        onOpenTemplateLibrary={() => setShowTemplateLibrary(true)}
        onOpenFunnelManager={() => setShowFunnelManager(true)}
        activeFunnelName={activeFunnelId ? funnelContext.funnelName : undefined}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 h-full w-full">
          <Canvas
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            setNodes={setNodes} setEdges={setEdges} onEditNode={setEditingNode} onGenerateCopy={handleGenerateCopy}
            onPreviewNode={(id: string) => setPreviewNodeId(id)} onBuildTemplate={openTemplateBuilder}
            onEditPage={openPageEditor} setSaveStatus={setSaveStatus}
          />
        </div>
        <AnalyticsPanel nodes={nodes} />
      </div>

      <SettingsDrawer node={editingNode} onClose={() => setEditingNode(null)} onSave={handleSaveNode} />
      <PreviewModal isOpen={isPreviewOpen} nodes={nodes} edges={edges} onClose={() => setIsPreviewOpen(false)} />

      {previewNodeId && (
        <PagePreview
          isOpen={!!previewNodeId} onClose={() => setPreviewNodeId(null)} nodeId={previewNodeId}
          stepType={nodes.find(n => n.id === previewNodeId)?.data?.type as string || 'Landing Page'}
          title={nodes.find(n => n.id === previewNodeId)?.data?.title as string || 'Page'}
          previewTemplate={nodes.find(n => n.id === previewNodeId)?.data?.previewTemplate as string || ''}
          headline={nodes.find(n => n.id === previewNodeId)?.data?.headline as string}
          buttonText={nodes.find(n => n.id === previewNodeId)?.data?.buttonText as string}
          price={nodes.find(n => n.id === previewNodeId)?.data?.price as string}
          funnelSettings={funnelContext as any}
          layout={nodes.find(n => n.id === previewNodeId)?.data?.layout as any}
        />
      )}

      {copyPanelNode && (
        <CopyPanel node={copyPanelNode} generatedCopy={copyPanelNode.data.copy || generatedCopy} onClose={() => setCopyPanelNode(null)} onSave={handleSaveCopy} onRegenerate={handleRegenerateCopy} />
      )}

      {showRewriteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">⚠️ Rewrite All Funnel Copy?</h2>
            <p className="text-gray-600 mb-6">All existing generated copy will be replaced. This cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowRewriteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleRewriteAll} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Rewrite All Copy</button>
            </div>
          </div>
        </div>
      )}

      <CopyQualityReport isOpen={showQualityReport} onClose={() => setShowQualityReport(false)} nodes={nodes} funnelContext={funnelContext}
        onFixIssue={handleFixIssue} onFixAllCritical={handleFixAllCritical} onFixAllWarnings={handleFixAllWarnings} onRerunQA={handleRerunQA} onEditNode={handleEditNode} />

      <ExportModal isOpen={showExportModal} onClose={closeExportModal} nodes={nodes} edges={edges} funnelContext={funnelContext} />
      <TemplateLibrary isOpen={showTemplateLibrary} onClose={() => setShowTemplateLibrary(false)} onLoadTemplate={handleLoadTemplate} currentNodes={nodes} currentEdges={edges} />

      <TemplateBuilder isOpen={showTemplateBuilder} onClose={closeTemplateBuilder}
        nodeId={templateBuilderNode?.id || ''} nodeTitle={(templateBuilderNode?.data?.title as string) || 'Untitled'}
        stepType={(templateBuilderNode?.data?.type as string) || 'Sales Page'} currentLayout={(templateBuilderNode?.data?.layout as PlacedBlock[]) || null}
        onSaveLayout={saveLayout} onGenerateCopy={handleGenerateCopyFromLayout} />

      <FunnelManager isOpen={showFunnelManager} onClose={() => setShowFunnelManager(false)}
        activeFunnelId={activeFunnelId} onLoadFunnel={handleLoadFunnel}
        onNewFunnel={() => { setNodes([]); setEdges([]); setSaveStatus('unsaved'); setShowFunnelManager(false); }} />

      <PageEditor isOpen={showPageEditor} onClose={closePageEditor}
        nodeId={pageEditorNode?.id || ''} nodeTitle={(pageEditorNode?.data?.title as string) || 'Untitled'}
        stepType={(pageEditorNode?.data?.type as string) || 'Sales Page'} copyData={pageEditorNode?.data?.copy || null}
        onSave={savePageEdit} onRegenerate={regenerateFromEditor} onPreview={(id) => { closePageEditor(); setPreviewNodeId(id); }} />
    </div>
  );
}

export default function FunnelMapApp() {
  return <ReactFlowProvider><FunnelMapInner /></ReactFlowProvider>;
}

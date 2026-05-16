"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, NodeChange, EdgeChange } from '@xyflow/react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import AnalyticsPanel from '../components/AnalyticsPanel';
import SettingsDrawer from '../components/SettingsDrawer';
import PreviewModal from '../components/PreviewModal';

const STORAGE_KEY = 'funnelmap-ai-state';

function FunnelMapInner() {
  const [nodes, setNodes, onNodesChangeCore] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChangeCore] = useEdgesState<Edge>([]);
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [isPublished, setIsPublished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes) setNodes(parsed.nodes);
        if (parsed.edges) setEdges(parsed.edges);
        if (parsed.isPublished) setIsPublished(parsed.isPublished);
      } catch (e) {
        // Ignore parse errors
      }
    }
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Auto-save
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    
    if (saveStatus === 'unsaved') {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        
        const toSave = {
          nodes: nodes.map(n => ({...n, data: {...n.data, onEdit: undefined, onDelete: undefined}})),
          edges,
          isPublished
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        
        setTimeout(() => setSaveStatus('saved'), 500);
      }, 1000);
    }
  }, [nodes, edges, isPublished, saveStatus, isLoaded]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChangeCore(changes);
    setSaveStatus('unsaved');
  }, [onNodesChangeCore]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChangeCore(changes);
    setSaveStatus('unsaved');
  }, [onEdgesChangeCore]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#9CA3AF', strokeWidth: 2 } }, eds));
      setSaveStatus('unsaved');
    },
    [setEdges]
  );

  const handleSaveNode = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
    setEditingNode(null);
    setSaveStatus('unsaved');
  };

  const handlePublish = () => {
    setIsPublished(true);
    setSaveStatus('unsaved');
  };

  const handleUnpublish = () => {
    setIsPublished(false);
    setSaveStatus('unsaved');
  };

  if (!isLoaded) return <div className="h-screen w-full bg-white flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>;

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <Header 
        saveStatus={saveStatus} 
        onPreview={() => setIsPreviewOpen(true)}
        isPublished={isPublished}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onClearAll={() => { if(window.confirm("Are you sure you want to clear the canvas?")) { setNodes([]); setEdges([]); setSaveStatus("unsaved"); } }}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 h-full w-full">
          <Canvas 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setNodes={setNodes}
            setEdges={setEdges}
            onEditNode={setEditingNode}
            setSaveStatus={setSaveStatus}
          />
        </div>

        <AnalyticsPanel nodes={nodes} />
      </div>

      <SettingsDrawer 
        isOpen={!!editingNode}
        node={editingNode}
        onClose={() => setEditingNode(null)}
        onSave={handleSaveNode}
      />

      <PreviewModal 
        isOpen={isPreviewOpen}
        nodes={nodes}
        edges={edges}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}

export default function FunnelMapApp() {
  return (
    <ReactFlowProvider>
      <FunnelMapInner />
    </ReactFlowProvider>
  );
}

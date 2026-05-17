"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, NodeChange, EdgeChange } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import AnalyticsPanel from '../components/AnalyticsPanel';
import SettingsDrawer from '../components/SettingsDrawer';
import PreviewModal from '../components/PreviewModal';
import CopyPanel from '../components/CopyPanel';
import { FunnelContext, generateCopy } from '../lib/copyTemplates';

const STORAGE_KEY = 'funnelmap-ai-state';

const topologicalSort = (nodes: Node[], edges: Edge[]) => {
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  nodes.forEach(n => {
    inDegree.set(n.id, 0);
    adjList.set(n.id, []);
  });

  edges.forEach(e => {
    adjList.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });

  const queue: string[] = [];
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id);
  });

  const sortedIds: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedIds.push(current);
    const neighbors = adjList.get(current) || [];
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  nodes.forEach(n => {
    if (!sortedIds.includes(n.id)) {
      sortedIds.push(n.id);
    }
  });

  return sortedIds.map(id => nodes.find(n => n.id === id)!);
};

function FunnelMapInner() {
  const [nodes, setNodes, onNodesChangeCore] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChangeCore] = useEdgesState<Edge>([]);
  
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [copyPanelNode, setCopyPanelNode] = useState<Node | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [isPublished, setIsPublished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [funnelContext, setFunnelContext] = useState<FunnelContext>({
    funnelName: 'My Funnel',
    productName: '',
    audience: '',
    price: '',
    problem: 'low conversions',
    goal: 'Sell product',
    offerType: 'Low-ticket ($7-$47)'
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes) setNodes(parsed.nodes);
        if (parsed.edges) setEdges(parsed.edges);
        if (parsed.isPublished) setIsPublished(parsed.isPublished);
        if (parsed.funnelContext) setFunnelContext(parsed.funnelContext);
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
          nodes: nodes.map(n => ({...n, data: {...n.data, onEdit: undefined, onDelete: undefined, onAddNext: undefined, onGenerateCopy: undefined}})),
          edges,
          isPublished,
          funnelContext
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        
        setTimeout(() => setSaveStatus('saved'), 500);
      }, 1000);
    }
  }, [nodes, edges, isPublished, funnelContext, saveStatus, isLoaded]);

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
      setEdges((eds) => addEdge({ 
        ...params, 
        type: 'smoothstep', 
        animated: true, 
        label: 'Next',
        labelStyle: { fontSize: 11, fill: '#6B7280' },
        style: { stroke: '#9CA3AF', strokeWidth: 2 } 
      }, eds));
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

  const handleSaveCopy = (id: string, copyData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, copy: copyData } };
        }
        return node;
      })
    );
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

  const handleGenerate = (formData: any) => {
    if (nodes.length > 0) {
      if (!window.confirm("This will clear your current canvas. Proceed?")) {
        return;
      }
    }

    setFunnelContext(formData);

    let steps: string[] = [];
    if (formData.goal === 'Sell product') {
      if (formData.offerType.includes('Low')) {
        steps = ['Landing Page', 'Sales Page', 'Checkout', 'Order Bump', 'Upsell', 'Downsell', 'Thank You Page', 'Email Follow-up'];
      } else if (formData.offerType.includes('Mid')) {
        steps = ['Landing Page', 'Sales Page', 'Checkout', 'Upsell', 'Downsell', 'Thank You Page', 'Email Follow-up'];
      } else {
        steps = ['Landing Page', 'Application Page', 'Booking Page', 'Thank You Page', 'Email Follow-up'];
      }
    } else if (formData.goal === 'Collect leads') {
      steps = ['Landing Page', 'Opt-in Page', 'Thank You Page', 'Email Follow-up'];
    } else if (formData.goal === 'Book calls') {
      steps = ['Landing Page', 'Application Page', 'Booking Page', 'Thank You Page', 'Email Follow-up'];
    } else if (formData.goal === 'Webinar registration') {
      steps = ['Landing Page', 'Opt-in Page', 'Webinar', 'Sales Page', 'Checkout', 'Thank You Page', 'Email Follow-up'];
    } else {
      steps = ['Landing Page', 'Sales Page', 'Checkout', 'Thank You Page', 'Email Follow-up'];
    }

    const getStepTitle = (step: string) => {
      const p = formData.productName || 'Product';
      if (step === 'Landing Page') return `Free ${p} Guide`;
      if (step === 'Sales Page') return p;
      if (step === 'Checkout') return `${formData.price || '$97'} ${p}`;
      if (step === 'Order Bump') return `${p} Fast Track`;
      if (step === 'Upsell') return `${p} Pro Upgrade`;
      if (step === 'Downsell') return `${p} Basic Edition`;
      if (step === 'Thank You Page') return `Access Your ${p}`;
      if (step === 'Email Follow-up') return `${p} Follow-Up Sequence`;
      return `${p} - ${step}`;
    };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    let prevId = '';
    let prevStep = '';
    
    steps.forEach((step, index) => {
      const id = uuidv4();
      
      const CARDS_PER_ROW = 4;
      const X_SPACING = 320;
      const Y_SPACING = 300;
      const START_X = 50;
      const START_Y = 100;
      
      const row = Math.floor(index / CARDS_PER_ROW);
      const col = index % CARDS_PER_ROW;
      
      const x = START_X + col * X_SPACING;
      const y = START_Y + row * Y_SPACING;

      newNodes.push({
        id,
        type: 'funnelNode',
        position: { x, y },
        data: {
          title: getStepTitle(step),
          type: step,
          url: step.toLowerCase().replace(/\s+/g, '-'),
          headline: `Discover ${formData.productName}`,
          buttonText: 'Next Step',
          price: formData.price,
          visitors: Math.floor(Math.random() * 500 + 100).toString(),
          conversion: `${(Math.random() * 30 + 5).toFixed(1)}%`,
          revenue: `$${Math.floor(Math.random() * 2000 + 100)}`
        }
      });
      
      if (prevId) {
        let edgeLabel = 'Next';
        if (prevStep === 'Checkout') {
           edgeLabel = 'Buys';
        } else if (prevStep === 'Upsell') {
           edgeLabel = step === 'Downsell' ? 'Declines' : 'Accepts';
        } else if (prevStep === 'Downsell') {
           edgeLabel = 'Accepts';
        }

        newEdges.push({
          id: `e-${prevId}-${id}`,
          source: prevId,
          target: id,
          type: 'smoothstep',
          animated: true,
          label: edgeLabel,
          labelStyle: { fontSize: 11, fill: '#6B7280' },
          style: { stroke: '#9CA3AF', strokeWidth: 2 }
        });
      }
      prevId = id;
      prevStep = step;
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setSaveStatus('unsaved');
  };

  const handleAutoArrange = () => {
    const sorted = topologicalSort(nodes, edges);
    const CARDS_PER_ROW = 4;
    const X_SPACING = 320;
    const Y_SPACING = 300;
    
    const repositioned = sorted.map((node, index) => ({
      ...node,
      position: {
        x: 50 + (index % CARDS_PER_ROW) * X_SPACING,
        y: 100 + Math.floor(index / CARDS_PER_ROW) * Y_SPACING
      }
    }));
    
    setNodes(repositioned);
    setSaveStatus('unsaved');
  };

  const handleResetLayout = () => {
    const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id)); // simple sort
    const CARDS_PER_ROW = 4;
    const X_SPACING = 320;
    const Y_SPACING = 300;
    
    const repositioned = sorted.map((node, index) => ({
      ...node,
      position: {
        x: 50 + (index % CARDS_PER_ROW) * X_SPACING,
        y: 100 + Math.floor(index / CARDS_PER_ROW) * Y_SPACING
      }
    }));
    
    setNodes(repositioned);
    setSaveStatus('unsaved');
  };

  const handleGenerateCopy = (node: Node) => {
    if (!funnelContext.productName) {
      if (window.confirm("Set up your funnel context first to write copy. Open Settings now?")) {
        setIsSettingsOpen(true);
      }
      return;
    }
    setCopyPanelNode(node);
    doGenerateCopy(node);
  };

  const doGenerateCopy = (node: Node) => {
    const fullContext: FunnelContext = {
      ...funnelContext,
      stepTitle: node.data.title as string,
      headline: node.data.headline as string,
      buttonText: node.data.buttonText as string,
      notes: node.data.description as string,
    };
    const copy = generateCopy(node.data.type as string, fullContext);
    setGeneratedCopy(copy);
  };

  const handleRegenerateCopy = () => {
    if (copyPanelNode) {
      doGenerateCopy(copyPanelNode);
    }
  };

  const handleExportFunnel = () => {
    let sumVisitors = 0;
    let sumRevenue = 0;
    let sumConversion = 0;
    let numWithConv = 0;

    nodes.forEach(n => {
      if (n.data.visitors) sumVisitors += parseInt((n.data.visitors as string).replace(/,/g, ''), 10) || 0;
      if (n.data.revenue) sumRevenue += parseInt((n.data.revenue as string).replace(/[^0-9.-]+/g, ''), 10) || 0;
      if (n.data.conversion) {
        sumConversion += parseFloat((n.data.conversion as string).replace(/%/g, '')) || 0;
        numWithConv++;
      }
    });

    const avgConversion = numWithConv > 0 ? (sumConversion / numWithConv).toFixed(1) + '%' : '0%';

    let text = `# ${funnelContext?.funnelName || 'Funnel'}\n\n`;
    text += `## Offer Summary\n`;
    text += `- **Product:** ${funnelContext?.productName || ''}\n`;
    text += `- **Audience:** ${funnelContext?.audience || ''}\n`;
    text += `- **Price:** ${funnelContext?.price || ''}\n`;
    text += `- **Goal:** ${funnelContext?.goal || ''}\n\n`;

    text += `## Funnel Map\n`;
    nodes.forEach((n, idx) => {
      text += `${idx + 1}. ${n.data.title} (${n.data.type})\n`;
    });
    text += `\n`;

    text += `## Analytics Summary\n`;
    text += `- Total Visitors: ${sumVisitors}\n`;
    text += `- Average Conversion: ${avgConversion}\n`;
    text += `- Total Revenue: $${sumRevenue}\n\n`;

    text += `## Page Copy\n\n`;
    nodes.forEach((n, idx) => {
      text += `### ${idx + 1}. ${n.data.title} — ${n.data.type}\n`;
      if (n.data.copy) {
        const copy: any = n.data.copy;
        text += `**Headline:** ${copy.headline}\n\n`;
        copy.sections.forEach((s: any) => {
          text += `**${s.title}**\n${s.content}\n\n`;
        });
      } else {
        text += `*No copy generated yet*\n\n`;
      }
    });

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(funnelContext?.funnelName || 'funnel').toLowerCase().replace(/\s+/g, '-')}-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isLoaded) return <div className="h-screen w-full bg-white flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>;

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden relative">
      <Header 
        saveStatus={saveStatus} 
        onPreview={() => setIsPreviewOpen(true)}
        isPublished={isPublished}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onClearAll={() => { if(window.confirm("Are you sure you want to clear the canvas?")) { setNodes([]); setEdges([]); setSaveStatus("unsaved"); } }}
        onGenerate={handleGenerate}
        funnelContext={funnelContext}
        setFunnelContext={(ctx) => { setFunnelContext(ctx); setSaveStatus('unsaved'); }}
        onExportFunnel={handleExportFunnel}
        onAutoArrange={handleAutoArrange}
        onResetLayout={handleResetLayout}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
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
            onGenerateCopy={handleGenerateCopy}
            setSaveStatus={setSaveStatus}
          />
        </div>

        <AnalyticsPanel nodes={nodes} />
      </div>

      <SettingsDrawer 
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

      {copyPanelNode && (
        <CopyPanel 
          node={copyPanelNode}
          generatedCopy={copyPanelNode.data.copy || generatedCopy}
          onClose={() => setCopyPanelNode(null)}
          onSave={handleSaveCopy}
          onRegenerate={handleRegenerateCopy}
        />
      )}
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

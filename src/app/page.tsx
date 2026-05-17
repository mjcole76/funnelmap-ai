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
import PagePreview from '../components/PagePreview';
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
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [isPublished, setIsPublished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [isGeneratingFullCopy, setIsGeneratingFullCopy] = useState(false);

  const [funnelContext, setFunnelContext] = useState<FunnelContext>({
    funnelName: 'My Funnel',
    productName: '',
    audience: '',
    price: '',
    problem: '',
    goal: '',
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

const handleWriteFullFunnel = () => {
    const nodesWithoutCopy = nodes.filter(n => {
      const savedCopy = localStorage.getItem(`funnel-copy-${n.id}`) || n.data.copy;
      return !savedCopy;
    });
    
    if (nodesWithoutCopy.length === 0) {
      setShowRewriteModal(true);
      return;
    }
    
    setIsGeneratingFullCopy(true);
    setTimeout(() => {
      const updatedNodes = nodes.map(node => {
        const savedCopy = localStorage.getItem(`funnel-copy-${node.id}`) || node.data.copy;
        if (!savedCopy) {
          const context = {
            productName: funnelContext.productName || 'Your Product',
            audience: funnelContext.audience || 'your audience',
            price: funnelContext.price || '$29',
            problem: funnelContext.problem || 'their main challenge',
            goal: funnelContext.goal || 'achieve their desired outcome',
            funnelName: funnelContext.funnelName || 'My Funnel',
            offerType: funnelContext.offerType || 'low_ticket',
            previewTemplate: (node.data.previewTemplate as string) || '',
            stepTitle: (node.data.title as string) || '',
            headline: (node.data.headline as string) || '',
            buttonText: (node.data.buttonText as string) || '',
          };
          
          const generated = generateCopy(node.data.type as string, context);
          localStorage.setItem(`funnel-copy-${node.id}`, JSON.stringify(generated));
          return { ...node, data: { ...node.data, copy: generated, _copyUpdated: Date.now() } };
        }
        return node;
      });
      
      setNodes(updatedNodes);
      setSaveStatus('unsaved');
      setIsGeneratingFullCopy(false);
    }, 500);
  };

  const handleRewriteAll = () => {
    setShowRewriteModal(false);
    setIsGeneratingFullCopy(true);
    setTimeout(() => {
      const updatedNodes = nodes.map(node => {
        const context = {
          productName: funnelContext.productName || 'Your Product',
          audience: funnelContext.audience || 'your audience',
          price: funnelContext.price || '$29',
          problem: funnelContext.problem || 'their main challenge',
          goal: funnelContext.goal || 'achieve their desired outcome',
          funnelName: funnelContext.funnelName || 'My Funnel',
          offerType: funnelContext.offerType || 'low_ticket',
          previewTemplate: (node.data.previewTemplate as string) || '',
          stepTitle: (node.data.title as string) || '',
          headline: (node.data.headline as string) || '',
          buttonText: (node.data.buttonText as string) || '',
        };
        
        const generated = generateCopy(node.data.type as string, context);
        localStorage.setItem(`funnel-copy-${node.id}`, JSON.stringify(generated));
        return { ...node, data: { ...node.data, copy: generated, _copyUpdated: Date.now() } };
      });
      
      setNodes(updatedNodes);
      setSaveStatus('unsaved');
      setIsGeneratingFullCopy(false);
    }, 500);
  };

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
        labelStyle: { fontSize: '10px', color: '#9ca3af', fontWeight: 400, background: 'rgba(255,255,255,0.8)', padding: '1px 6px', borderRadius: '4px' },
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

    const getStepTitle = (stepType: string) => {
      const p = formData.productName || 'Product';
      const words = p.split(' ');
      const shortName = words.length > 3 ? words.slice(-2).join(' ') : p;
      const price = formData.price || '$97';
      
      switch (stepType) {
        case 'Landing Page': return `Free ${shortName} Guide`;
        case 'Sales Page': return p;
        case 'Checkout': return `${price} Early Access`;
        case 'Order Bump': return 'Fast Track Add-On';
        case 'Upsell': return `${shortName} Pro`;
        case 'Downsell': return `${shortName} Basic`;
        case 'Thank You Page': return 'Access Your Purchase';
        case 'Email Follow-up': return 'Follow-Up Sequence';
        case 'Webinar': return `Free ${shortName} Training`;
        case 'Survey': return 'Quick Survey';
        case 'Application Page': return 'Apply Now';
        case 'Booking Page': return 'Book Your Call';
        default: return p;
      }
    };

    
const getDefaultTemplate = (type: string) => {
  switch (type) {
    case 'Landing Page': return 'hero_cta';
    case 'Sales Page': return 'classic_long_form';
    case 'Checkout': return 'simple_checkout';
    case 'Order Bump': return 'checkbox_bump';
    case 'Upsell': return 'upgrade_offer';
    case 'Downsell': return 'lite_version';
    case 'Thank You Page': return 'simple_confirmation';
    case 'Email Follow-up': return 'five_day_sequence';
    case 'Webinar': return 'registration_page';
    case 'Survey': return 'simple_survey';
    case 'Application Page': return 'simple_application';
    case 'Booking Page': return 'calendar_booking';
    default: return 'hero_cta';
  }
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
          revenue: `${Math.floor(Math.random() * 2000 + 100)}`,
          previewTemplate: getDefaultTemplate(step)
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
          labelStyle: { fontSize: '10px', color: '#9ca3af', fontWeight: 400, background: 'rgba(255,255,255,0.8)', padding: '1px 6px', borderRadius: '4px' },
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
      previewTemplate: node.data.previewTemplate as string,
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
      const tplName = (n.data.previewTemplate) ? (n.data.previewTemplate as string).split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Default';
      text += `**Template:** ${tplName}\n\n`;
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
        onWriteFullFunnel={handleWriteFullFunnel}
        isGeneratingFullCopy={isGeneratingFullCopy}
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
            onPreviewNode={(nodeId: string) => setPreviewNodeId(nodeId)}
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

      {previewNodeId && (
        <PagePreview
          isOpen={!!previewNodeId}
          onClose={() => setPreviewNodeId(null)}
          nodeId={previewNodeId}
          stepType={nodes.find(n => n.id === previewNodeId)?.data?.type as string || 'Landing Page'}
          title={nodes.find(n => n.id === previewNodeId)?.data?.title as string || 'Page'}
          previewTemplate={nodes.find(n => n.id === previewNodeId)?.data?.previewTemplate as string || ''}
          headline={nodes.find(n => n.id === previewNodeId)?.data?.headline as string}
          buttonText={nodes.find(n => n.id === previewNodeId)?.data?.buttonText as string}
          price={nodes.find(n => n.id === previewNodeId)?.data?.price as string}
          funnelSettings={funnelContext as any}
        />
      )}

      {copyPanelNode && (
        <CopyPanel 
          node={copyPanelNode}
          generatedCopy={copyPanelNode.data.copy || generatedCopy}
          onClose={() => setCopyPanelNode(null)}
          onSave={handleSaveCopy}
          onRegenerate={handleRegenerateCopy}
        />
      )}

      {showRewriteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              ⚠️ Rewrite All Funnel Copy?
            </h2>
            <p className="text-gray-600 mb-6">
              All existing generated copy will be replaced with fresh copy based on your current funnel settings and selected templates.
              <br/><br/>
              This cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowRewriteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRewriteAll}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Rewrite All Copy
              </button>
            </div>
          </div>
        </div>
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

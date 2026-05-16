import React, { useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Connection,
  Edge,
  Node,
  useReactFlow,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import FunnelNode from './FunnelNode';

const nodeTypes = {
  funnelNode: FunnelNode,
};

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEditNode: (node: Node) => void;
  onGenerateCopy: (node: Node) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
}

export default function Canvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  setNodes,
  setEdges,
  onEditNode,
  onGenerateCopy,
  setSaveStatus
}: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: 'funnelNode',
        position,
        data: { 
          title: `New ${type}`,
          type: type,
          url: type.toLowerCase().replace(/\s+/g, '-'),
          description: '',
          visitors: Math.floor(Math.random() * 500 + 100).toString(),
          conversion: `${(Math.random() * 30 + 5).toFixed(1)}%`,
          revenue: `$${Math.floor(Math.random() * 2000 + 100)}`
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSaveStatus('unsaved');
    },
    [screenToFlowPosition, setNodes, setSaveStatus]
  );

  const handleAddNext = useCallback((sourceNode: Node, type: string) => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'funnelNode',
      position: { x: sourceNode.position.x + 320, y: sourceNode.position.y },
      data: {
        title: `New ${type}`,
        type: type,
        url: type.toLowerCase().replace(/\s+/g, '-'),
        description: '',
        visitors: Math.floor(Math.random() * 500 + 100).toString(),
        conversion: `${(Math.random() * 30 + 5).toFixed(1)}%`,
        revenue: `$${Math.floor(Math.random() * 2000 + 100)}`
      }
    };

    const newEdge: Edge = {
      id: `e-${sourceNode.id}-${newNodeId}`,
      source: sourceNode.id,
      target: newNodeId,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
    setSaveStatus('unsaved');
  }, [setNodes, setEdges, setSaveStatus]);

  // Inject callbacks into nodes for edit/delete
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEdit: () => onEditNode(node),
      onDelete: () => {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
        setSaveStatus('unsaved');
      },
      onAddNext: (type: string) => handleAddNext(node, type),
      onGenerateCopy: () => onGenerateCopy(node)
    }
  }));

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    const deletedIds = deletedNodes.map(n => n.id);
    setEdges(eds => eds.filter(e => !deletedIds.includes(e.source) && !deletedIds.includes(e.target)));
    setSaveStatus('unsaved');
  }, [setEdges, setSaveStatus]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E7EB" />
        <Controls showInteractive={false} className="bg-white shadow-md border border-gray-100 rounded-lg overflow-hidden" />
        <div className="absolute bottom-6 left-6 z-10 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-gray-500 border border-gray-200 shadow-sm pointer-events-none">
          Press <strong>Del</strong> or <strong>Backspace</strong> to remove selected nodes
        </div>
        <MiniMap 
          className="border border-gray-200 rounded-lg shadow-sm" 
          nodeColor={() => '#9CA3AF'}
          maskColor="rgba(249, 250, 251, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}

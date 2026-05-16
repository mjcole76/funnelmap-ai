import React, { useMemo } from 'react';
import { X, ArrowRight, ExternalLink, GitBranch } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

interface PreviewModalProps {
  isOpen: boolean;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

export default function PreviewModal({ isOpen, nodes, edges, onClose }: PreviewModalProps) {
  // Sort or group nodes to show branching
  const layout = useMemo(() => {
    if (nodes.length === 0) return [];
    
    // Find nodes with no incoming edges (roots)
    const targets = new Set(edges.map(e => e.target));
    const roots = nodes.filter(n => !targets.has(n.id));
    
    // If there are loops or no roots, just fallback to whatever
    let startNodes = roots.length > 0 ? roots : [nodes[0]];
    
    // Build adjacency list
    const adj = new Map<string, string[]>();
    edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      adj.get(e.source)!.push(e.target);
    });

    // BFS to get layers
    const layers: Node[][] = [];
    const visited = new Set<string>();
    
    let currentLayer = startNodes;
    while (currentLayer.length > 0) {
      layers.push(currentLayer);
      const nextLayer: Node[] = [];
      
      currentLayer.forEach(n => {
        visited.add(n.id);
        const children = adj.get(n.id) || [];
        children.forEach(childId => {
          if (!visited.has(childId)) {
            const childNode = nodes.find(node => node.id === childId);
            if (childNode) {
              nextLayer.push(childNode);
              visited.add(childId);
            }
          }
        });
      });
      
      currentLayer = Array.from(new Set(nextLayer)); // Unique next layer
    }
    
    // Add any unvisited nodes to a final layer
    const unvisited = nodes.filter(n => !visited.has(n.id));
    if (unvisited.length > 0) {
      layers.push(unvisited);
    }
    
    return layers;
  }, [nodes, edges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col backdrop-blur-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
          Funnel Flow Preview
        </h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-12 flex flex-col items-center justify-center">
        {layout.length === 0 ? (
          <div className="text-gray-400 text-center">
            <p className="text-lg">Your funnel is empty.</p>
            <p className="text-sm mt-2">Add some steps to the canvas to see the preview.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 max-w-full pb-8">
            {layout.map((layer, layerIdx) => (
              <React.Fragment key={layerIdx}>
                <div className="flex flex-row items-center justify-center gap-8 flex-wrap">
                  {layer.map((node) => (
                    <div key={node.id} className="bg-white rounded-xl p-6 shadow-2xl w-64 flex-shrink-0 relative overflow-hidden group border border-gray-100">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {node.data.type as string}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                        {node.data.title as string}
                      </h3>
                      <div className="text-sm text-gray-500 mb-4 truncate">
                        /{node.data.url as string || 'path'}
                      </div>
                      <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        View Live Page
                      </button>
                    </div>
                  ))}
                </div>
                
                {layerIdx < layout.length - 1 && (
                  <div className="flex items-center justify-center text-gray-500">
                    {layer.length > 1 || layout[layerIdx + 1].length > 1 ? (
                      <GitBranch className="w-8 h-8 rotate-180" />
                    ) : (
                      <ArrowRight className="w-8 h-8 rotate-90" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

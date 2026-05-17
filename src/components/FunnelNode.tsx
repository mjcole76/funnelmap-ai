import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Edit2, Eye, Trash2, Plus, Wand2, FileText } from 'lucide-react';
import { STEP_TYPES } from './Sidebar';

interface FunnelNodeData {
  title: string;
  type: string;
  visitors?: string;
  conversion?: string;
  revenue?: string;
  copy?: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNext?: (type: string) => void;
  onGenerateCopy?: () => void;
}

export default function FunnelNode({ data }: { data: FunnelNodeData }) {
  const stepInfo = STEP_TYPES.find(s => s.type === data.type) || STEP_TYPES[7];
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const hasCopy = !!data.copy;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-[240px] h-[190px] relative group overflow-visible node-pop-in hover:shadow-md transition-all flex flex-col">
      {/* Top color bar */}
      <div 
        className="h-1 w-full absolute top-0 left-0 right-0 rounded-t-lg" 
        style={{ backgroundColor: stepInfo.color }} 
      />
      
      {/* Copy Indicator */}
      {hasCopy && (
        <div className="absolute top-2 right-2 text-blue-500" title="Has Generated Copy">
          <FileText className="w-4 h-4" />
        </div>
      )}

      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-[200px]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-0.5 block">
              {data.type}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2" title={data.title}>
              {data.title}
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto mb-2">
          <div>
            <div className="text-[9px] text-gray-500 mb-0.5">Visitors</div>
            <div className="text-xs font-medium text-gray-900">{data.visitors || '0'}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500 mb-0.5">Conversion</div>
            <div className="text-xs font-medium text-gray-900">{data.conversion || '0%'}</div>
          </div>
          {data.revenue && (
            <div className="col-span-2 mt-0.5">
              <div className="text-[9px] text-gray-500 mb-0.5">Revenue</div>
              <div className="text-xs font-medium text-green-600">{data.revenue}</div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex flex-col space-y-2 mt-2">
          {/* Write This Step Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); data.onGenerateCopy?.(); }}
            className={`w-full py-1.5 text-xs font-medium rounded-md flex items-center justify-center transition-colors ${
              hasCopy 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            {hasCopy ? (
              <>
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                View Copy
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                Write This Step
              </>
            )}
          </button>

          <div className="flex justify-between items-center border-t border-gray-100 pt-1.5">
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); data.onEdit?.(); }}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); data.onDelete?.(); }}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-gray-400" />

      {/* Add Next Step Button */}
      <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20">
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-5 h-5 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Add Next Step"
          >
            <Plus className="w-3 h-3" />
          </button>

          {showAddMenu && (
            <div className="absolute top-0 left-6 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 max-h-60 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase">Add Next</div>
              {STEP_TYPES.map(step => (
                <button
                  key={step.type}
                  onClick={() => {
                    data.onAddNext?.(step.type);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: step.color }} />
                  {step.type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

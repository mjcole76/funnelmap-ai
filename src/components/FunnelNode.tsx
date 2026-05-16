import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { STEP_TYPES } from './Sidebar';

interface FunnelNodeData {
  title: string;
  type: string;
  visitors?: string;
  conversion?: string;
  revenue?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FunnelNode({ data }: { data: FunnelNodeData }) {
  const stepInfo = STEP_TYPES.find(s => s.type === data.type) || STEP_TYPES[7];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-[220px] relative group overflow-hidden node-pop-in">
      {/* Top color bar */}
      <div 
        className="h-1 w-full absolute top-0 left-0 right-0" 
        style={{ backgroundColor: stepInfo.color }} 
      />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 mt-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
              {data.type}
            </span>
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-2" title={data.title}>
              {data.title}
            </h3>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white">
            <button 
              onClick={(e) => { e.stopPropagation(); data.onEdit?.(); }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Preview"
            >
              <Eye className="w-3.5 h-3.5" />
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

        {/* Stats */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
          <div>
            <div className="text-[10px] text-gray-500 mb-0.5">Visitors</div>
            <div className="text-xs font-medium text-gray-900">{data.visitors || '0'}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-0.5">Conversion</div>
            <div className="text-xs font-medium text-gray-900">{data.conversion || '0%'}</div>
          </div>
          {data.revenue && (
            <div className="col-span-2 mt-1">
              <div className="text-[10px] text-gray-500 mb-0.5">Revenue</div>
              <div className="text-xs font-medium text-green-600">{data.revenue}</div>
            </div>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-gray-400" />
    </div>
  );
}

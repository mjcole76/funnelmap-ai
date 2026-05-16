import React, { useState } from 'react';
import { BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Node } from '@xyflow/react';

interface AnalyticsPanelProps {
  nodes: Node[];
}

export default function AnalyticsPanel({ nodes }: AnalyticsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Aggregate stats
  let totalVisitors = 0;
  let totalRevenue = 0;
  let sumConversion = 0;
  let countConversion = 0;

  nodes.forEach(node => {
    const v = parseInt((node.data.visitors as string || '0').replace(/[^0-9]/g, ''), 10);
    const r = parseFloat((node.data.revenue as string || '0').replace(/[^0-9.]/g, ''));
    const c = parseFloat((node.data.conversion as string || '0').replace(/[^0-9.]/g, ''));
    
    if (!isNaN(v)) totalVisitors += v;
    if (!isNaN(r)) totalRevenue += r;
    if (!isNaN(c) && c > 0) {
      sumConversion += c;
      countConversion++;
    }
  });

  const avgConversion = countConversion > 0 ? (sumConversion / countConversion).toFixed(1) : '0';
  const epc = totalVisitors > 0 ? (totalRevenue / totalVisitors).toFixed(2) : '0.00';

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 right-6 z-10 bg-white shadow-md border border-gray-200 rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors"
      >
        <BarChart2 className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Analytics</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-10 w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all">
      <div 
        className="px-4 py-3 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center space-x-2 text-gray-800">
          <BarChart2 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold">Funnel Analytics</h3>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Conversion</p>
            <p className="text-sm font-semibold text-gray-900">{avgConversion}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Earnings per Click</p>
            <p className="text-sm font-semibold text-gray-900">${epc}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Total Revenue</span>
            <span className="text-sm font-medium text-green-600">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Nodes</span>
            <span className="text-sm font-medium text-gray-900">{nodes.length}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total Visitors</p>
            <p className="text-lg font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

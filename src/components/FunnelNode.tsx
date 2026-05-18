import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Edit2, Eye, Trash2, Plus, Wand2, FileText, Layout } from 'lucide-react';
import { STEP_TYPES } from './Sidebar';
import { MiniPreview } from './MiniPreview';

interface FunnelNodeData {
  title: string;
  type: string;
  visitors?: string;
  conversion?: string;
  revenue?: string;
  copy?: any;
  previewTemplate?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNext?: (type: string) => void;
  onGenerateCopy?: () => void;
  onPreview?: () => void;
  onBuildTemplate?: () => void;
  onEditPage?: () => void;
}

export default function FunnelNode({ data }: { data: FunnelNodeData }) {
  const stepInfo = STEP_TYPES.find(s => s.type === data.type) || STEP_TYPES[7];
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const hasCopy = !!data.copy;
  
  // Default template mapping if none provided
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

  const currentTemplate = data.previewTemplate || getDefaultTemplate(data.type);

  const getReadableTemplateName = (tplId: string) => {
    const map: Record<string, string> = {
      'hero_cta': 'Hero + CTA',
      'classic_long_form': 'Classic Long Form',
      'simple_checkout': 'Simple Checkout',
      'checkbox_bump': 'Checkbox Bump',
      'upgrade_offer': 'Upgrade Offer',
      'lite_version': 'Lite Version',
      'simple_confirmation': 'Simple Confirmation',
      'five_day_sequence': '5-Day Sequence',
    };
    return map[tplId] || tplId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Get single metric based on step type
  const renderMetric = () => {
    switch (data.type) {
      case 'Landing Page':
      case 'Sales Page':
        return { label: 'Conv:', value: data.conversion || '0%' };
      case 'Checkout':
        return { label: 'Rev:', value: data.revenue || '$0' };
      case 'Order Bump':
        return { label: 'Attach:', value: data.conversion || '0%' };
      case 'Upsell':
        return { label: 'Take:', value: data.conversion || '0%' };
      case 'Downsell':
        return { label: 'Recovery:', value: data.conversion || '0%' };
      case 'Thank You Page':
        return { label: 'Completed:', value: data.visitors || '0' };
      case 'Email Follow-up':
        return { label: 'Open:', value: data.conversion || '0%' };
      case 'Webinar':
        return { label: 'Registrations:', value: data.visitors || '0' };
      case 'Survey':
        return { label: 'Completions:', value: data.visitors || '0' };
      case 'Application Page':
        return { label: 'Applications:', value: data.visitors || '0' };
      case 'Booking Page':
        return { label: 'Bookings:', value: data.visitors || '0' };
      default:
        return { label: 'Conv:', value: data.conversion || '0%' };
    }
  };

  const metric = renderMetric();
  
  const headline = data.copy?.headline || data.copy?.title;
  const buttonText = data.copy?.cta || data.copy?.button;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-[260px] relative group overflow-visible node-pop-in hover:shadow-md transition-all flex flex-col pb-2">
      {/* 1. Colored top border */}
      <div 
        className="h-1 w-full absolute top-0 left-0 right-0 rounded-t-lg" 
        style={{ backgroundColor: stepInfo.color }} 
      />

      <div className="p-3 flex-1 flex flex-col">
        {/* 2. Step type label + status dot */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 flex items-center">
              {data.type}
              {hasCopy && (
                <div className="w-2 h-2 rounded-full bg-green-500 ml-2" title="Has Generated Copy"></div>
              )}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">{getReadableTemplateName(currentTemplate)}</span>
          </div>
        </div>

        {/* 3. Step title */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2" title={data.title}>
          {data.title}
        </h3>

        {/* 4. Mini preview area */}
        <div className="mb-2">
          <MiniPreview 
            stepType={data.type} 
            template={currentTemplate} 
            hasCopy={hasCopy}
            headline={headline}
            buttonText={buttonText}
          />
        </div>

        {/* 5. Single metric row */}
        <div className="flex items-center text-xs font-medium text-gray-700 bg-gray-50 rounded px-2 py-1 mb-2">
          <span className="text-gray-500 mr-1">{metric.label}</span>
          <span>{metric.value}</span>
        </div>

        {/* 6. Action buttons row */}
        <div className="flex space-x-1">
          <button 
            onClick={(e) => { e.stopPropagation(); data.onGenerateCopy?.(); }}
            className={`flex-1 py-1 px-1 text-[10px] font-medium rounded flex items-center justify-center transition-colors ${
              hasCopy 
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            {hasCopy ? (
              <><FileText className="w-3 h-3 mr-1" />Write</>
            ) : (
              <><Wand2 className="w-3 h-3 mr-1" />Write</>
            )}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); data.onBuildTemplate?.(); }}
            className="flex-1 py-1 px-1 text-[10px] font-medium rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center justify-center transition-colors"
            title="Build Template"
          >
            <Layout className="w-3 h-3 mr-1" />
            Layout
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); hasCopy ? data.onEditPage?.() : data.onEdit?.(); }}
            className={`flex-1 py-1 px-1 text-[10px] font-medium rounded flex items-center justify-center transition-colors ${
              hasCopy
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </button>

          <button 
             onClick={(e) => { e.stopPropagation(); data.onPreview?.(); }}
            className="flex-1 py-1 px-1 text-[10px] font-medium rounded bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); data.onDelete?.(); }}
            className="p-1 text-gray-400 hover:text-red-600 rounded bg-gray-50 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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

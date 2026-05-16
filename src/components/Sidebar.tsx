import React from 'react';
import { 
  ShoppingCart, 
  CreditCard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Heart, 
  Mail, 
  Layout, 
  FileText,
  Package,
  Send,
  Video,
  ClipboardList,
  FileSignature,
  Calendar
} from 'lucide-react';

export const STEP_TYPES = [
  { type: 'Sales Page', icon: ShoppingCart, color: '#3B82F6' },
  { type: 'Checkout', icon: CreditCard, color: '#10B981' },
  { type: 'Upsell', icon: ArrowUpCircle, color: '#8B5CF6' },
  { type: 'Downsell', icon: ArrowDownCircle, color: '#F59E0B' },
  { type: 'Thank You Page', icon: Heart, color: '#14B8A6' },
  { type: 'Opt-in Page', icon: Mail, color: '#EC4899' },
  { type: 'Landing Page', icon: Layout, color: '#6366F1' },
  { type: 'Order Bump', icon: Package, color: '#EF4444' },
  { type: 'Email Follow-up', icon: Send, color: '#8B5CF6' },
  { type: 'Webinar', icon: Video, color: '#06B6D4' },
  { type: 'Survey', icon: ClipboardList, color: '#84CC16' },
  { type: 'Application Page', icon: FileSignature, color: '#F97316' },
  { type: 'Booking Page', icon: Calendar, color: '#0EA5E9' },
  { type: 'Custom Page', icon: FileText, color: '#6B7280' },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-[250px] bg-white border-r border-gray-200 h-full flex flex-col z-10">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Add Step</h2>
      </div>
      <div className="p-3 overflow-y-auto flex-1 space-y-2">
        {STEP_TYPES.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.type}
              className="flex items-center p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => onDragStart(e, step.type)}
            >
              <div 
                className="w-8 h-8 rounded flex items-center justify-center mr-3 text-white"
                style={{ backgroundColor: step.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">{step.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

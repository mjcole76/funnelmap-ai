import React, { useState, useEffect } from 'react';
import { X, Save, Settings2, LayoutTemplate } from 'lucide-react';
import { Node } from '@xyflow/react';
import { MiniPreview } from './MiniPreview';

interface SettingsDrawerProps {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
}

const TEMPLATE_OPTIONS: Record<string, { id: string; name: string }[]> = {
  'Landing Page': [
    { id: 'hero_cta', name: 'Hero + CTA' },
    { id: 'lead_magnet', name: 'Lead Magnet' },
    { id: 'split_layout', name: 'Split Layout' },
    { id: 'checklist_opt_in', name: 'Checklist' },
    { id: 'video_opt_in', name: 'Video Opt-in' }
  ],
  'Sales Page': [
    { id: 'classic_long_form', name: 'Long Form' },
    { id: 'short_offer', name: 'Short Offer' },
    { id: 'problem_solution', name: 'Prob/Sol' },
    { id: 'proof_first', name: 'Proof First' },
    { id: 'stacked_offer', name: 'Stacked' }
  ],
  'Checkout': [
    { id: 'simple_checkout', name: 'Simple' },
    { id: 'order_summary', name: 'Summary' },
    { id: 'trust_checkout', name: 'Trust' },
    { id: 'two_column', name: '2-Column' },
    { id: 'early_access', name: 'Early Access' }
  ],
  'Order Bump': [
    { id: 'checkbox_bump', name: 'Checkbox' },
    { id: 'bonus_box', name: 'Bonus Box' },
    { id: 'cheat_sheet', name: 'Cheat Sheet' },
    { id: 'fast_win', name: 'Fast Win' },
    { id: 'toolkit', name: 'Toolkit' }
  ],
  'Upsell': [
    { id: 'upgrade_offer', name: 'Upgrade' },
    { id: 'premium_bundle', name: 'Bundle' },
    { id: 'done_for_you', name: 'Done For You' },
    { id: 'speed_boost', name: 'Speed Boost' },
    { id: 'vip_access', name: 'VIP Access' }
  ],
  'Downsell': [
    { id: 'lite_version', name: 'Lite Ver' },
    { id: 'payment_plan', name: 'Payment Plan' },
    { id: 'starter_offer', name: 'Starter' },
    { id: 'single_resource', name: 'Single Res' },
    { id: 'trial_offer', name: 'Trial Offer' }
  ],
  'Thank You Page': [
    { id: 'simple_confirmation', name: 'Simple' },
    { id: 'access_instructions', name: 'Steps' },
    { id: 'next_steps', name: 'Next Steps' },
    { id: 'bonus_delivery', name: 'Bonus' },
    { id: 'community_invite', name: 'Community' }
  ],
  'Email Follow-up': [
    { id: 'five_day_sequence', name: '5-Day' },
    { id: 'welcome_sequence', name: 'Welcome' },
    { id: 'abandoned_checkout', name: 'Abandoned' },
    { id: 'post_purchase_nurture', name: 'Nurture' },
    { id: 'promo_sequence', name: 'Promo' }
  ],
  'Webinar': [
    { id: 'registration_page', name: 'Register' },
    { id: 'training_invite', name: 'Invite' },
    { id: 'countdown_page', name: 'Countdown' },
    { id: 'speaker_feature', name: 'Speaker' },
    { id: 'replay_page', name: 'Replay' }
  ],
  'Survey': [
    { id: 'simple_survey', name: 'Simple' },
    { id: 'buyer_research', name: 'Research' },
    { id: 'quiz_funnel', name: 'Quiz' },
    { id: 'feedback_form', name: 'Feedback' },
    { id: 'qualification_survey', name: 'Qualify' }
  ],
  'Application Page': [
    { id: 'simple_application', name: 'Simple' },
    { id: 'qualification_form', name: 'Qualify' },
    { id: 'coaching_application', name: 'Coaching' },
    { id: 'service_intake', name: 'Intake' },
    { id: 'high_ticket_filter', name: 'Filter' }
  ],
  'Booking Page': [
    { id: 'calendar_booking', name: 'Calendar' },
    { id: 'discovery_call', name: 'Discovery' },
    { id: 'strategy_session', name: 'Strategy' },
    { id: 'demo_call', name: 'Demo' },
    { id: 'consultation_page', name: 'Consult' }
  ]
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

export default function SettingsDrawer({ node, onClose, onSave }: SettingsDrawerProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.data.title || '',
        type: node.data.type || '',
        headline: node.data.headline || '',
        url: node.data.url || '',
        buttonText: node.data.buttonText || '',
        price: node.data.price || '',
        visitors: node.data.visitors || '',
        conversion: node.data.conversion || '',
        revenue: node.data.revenue || '',
        notes: node.data.notes || '',
        previewTemplate: node.data.previewTemplate || getDefaultTemplate(node.data.type as string),
      });
    }
  }, [node]);

  if (!node) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const newData = { ...formData, previewTemplate: templateId };
    setFormData(newData);
    // Requirements say "Clicking a template updates previewTemplate in the node data immediately"
    onSave(node.id, newData);
  };

  const handleSave = () => {
    onSave(node.id, formData);
  };

  const templates = TEMPLATE_OPTIONS[formData.type] || [];

  return (
    <div className="absolute right-0 top-14 bottom-0 w-[350px] bg-white border-l border-gray-200 shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 text-gray-800">
          <Settings2 className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Step Settings</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Step Type</label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 font-medium">
              {formData.type}
            </div>
          </div>

          {templates.length > 0 && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                <LayoutTemplate className="w-3.5 h-3.5 mr-1 text-gray-500" />
                Preview Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className={`flex flex-col items-center p-1 rounded-md border transition-all ${
                      formData.previewTemplate === tpl.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-[60px] pointer-events-none transform scale-75 origin-top">
                      <MiniPreview 
                        stepType={formData.type} 
                        template={tpl.id} 
                        headline={formData.headline}
                        buttonText={formData.buttonText}
                        price={formData.price}
                        hasCopy={!!node.data.copy}
                      />
                    </div>
                    <span className={`text-[10px] mt-1 ${formData.previewTemplate === tpl.id ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                      {tpl.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-700 mb-1">Step Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. Main Sales Page"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. Discover the secrets to..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. Buy Now"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. $47"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Visitors</label>
                <input
                  type="text"
                  name="visitors"
                  value={formData.visitors}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Conversion</label>
                <input
                  type="text"
                  name="conversion"
                  value={formData.conversion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="12.5%"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Revenue</label>
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-green-600"
                placeholder="$2,350"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

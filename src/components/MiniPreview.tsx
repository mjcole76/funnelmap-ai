import React from 'react';

export interface MiniPreviewProps {
  stepType: string;
  template: string;
  headline?: string;
  buttonText?: string;
  price?: string;
  hasCopy?: boolean;
}

export function MiniPreview({ stepType, template, headline, buttonText, price, hasCopy }: MiniPreviewProps) {
  const btnColor = stepType === 'Landing Page' ? 'bg-blue-500' :
                   stepType === 'Sales Page' ? 'bg-green-500' :
                   stepType === 'Checkout' ? 'bg-purple-500' :
                   stepType === 'Order Bump' ? 'bg-yellow-500' :
                   stepType === 'Upsell' ? 'bg-orange-500' :
                   stepType === 'Downsell' ? 'bg-red-500' :
                   stepType === 'Thank You Page' ? 'bg-teal-500' :
                   stepType === 'Email Follow-up' ? 'bg-gray-700' : 'bg-indigo-500';

  const renderContent = () => {
    switch (stepType) {
      case 'Landing Page':
        switch (template) {
          case 'hero_cta':
            return (
              <div className="flex flex-col items-center justify-center h-full space-y-2 p-2">
                <div className="w-4/5 h-4 bg-gray-600 rounded"></div>
                <div className="w-3/5 h-2 bg-gray-400 rounded"></div>
                <div className="w-2/5 h-2 bg-gray-400 rounded"></div>
                <div className={`w-1/2 h-4 ${btnColor} rounded mt-2`}></div>
              </div>
            );
          case 'lead_magnet':
            return (
              <div className="flex h-full w-full p-2 items-center space-x-2">
                <div className="flex-1 flex flex-col space-y-1.5">
                  <div className="w-full h-3 bg-gray-600 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-400 rounded"></div>
                  <div className={`w-full h-3 ${btnColor} rounded mt-1`}></div>
                </div>
                <div className="w-1/3 h-16 bg-gray-300 rounded border border-gray-400 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-gray-400 rounded-sm"></div>
                </div>
              </div>
            );
          case 'split_layout':
            return (
              <div className="flex h-full w-full p-2 items-center space-x-2">
                <div className="flex-1 flex flex-col space-y-1.5">
                  <div className="w-full h-3 bg-gray-600 rounded"></div>
                  <div className="w-full h-2 bg-gray-400 rounded"></div>
                  <div className={`w-full h-3 ${btnColor} rounded mt-1`}></div>
                </div>
                <div className="w-1/2 h-16 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-[8px]">IMG</span>
                </div>
              </div>
            );
          case 'checklist_opt_in':
            return (
              <div className="flex flex-col h-full space-y-1.5 p-2">
                <div className="w-3/4 h-3 bg-gray-600 rounded mb-1 mx-auto"></div>
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center space-x-1 pl-4">
                    <div className="w-2 h-2 border border-gray-500 rounded-sm flex-shrink-0"></div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                ))}
                <div className={`w-1/2 h-3 ${btnColor} rounded mt-1 mx-auto`}></div>
              </div>
            );
          case 'video_opt_in':
            return (
              <div className="flex flex-col items-center h-full p-2 space-y-1.5">
                <div className="w-3/4 h-10 bg-gray-300 rounded flex items-center justify-center">
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-gray-600 border-b-4 border-b-transparent ml-1"></div>
                </div>
                <div className="w-2/3 h-2 bg-gray-400 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Sales Page':
        switch (template) {
          case 'classic_long_form':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5">
                <div className="w-4/5 h-3 bg-gray-600 rounded mx-auto"></div>
                <div className="w-full h-8 bg-gray-300 rounded"></div>
                <div className="flex flex-col space-y-1 pl-2">
                  <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                </div>
                <div className={`w-1/2 h-3 ${btnColor} rounded mx-auto`}></div>
              </div>
            );
          case 'short_offer':
            return (
              <div className="flex flex-col items-center h-full p-2 space-y-1.5 justify-center">
                <div className="w-3/4 h-3 bg-gray-600 rounded"></div>
                <div className="w-2/3 h-2 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
                <div className="w-1/3 h-4 bg-green-100 border border-green-300 rounded flex items-center justify-center text-[6px] text-green-700">{price || '$97'}</div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'problem_solution':
            return (
              <div className="flex flex-col h-full p-2 justify-center space-y-1">
                <div className="w-full h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center"><div className="w-1/2 h-1 bg-red-300 rounded"></div></div>
                <div className="mx-auto text-[8px] text-gray-400">↓</div>
                <div className="w-full h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center"><div className="w-1/2 h-1 bg-green-300 rounded"></div></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded mx-auto mt-1`}></div>
              </div>
            );
          case 'proof_first':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5">
                <div className="w-full h-6 bg-gray-100 border border-gray-300 rounded flex items-start p-1 space-x-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <div className="flex-1 flex flex-col space-y-0.5 mt-0.5">
                    <div className="w-full h-1 bg-gray-400 rounded"></div>
                    <div className="w-2/3 h-1 bg-gray-400 rounded"></div>
                  </div>
                </div>
                <div className="w-3/4 h-3 bg-gray-600 rounded mx-auto"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded mx-auto`}></div>
              </div>
            );
          case 'stacked_offer':
            return (
              <div className="flex flex-col h-full p-2 space-y-1">
                <div className="w-3/4 h-3 bg-gray-600 rounded"></div>
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center space-x-1">
                    <div className="text-[8px] text-green-500">✓</div>
                    <div className="w-2/3 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                ))}
                <div className={`w-2/3 h-3 ${btnColor} rounded mt-1`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Checkout':
        switch (template) {
          case 'simple_checkout':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-2">
                <div className="w-2/3 h-3 bg-gray-600 rounded"></div>
                <div className="w-1/3 h-4 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">{price || '$97'}</div>
                <div className={`w-3/4 h-4 ${btnColor} rounded`}></div>
              </div>
            );
          case 'order_summary':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5">
                <div className="w-full h-12 bg-gray-100 border border-gray-300 rounded p-1 flex flex-col space-y-1">
                  <div className="flex justify-between"><div className="w-1/2 h-1.5 bg-gray-500 rounded"></div><div className="w-1/4 h-1.5 bg-gray-500 rounded"></div></div>
                  <div className="flex justify-between"><div className="w-1/3 h-1.5 bg-gray-400 rounded"></div><div className="w-1/5 h-1.5 bg-gray-400 rounded"></div></div>
                  <div className="w-full border-t border-gray-300 mt-0.5 pt-0.5 flex justify-between"><div className="w-1/4 h-2 bg-gray-600 rounded"></div><div className="w-1/4 h-2 bg-gray-600 rounded"></div></div>
                </div>
                <div className={`w-full h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'trust_checkout':
            return (
              <div className="flex flex-col items-center h-full p-2 space-y-1.5 justify-center">
                <div className="w-4 h-4 text-[10px]">🔒</div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className="flex space-x-1">
                  <div className="w-4 h-3 bg-gray-300 rounded"></div>
                  <div className="w-4 h-3 bg-gray-300 rounded"></div>
                  <div className="w-4 h-3 bg-gray-300 rounded"></div>
                </div>
                <div className={`w-3/4 h-4 ${btnColor} rounded`}></div>
              </div>
            );
          case 'two_column':
            return (
              <div className="flex h-full w-full p-2 space-x-1.5">
                <div className="w-1/2 flex flex-col space-y-1 border-r border-gray-200 pr-1">
                  <div className="w-full h-2 bg-gray-600 rounded"></div>
                  <div className="w-full h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/2 flex flex-col space-y-1">
                  <div className="w-full h-2 bg-gray-300 rounded"></div>
                  <div className="w-full h-2 bg-gray-300 rounded"></div>
                  <div className={`w-full h-3 ${btnColor} rounded mt-auto`}></div>
                </div>
              </div>
            );
          case 'early_access':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[6px] rounded-full border border-yellow-300">EARLY ACCESS</div>
                <div className="w-3/4 h-3 bg-gray-600 rounded"></div>
                <div className={`w-3/4 h-4 ${btnColor} rounded mt-1`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Order Bump':
        switch (template) {
          case 'checkbox_bump':
            return (
              <div className="flex flex-col justify-center h-full p-2">
                <div className="w-full h-12 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded p-1 flex flex-col">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-white border border-gray-400 rounded-sm flex-shrink-0"></div>
                    <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-400 rounded mt-1 ml-4"></div>
                  <div className="w-1/2 h-1.5 bg-gray-400 rounded mt-0.5 ml-4"></div>
                </div>
              </div>
            );
          case 'bonus_box':
            return (
              <div className="flex flex-col justify-center h-full p-2">
                <div className="w-full h-12 border-2 border-red-300 bg-red-50 rounded p-1 relative mt-2">
                  <div className="absolute -top-2 left-2 bg-red-500 text-white text-[5px] px-1 rounded">BONUS</div>
                  <div className="w-3/4 h-2 bg-gray-700 rounded mt-1"></div>
                  <div className="w-full h-1.5 bg-gray-400 rounded mt-1"></div>
                </div>
              </div>
            );
          case 'cheat_sheet':
            return (
              <div className="flex items-center justify-center h-full p-2">
                <div className="w-full bg-blue-50 border border-blue-200 rounded p-1.5 flex items-center space-x-2">
                  <div className="text-[10px]">📄</div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                  <div className="px-1 py-0.5 bg-green-100 text-green-700 text-[6px] rounded border border-green-300">{price || '+$17'}</div>
                </div>
              </div>
            );
          case 'fast_win':
            return (
              <div className="flex items-center justify-center h-full p-2">
                <div className="w-full bg-orange-50 border border-orange-200 rounded p-1.5 flex items-center space-x-2">
                  <div className="text-[10px]">⚡</div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
            );
          case 'toolkit':
            return (
              <div className="flex flex-col justify-center h-full p-2">
                <div className="w-full bg-gray-50 border border-gray-200 rounded p-1">
                  <div className="flex space-x-1 mb-1">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                </div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Upsell':
        switch (template) {
          case 'upgrade_offer':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="bg-orange-100 text-orange-700 text-[6px] px-1 py-0.5 rounded border border-orange-300">UPGRADE</div>
                <div className="w-4/5 h-3 bg-gray-600 rounded"></div>
                <div className={`w-3/4 h-4 ${btnColor} rounded`}></div>
                <div className="w-1/3 h-1 bg-gray-300 rounded"></div>
              </div>
            );
          case 'premium_bundle':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'done_for_you':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">🤝</div>
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className={`w-2/3 h-3 ${btnColor} rounded`}></div>
                <div className="w-1/4 h-1 bg-gray-300 rounded"></div>
              </div>
            );
          case 'speed_boost':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">🚀</div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'vip_access':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px] text-yellow-500">⭐</div>
                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Downsell':
        switch (template) {
          case 'lite_version':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-1/2 h-8 bg-gray-200 border border-gray-300 rounded"></div>
                <div className="w-1/3 h-3 bg-green-50 text-green-700 border border-green-200 rounded flex items-center justify-center text-[6px]">Only $47</div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'payment_plan':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-[8px] font-bold">3x $33</div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'starter_offer':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-full h-10 border border-gray-300 rounded p-1 flex flex-col justify-center items-center">
                  <div className="w-1/2 h-1.5 bg-gray-600 rounded mb-1"></div>
                  <div className="w-1/3 h-1 bg-gray-400 rounded"></div>
                </div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'single_resource':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">📄</div>
                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'trial_offer':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="bg-blue-100 text-blue-700 text-[6px] px-1 py-0.5 rounded border border-blue-300">7 DAYS FREE</div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Thank You Page':
        switch (template) {
          case 'simple_confirmation':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 text-[10px]">✓</div>
                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                <div className="w-3/4 h-1.5 bg-gray-400 rounded"></div>
              </div>
            );
          case 'access_instructions':
            return (
              <div className="flex flex-col h-full p-2 justify-center space-y-1.5">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full flex items-center justify-center text-[6px]">1</div>
                  <div className="w-2/3 h-1.5 bg-gray-600 rounded"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full flex items-center justify-center text-[6px]">2</div>
                  <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                </div>
                <div className={`w-1/2 h-3 ${btnColor} rounded ml-4 mt-1`}></div>
              </div>
            );
          case 'next_steps':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1">
                <div className="w-3/4 h-2 bg-gray-600 rounded mb-1"></div>
                <div className="flex space-x-1 items-center">
                  <div className="w-6 h-4 bg-gray-200 rounded"></div>
                  <div className="text-[8px] text-gray-400">→</div>
                  <div className="w-6 h-4 bg-gray-200 rounded"></div>
                  <div className="text-[8px] text-gray-400">→</div>
                  <div className="w-6 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            );
          case 'bonus_delivery':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[14px]">🎁</div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'community_invite':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[14px]">👥</div>
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Email Follow-up':
        switch (template) {
          case 'five_day_sequence':
            return (
              <div className="flex items-center justify-center h-full p-2 space-x-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex flex-col items-center space-y-0.5">
                    <div className="w-4 h-3 bg-gray-200 border border-gray-400 rounded-sm relative"><div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-t-gray-400 border-r-[8px] border-r-transparent border-l-[8px] border-l-transparent"></div></div>
                    <div className="text-[5px] text-gray-500">D{i}</div>
                  </div>
                ))}
              </div>
            );
          case 'welcome_sequence':
            return (
              <div className="flex items-center justify-center h-full p-2 space-x-2">
                <div className="flex flex-col items-center space-y-0.5">
                  <div className="w-6 h-4 bg-gray-200 border border-gray-400 rounded-sm relative"><div className="absolute top-0 left-0 w-0 h-0 border-t-[3px] border-t-gray-400 border-r-[11px] border-r-transparent border-l-[11px] border-l-transparent"></div></div>
                  <div className="w-4 h-1 bg-gray-400 rounded"></div>
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            );
          case 'abandoned_checkout':
            return (
              <div className="flex items-center justify-center h-full p-2 space-x-2">
                <div className="text-[12px]">🛒</div>
                <div className="text-[8px] text-gray-400">→</div>
                <div className="w-5 h-3.5 bg-gray-200 border border-gray-400 rounded-sm relative"><div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-t-gray-400 border-r-[9px] border-r-transparent border-l-[9px] border-l-transparent"></div></div>
              </div>
            );
          case 'post_purchase_nurture':
            return (
              <div className="flex items-center justify-center h-full p-2 space-x-1">
                <div className="text-[10px] text-red-400 mr-1">❤️</div>
                {[1,2,3].map(i => (
                  <div key={i} className="w-4 h-3 bg-gray-200 border border-gray-400 rounded-sm relative"><div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-t-gray-400 border-r-[8px] border-r-transparent border-l-[8px] border-l-transparent"></div></div>
                ))}
              </div>
            );
          case 'promo_sequence':
            return (
              <div className="flex items-center justify-center h-full p-2 space-x-1">
                <div className="text-[10px] text-yellow-500 mr-1">⭐</div>
                <div className="flex flex-col items-center space-y-0.5">
                  <div className="w-5 h-3.5 bg-gray-200 border border-gray-400 rounded-sm relative"><div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-t-gray-400 border-r-[9px] border-r-transparent border-l-[9px] border-l-transparent"></div></div>
                  <div className="text-[5px] text-red-500 font-bold">48H</div>
                </div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Webinar':
        switch (template) {
          case 'registration_page':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">📅</div>
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'training_invite':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1">
                <div className="text-[12px]">▶️</div>
                <div className="w-2/3 h-1.5 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded mt-1`}></div>
              </div>
            );
          case 'countdown_page':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center text-white text-[6px]">00</div>
                  <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center text-white text-[6px]">14</div>
                  <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center text-white text-[6px]">59</div>
                </div>
                <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'speaker_feature':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'replay_page':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-3/4 h-10 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                  <div className="w-0 h-0 border-t-3 border-t-transparent border-l-5 border-l-gray-600 border-b-3 border-b-transparent ml-0.5"></div>
                </div>
                <div className="text-[6px] text-red-500">EXPIRES IN 24H</div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Survey':
        switch (template) {
          case 'simple_survey':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5 justify-center">
                <div className="w-2/3 h-2 bg-gray-600 rounded mb-1"></div>
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center space-x-2 pl-2">
                    <div className="w-2 h-2 rounded-full border border-gray-400"></div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                ))}
              </div>
            );
          case 'buyer_research':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5 justify-center">
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className="w-full h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <div className="w-full h-4 bg-gray-100 border border-gray-300 rounded"></div>
              </div>
            );
          case 'quiz_funnel':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[6px] bg-blue-100 text-blue-700 px-1 rounded">Q1</div>
                <div className="w-full h-1 bg-gray-200 rounded"><div className="w-1/4 h-1 bg-blue-500 rounded"></div></div>
                <div className="w-3/4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              </div>
            );
          case 'feedback_form':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="text-[10px] text-yellow-400">⭐</div>)}
                </div>
                <div className="w-full h-8 bg-gray-100 border border-gray-300 rounded"></div>
              </div>
            );
          case 'qualification_survey':
            return (
              <div className="flex flex-col h-full p-2 space-y-1.5 justify-center">
                <div className="w-full h-1 bg-gray-200 rounded mb-1"><div className="w-1/2 h-1 bg-green-500 rounded"></div></div>
                {[1,2].map(i => (
                  <div key={i} className="flex items-center space-x-2 pl-2">
                    <div className="w-2 h-2 border border-gray-400 rounded-sm"></div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded"></div>
                  </div>
                ))}
                <div className={`w-1/2 h-3 ${btnColor} rounded mt-1 mx-auto`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Application Page':
        switch (template) {
          case 'simple_application':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1">
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded mt-1`}></div>
              </div>
            );
          case 'qualification_form':
            return (
              <div className="flex flex-col h-full p-2 space-y-1 justify-center">
                <div className="w-1/2 h-1.5 bg-gray-600 rounded mb-1"></div>
                <div className="flex space-x-1"><div className="w-1 h-1 bg-gray-400 rounded-full mt-0.5"></div><div className="w-2/3 h-1 bg-gray-400 rounded"></div></div>
                <div className="flex space-x-1"><div className="w-1 h-1 bg-gray-400 rounded-full mt-0.5"></div><div className="w-1/2 h-1 bg-gray-400 rounded"></div></div>
                <div className="w-full h-4 bg-gray-100 border border-gray-300 rounded mt-1"></div>
              </div>
            );
          case 'coaching_application':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">👤</div>
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'service_intake':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">📋</div>
                <div className="w-full flex space-x-1"><div className="w-1/2 h-3 bg-gray-100 border border-gray-300 rounded"></div><div className="w-1/2 h-3 bg-gray-100 border border-gray-300 rounded"></div></div>
                <div className="w-full h-6 bg-gray-100 border border-gray-300 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'high_ticket_filter':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[10px]">🔒</div>
                <div className="w-3/4 h-1.5 bg-gray-600 rounded"></div>
                <div className="w-full h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      case 'Booking Page':
        switch (template) {
          case 'calendar_booking':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                <div className="flex w-full space-x-1">
                  <div className="w-2/3 h-10 bg-gray-100 border border-gray-300 rounded flex flex-wrap p-0.5 gap-0.5"><div className="w-2 h-2 bg-gray-200"></div><div className="w-2 h-2 bg-gray-200"></div><div className="w-2 h-2 bg-blue-200"></div></div>
                  <div className="w-1/3 flex flex-col space-y-0.5"><div className="w-full h-2 bg-blue-100 rounded"></div><div className="w-full h-2 bg-gray-100 rounded"></div></div>
                </div>
              </div>
            );
          case 'discovery_call':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">📞</div>
                <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'strategy_session':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">💡</div>
                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              </div>
            );
          case 'demo_call':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="text-[12px]">💻</div>
                <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
              </div>
            );
          case 'consultation_page':
            return (
              <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
                <div className="flex space-x-1"><div className="text-[10px]">👤</div><div className="text-[10px]">👤</div></div>
                <div className="w-3/4 h-1.5 bg-gray-600 rounded"></div>
                <div className="w-full h-4 bg-gray-100 border border-gray-300 rounded"></div>
              </div>
            );
          default:
            return <div className="flex items-center justify-center h-full text-xs text-gray-400">Default</div>;
        }

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-2 space-y-1.5">
            <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
            <div className={`w-1/2 h-3 ${btnColor} rounded`}></div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-[100px] bg-white border border-gray-200 rounded overflow-hidden relative">
      {renderContent()}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Save, Settings2 } from 'lucide-react';
import { Node } from '@xyflow/react';

interface SettingsDrawerProps {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
}

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
      });
    }
  }, [node]);

  if (!node) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(node.id, formData);
  };

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

          <div>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Page URL Slug</label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                /
              </span>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="sales-page"
              />
            </div>
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
            <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">Metrics (Simulated)</h3>
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

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes / Content Ideas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              placeholder="Add your notes here..."
            />
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

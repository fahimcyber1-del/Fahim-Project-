import React, { useState } from 'react';
import { InventoryItem } from './types';
import { X, Save, Box } from 'lucide-react';

interface Props {
  initialData?: InventoryItem;
  onSave: (data: InventoryItem) => void;
  onCancel: () => void;
}

export function QualityInventoryForm({ initialData, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>(initialData || {
    id: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    category: 'Stationery',
    currentStock: 0,
    reorderLevel: 5,
    unit: 'pcs'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'reorderLevel' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as InventoryItem);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {initialData ? 'Edit Inventory Item' : 'New Inventory Item'}
            </h2>
            <p className="text-sm text-slate-500">Register a new item in the warehouse or supply closet</p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
            <input required type="text" name="itemName" value={formData.itemName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="e.g. A4 Printer Paper..." />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white">
              <option value="Stationery">Stationery</option>
              <option value="Electronics">Electronics</option>
              <option value="Consumables">Consumables</option>
              <option value="Tools">Tools</option>
              <option value="Packaging">Packaging</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Stock Limit</label>
                <input required type="number" name="currentStock" value={formData.currentStock || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" min="0" disabled={!!initialData} title={initialData ? "Use Entry/Issue to update stock" : ""} />
             </div>
             <div className="w-24">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Unit</label>
                <input required type="text" name="unit" value={formData.unit || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="pcs, boxes" />
             </div>
          </div>
          
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Re-order Level</label>
             <input required type="number" name="reorderLevel" value={formData.reorderLevel || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" min="0" />
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
             <input required type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="e.g. Supply Closet A" />
          </div>

        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-1">Notes / Description</label>
           <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="Any additional details..."></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}

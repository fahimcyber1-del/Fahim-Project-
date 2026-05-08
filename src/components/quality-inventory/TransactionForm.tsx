import React, { useState } from 'react';
import { InventoryItem, InventoryTransaction } from './types';
import { X, Save, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Props {
  item: InventoryItem;
  txType: 'Entry' | 'Issue';
  onSave: (transaction: InventoryTransaction) => void;
  onCancel: () => void;
}

export function TransactionForm({ item, txType, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<Partial<InventoryTransaction>>({
    id: `TXN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    itemId: item.id,
    itemNameSnapshot: item.itemName,
    type: txType,
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as InventoryTransaction);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${txType === 'Entry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {txType === 'Entry' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              New Stock {txType}
            </h2>
            <p className="text-sm text-slate-500">Record a {txType.toLowerCase()} for {item.itemName}</p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
          <div className="md:col-span-2">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">{item.itemName}</p>
                <p className="text-xs text-slate-500">{item.category} • {item.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Current Stock</p>
                <p className="font-bold text-slate-800 text-lg">{item.currentStock} {item.unit}</p>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity to {txType}</label>
             <div className="flex items-center gap-2">
               <input required type="number" name="quantity" value={formData.quantity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" min="1" max={txType === 'Issue' ? item.currentStock : undefined} />
               <span className="text-slate-500 text-sm font-medium">{item.unit}</span>
             </div>
             {txType === 'Issue' && (formData.quantity || 0) > item.currentStock && (
               <p className="text-xs text-rose-500 mt-1 font-medium">Cannot issue more than current stock</p>
             )}
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
             <input required type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-semibold text-slate-700 mb-1">
               {txType === 'Entry' ? 'Received From (Supplier/Vendor)' : 'Issued To (Person/Department)'}
             </label>
             <input required type="text" name="reference" value={formData.reference || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder={txType === 'Entry' ? 'e.g. OfficeMax' : 'e.g. HR Dept / John Doe'} />
          </div>
          
          <div className="md:col-span-2">
             <label className="block text-sm font-semibold text-slate-700 mb-1">Notes / Remarks</label>
             <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="Optional details..."></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={txType === 'Issue' && (formData.quantity || 0) > item.currentStock}
            className={`px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 ${txType === 'Entry' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="w-4 h-4" />
            {txType === 'Entry' ? 'Add Stock' : 'Issue Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}

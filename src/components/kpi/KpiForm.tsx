import React, { useState } from 'react';
import { KpiRecord, KpiStatus } from './types';
import { ArrowLeft, Save } from 'lucide-react';
import { format } from 'date-fns';

interface KpiFormProps {
  initialData?: KpiRecord;
  onSave: (data: KpiRecord) => void;
  onCancel: () => void;
}

export function KpiForm({ initialData, onSave, onCancel }: KpiFormProps) {
  const [formData, setFormData] = useState<Partial<KpiRecord>>(initialData || {
    id: `KPI-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    title: '',
    category: 'Quality',
    department: '',
    target: 0,
    currentValue: 0,
    unit: '%',
    frequency: 'Monthly',
    owner: '',
    status: 'On Track',
    lastUpdated: format(new Date(), 'yyyy-MM-dd'),
    history: [],
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // For numeric fields
    if (name === 'target' || name === 'currentValue') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.owner) return;
    
    // Automatically update status based on target and current value logic if preferred, 
    // but allowing manual selection for now
    onSave(formData as KpiRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit KPI' : 'New KPI'}</h1>
          <p className="text-sm font-medium text-slate-500">Configure key performance indicator tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">KPI Title</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g., Defect Rate" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="Quality">Quality</option>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Department</label>
                <input required type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g., Production" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Owner</label>
                <input required type="text" name="owner" value={formData.owner || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Owner Name" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Value</label>
                <input required type="number" step="0.01" name="target" value={formData.target || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Current Value</label>
                <input required type="number" step="0.01" name="currentValue" value={formData.currentValue || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Unit</label>
                <input required type="text" name="unit" value={formData.unit || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="%, count, days" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Frequency</label>
                <select name="frequency" value={formData.frequency || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6 mt-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Off Track">Off Track</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
             <textarea 
               name="description" 
               value={formData.description || ''} 
               onChange={handleChange} 
               rows={3}
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
               placeholder="Describe the KPI and how it is measured"
             />
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update KPI' : 'Save KPI'}
          </button>
        </div>
      </form>
    </div>
  );
}

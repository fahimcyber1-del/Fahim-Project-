import React, { useState } from 'react';
import { TraceabilityRecord } from './types';
import { ArrowLeft, Save, Plus } from 'lucide-react';

interface TraceabilityFormProps {
  onSave: (data: TraceabilityRecord) => void;
  onCancel: () => void;
}

export function TraceabilityForm({ onSave, onCancel }: TraceabilityFormProps) {
  const [formData, setFormData] = useState<Partial<TraceabilityRecord>>({
    id: `TRC-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    productBatchNo: '',
    type: 'GARMENT',
    status: 'IN_PROGRESS',
    date: new Date().toISOString().split('T')[0],
    certifications: [],
    supplierName: '',
    originCountry: '',
    notes: '',
    stages: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const certs = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, certifications: certs }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as TraceabilityRecord);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">New Traceability Record</h2>
            <p className="text-sm font-medium text-slate-500">Initiate supply chain tracking for a batch.</p>
          </div>
        </div>
      </div>

      <form className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Batch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Product / Batch / PO No.</label>
              <input 
                type="text" name="productBatchNo" value={formData.productBatchNo} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Material / Product Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="GARMENT">Finished Good / Garment</option>
                <option value="FABRIC">Fabric Roll / Batch</option>
                <option value="YARN">Yarn Lot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Initiation Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="IN_PROGRESS">In Progress</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending Documents</option>
                <option value="FAILED">Verification Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Supplier & Claims</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Primary Supplier / Division</label>
              <input type="text" name="supplierName" value={formData.supplierName || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Country of Origin</label>
              <input type="text" name="originCountry" value={formData.originCountry || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Certifications Claimed (Comma separated)</label>
              <input 
                type="text" 
                value={formData.certifications?.join(', ') || ''} 
                onChange={handleCertificationsChange} 
                placeholder="e.g. GOTS, OCS, GRS"
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Remarks / Notes</label>
              <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded text-sm resize-none" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </form>
    </div>
  );
}

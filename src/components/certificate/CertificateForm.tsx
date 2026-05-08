import React, { useState } from 'react';
import { CertificateRecord } from './types';
import { ArrowLeft, Save, Upload } from 'lucide-react';

interface CertificateFormProps {
  onSave: (data: CertificateRecord) => void;
  onCancel: () => void;
}

export function CertificateForm({ onSave, onCancel }: CertificateFormProps) {
  const [formData, setFormData] = useState<Partial<CertificateRecord>>({
    id: `CRT-2023-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    title: '',
    issuer: '',
    type: 'SYSTEM',
    status: 'ACTIVE',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    referenceNumber: '',
    scope: '',
    documentUrl: '',
    remarks: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as CertificateRecord);
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
            <h2 className="text-2xl font-black text-slate-800">Add New Certificate</h2>
            <p className="text-sm font-medium text-slate-500">Record a new compliance or quality certificate.</p>
          </div>
        </div>
      </div>

      <form className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Certificate Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Certificate Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Issuer / Certification Body</label>
              <input type="text" name="issuer" value={formData.issuer} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Reference Number</label>
              <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="SYSTEM">System Certification</option>
                <option value="PRODUCT">Product Certification</option>
                <option value="MATERIAL">Material Rating</option>
                <option value="COMPLIANCE">Compliance Declaration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded text-sm">
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="EXPIRED">Expired</option>
                <option value="PENDING">Pending / Renewal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Issue Date</label>
              <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Expiry Date</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Scope of Certification</label>
              <textarea name="scope" value={formData.scope} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-slate-300 rounded text-sm resize-none" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Documentation & Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
            <div>
               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Certificate Document</label>
               <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                 <Upload className="w-8 h-8 text-slate-400 mb-2" />
                 <p className="text-sm font-semibold text-blue-600">Enter PDF URL or Upload <span className="text-slate-500 font-medium">simulate</span></p>
                 <input type="text" name="documentUrl" value={formData.documentUrl || ''} onChange={handleChange} placeholder="https://example.com/cert.pdf" className="mt-2 w-full text-center border-none bg-transparent text-xs" />
               </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Remarks / Notes</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-slate-300 rounded text-sm resize-none" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Certificate
          </button>
        </div>
      </form>
    </div>
  );
}

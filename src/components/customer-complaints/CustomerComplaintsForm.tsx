import React, { useState } from 'react';
import { CustomerComplaintRecord } from './types';
import { ArrowLeft, Save, Upload, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerComplaintsFormProps {
  initialData?: CustomerComplaintRecord;
  onSave: (data: CustomerComplaintRecord) => void;
  onCancel: () => void;
}

export function CustomerComplaintsForm({ initialData, onSave, onCancel }: CustomerComplaintsFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerComplaintRecord>>(initialData || {
    id: `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    dateReceived: format(new Date(), 'yyyy-MM-dd'),
    customerName: '',
    orderRef: '',
    styleNo: '',
    category: 'Quality',
    severity: 'Medium',
    status: 'Open',
    description: '',
    rootCause: '',
    correctiveAction: '',
    assignedTo: '',
    attachments: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          attachments: [
            ...(prev.attachments || []),
            { name: file.name, type: file.type, data: reader.result as string }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.orderRef || !formData.description) return;
    
    // Auto-set resolved date if status changed to Resolved/Closed and wasn't before
    let record = { ...formData } as CustomerComplaintRecord;
    if ((record.status === 'Resolved' || record.status === 'Closed') && !record.dateResolved) {
      record.dateResolved = format(new Date(), 'yyyy-MM-dd');
    }
    
    onSave(record);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Complaint' : 'New Customer Complaint'}</h1>
          <p className="text-sm font-medium text-slate-500">Record and track customer feedback or issues</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Customer Name *</label>
                <input required type="text" name="customerName" value={formData.customerName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Client Coporation" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Received *</label>
                <input required type="date" name="dateReceived" value={formData.dateReceived || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Order Reference *</label>
                <input required type="text" name="orderRef" value={formData.orderRef || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. PO-12345" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Style Number</label>
                <input type="text" name="styleNo" value={formData.styleNo || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. AW24-101" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Complaint Classification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="Quality">Quality</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Service">Service</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Severity</label>
                <select name="severity" value={formData.severity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Description & Investigation</h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Issue Description *</label>
                   <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Detail the complaint..." />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Root Cause Analysis</label>
                   <textarea name="rootCause" value={formData.rootCause || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="What caused this issue? (If investigated)" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Corrective/Preventive Action (CAPA)</label>
                   <textarea name="correctiveAction" value={formData.correctiveAction || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Action taken to fix and prevent recurrence..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned To</label>
                    <input type="text" name="assignedTo" value={formData.assignedTo || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Person responsible" />
                  </div>
                  {(formData.status === 'Resolved' || formData.status === 'Closed') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Resolved</label>
                      <input type="date" name="dateResolved" value={formData.dateResolved || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Attachments</h3>
             </div>
             <div className="space-y-4">
               {formData.attachments && formData.attachments.length > 0 && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                   {formData.attachments.map((file, index) => (
                     <div key={index} className="relative group border border-slate-200 rounded-lg p-2 flex flex-col items-center bg-slate-50">
                       <button 
                         type="button" 
                         onClick={() => removeAttachment(index)}
                         className="absolute -top-2 -right-2 bg-white border border-slate-200 text-rose-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-50"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                       {file.type.startsWith('image/') && file.data ? (
                         <div className="w-full h-16 mb-2 overflow-hidden rounded bg-slate-200 flex items-center justify-center">
                           <img src={file.data} alt={file.name} className="object-cover w-full h-full" />
                         </div>
                       ) : (
                         <FileText className="w-8 h-8 text-slate-400 mb-2" />
                       )}
                       <p className="text-[10px] text-slate-700 truncate w-full text-center" title={file.name}>{file.name}</p>
                     </div>
                   ))}
                 </div>
               )}
               <label className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors w-full">
                 <Upload className="w-6 h-6 text-slate-400 mb-2" />
                 <span className="text-sm font-semibold text-slate-600">Click to upload files</span>
                 <span className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                 <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
               </label>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

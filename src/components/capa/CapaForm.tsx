import React, { useState, useRef } from 'react';
import { CapaRecord, CapaAttachment } from './types';
import { ArrowLeft, Save, Paperclip, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CapaFormProps {
  initialData?: CapaRecord;
  onSave: (data: CapaRecord) => void;
  onCancel: () => void;
}

export function CapaForm({ initialData, onSave, onCancel }: CapaFormProps) {
  const [formData, setFormData] = useState<Partial<CapaRecord>>(initialData || {
    id: `CAPA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateRaised: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    source: 'Internal Process',
    sourceReference: '',
    severity: 'Medium',
    status: 'Open',
    problemDescription: '',
    immediateAction: '',
    rootCauseAnalysis: '',
    correctiveAction: '',
    preventiveAction: '',
    assignedTo: '',
    targetDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    attachments: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAttachment: CapaAttachment = {
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: base64,
          step: 'General'
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const updateAttachmentStep = (indexToUpdate: number, newStep: CapaAttachment['step']) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.map((att, idx) => 
        idx === indexToUpdate ? { ...att, step: newStep } : att
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.problemDescription || !formData.assignedTo) return;
    onSave(formData as CapaRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit CAPA' : 'Raise New CAPA'}</h1>
          <p className="text-sm font-medium text-slate-500">Corrective and Preventive Action request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">CAPA Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Brief summary of the issue" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Raised *</label>
                <input required type="date" name="dateRaised" value={formData.dateRaised || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Source *</label>
                <select required name="source" value={formData.source || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Audit">Audit</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Customer Complaint">Customer Complaint</option>
                  <option value="Internal Process">Internal Process</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Source Reference</label>
                <input type="text" name="sourceReference" value={formData.sourceReference || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Audit ID, PO Number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Severity *</label>
                  <select required name="severity" value={formData.severity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                  <select required name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                    <option value="Open">Open</option>
                    <option value="In Investigation">In Investigation</option>
                    <option value="Action Planned">Action Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Problem Description</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Define the Problem *</label>
                <textarea required name="problemDescription" value={formData.problemDescription || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Detailed description of what went wrong..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Immediate Action / Correction</label>
                <textarea name="immediateAction" value={formData.immediateAction || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="What was done immediately to contain the issue?" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Investigation & Analysis</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Root Cause Analysis</label>
              <textarea name="rootCauseAnalysis" value={formData.rootCauseAnalysis || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Why did this happen? (e.g., 5 Whys analysis)" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Action Plan</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Corrective Action</label>
                <textarea name="correctiveAction" value={formData.correctiveAction || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Steps to eliminate the root cause and prevent recurrence..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Preventive Action</label>
                <textarea name="preventiveAction" value={formData.preventiveAction || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Steps to prevent similar potential problems elsewhere..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned To *</label>
                   <input required type="text" name="assignedTo" value={formData.assignedTo || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Person responsible" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Date *</label>
                   <input required type="date" name="targetDate" value={formData.targetDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                 </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              Evidence & Documentation
              <div>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach Files
                </button>
              </div>
            </h3>
            
            {(!formData.attachments || formData.attachments.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center bg-slate-50">
                <Paperclip className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No attachments yet</p>
                <p className="text-xs text-slate-500">Upload photos, documents, or evidence related to this CAPA.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-slate-500">{attachment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <select
                        value={attachment.step || 'General'}
                        onChange={(e) => updateAttachmentStep(index, e.target.value as CapaAttachment['step'])}
                        className="text-xs border-slate-200 rounded px-2 py-1 outline-none text-slate-600"
                      >
                        <option value="General">General</option>
                        <option value="Problem">Problem Evidence</option>
                        <option value="Root Cause">Root Cause Analysis</option>
                        <option value="Corrective Action">Corrective Action</option>
                        <option value="Preventive Action">Preventive Action</option>
                      </select>
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(index)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update CAPA' : 'Submit CAPA'}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { SOPRecord, SOPDepartment, SOPStatus, SOPAttachment } from './types';
import { ArrowLeft, Save, Paperclip, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface SopFormProps {
  initialData?: SOPRecord;
  onSave: (data: SOPRecord) => void;
  onCancel: () => void;
}

export function SopForm({ initialData, onSave, onCancel }: SopFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<SOPRecord>>(initialData || {
    id: `SOP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    department: 'Production',
    version: '1.0',
    status: 'Draft',
    author: '',
    reviewer: '',
    approver: '',
    purpose: '',
    scope: '',
    procedureSteps: '',
    attachments: [],
    versionHistory: [],
  });

  const [versionChanges, setVersionChanges] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAttachment: SOPAttachment = {
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: base64
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      let newVersion = prev.version;
      let newDatePublished = prev.datePublished;
      
      if (name === 'status' && value === 'Published' && prev.status !== 'Published') {
        newDatePublished = format(new Date(), 'yyyy-MM-dd');
        if (initialData && initialData.status !== 'Published') {
          // Increment version
          const parts = (prev.version || '1.0').toString().split('.');
          if (parts.length >= 2) {
             newVersion = `${parseInt(parts[0]) + 1}.0`;
          } else {
             newVersion = `${parseInt(prev.version || '1') + 1}.0`;
          }
        }
      }
      
      return { 
        ...prev, 
        [name]: value, 
        version: name === 'version' ? value : newVersion,
        datePublished: newDatePublished,
        dateLastModified: format(new Date(), 'yyyy-MM-dd') 
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;
    
    let history = formData.versionHistory || [];
    if (initialData && (formData.version !== initialData.version || versionChanges)) {
      history = [
        ...history,
        {
          version: formData.version || '1.0',
          dateModified: format(new Date(), 'yyyy-MM-dd'),
          modifiedBy: formData.author || 'Unknown',
          changes: versionChanges || 'Updated SOP'
        }
      ];
    } else if (!initialData) {
      history = [
        {
          version: formData.version || '1.0',
          dateModified: format(new Date(), 'yyyy-MM-dd'),
          modifiedBy: formData.author || 'Unknown',
          changes: 'Initial creation'
        }
      ];
    }
    
    onSave({ ...formData, versionHistory: history } as SOPRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit SOP' : 'New SOP'}</h1>
          <p className="text-sm font-medium text-slate-500">Create or modify a Standard Operating Procedure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Internal Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">SOP Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Clear title for the SOP" />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Department</label>
                 <select name="department" value={formData.department || 'Production'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                   <option value="Production">Production</option>
                   <option value="Quality">Quality</option>
                   <option value="Maintenance">Maintenance</option>
                   <option value="Logistics">Logistics</option>
                   <option value="HR">HR</option>
                   <option value="Other">Other</option>
                 </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Version *</label>
                <input required type="text" name="version" value={formData.version || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. 1.0" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Roles</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-6">
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Author *</label>
                   <input required type="text" name="author" value={formData.author || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="SOP Author" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Reviewer</label>
                   <input type="text" name="reviewer" value={formData.reviewer || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Reviewer Name" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Approver</label>
                   <input type="text" name="approver" value={formData.approver || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Approver Name" />
                </div>
             </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">SOP Content</h3>
             <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Purpose</label>
                  <textarea name="purpose" value={formData.purpose || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Describe the purpose of this SOP..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Scope</label>
                  <textarea name="scope" value={formData.scope || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Who does this SOP apply to?" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Procedure Steps *</label>
                  <textarea required name="procedureSteps" value={formData.procedureSteps || ''} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Step-by-step instructions..." />
                </div>
                
                {initialData && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Version Change Notes</label>
                    <textarea name="versionChanges" value={versionChanges} onChange={(e) => setVersionChanges(e.target.value)} rows={2} className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="What changed in this version?" />
                    <p className="text-[10px] text-slate-500 mt-1">If the version number is updated or the status is set to Published, this note will be saved in the version history.</p>
                  </div>
                )}
             </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              Attachments
              <div>
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                  <Paperclip className="w-3.5 h-3.5" /> Attach Files
                </button>
              </div>
            </h3>
            
            {(!formData.attachments || formData.attachments.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center bg-slate-50">
                <Paperclip className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No files attached</p>
                <p className="text-xs text-slate-500">Upload diagrams, reference guides, etc.</p>
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
                    <button type="button" onClick={() => removeAttachment(index)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0 ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update SOP' : 'Save SOP'}
          </button>
        </div>
      </form>
    </div>
  );
}

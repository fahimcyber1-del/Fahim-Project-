import React, { useState, useRef } from 'react';
import { QualityManualRecord, ManualStatus, ManualAttachment } from './types';
import { ArrowLeft, Save, Paperclip, Trash2, Plus, History } from 'lucide-react';
import { format } from 'date-fns';

interface QualityManualFormProps {
  initialData?: QualityManualRecord;
  onSave: (data: QualityManualRecord) => void;
  onCancel: () => void;
}

export function QualityManualForm({ initialData, onSave, onCancel }: QualityManualFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<QualityManualRecord>>(initialData || {
    id: `QM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    chapter: '',
    version: '1.0',
    status: 'Draft',
    author: '',
    reviewer: '',
    approver: '',
    purpose: '',
    content: '',
    attachments: [],
    versionHistory: [],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newAttachment: ManualAttachment = {
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

  const handleHistoryChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newHistory = [...(prev.versionHistory || [])];
      newHistory[index] = { ...newHistory[index], [field]: value };
      return { ...prev, versionHistory: newHistory };
    });
  };

  const removeHistoryEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      versionHistory: prev.versionHistory?.filter((_, i) => i !== index)
    }));
  };

  const addHistoryEntry = () => {
    setFormData(prev => ({
      ...prev,
      versionHistory: [
        ...(prev.versionHistory || []),
        { version: prev.version || '1.0', dateModified: format(new Date(), 'yyyy-MM-dd'), modifiedBy: prev.author || '', changes: '' }
      ]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.chapter) return;
    
    let history = formData.versionHistory || [];
    if (!initialData && history.length === 0) {
      history = [
        {
          version: formData.version || '1.0',
          dateModified: format(new Date(), 'yyyy-MM-dd'),
          modifiedBy: formData.author || 'Unknown',
          changes: 'Initial creation'
        }
      ];
    }
    
    onSave({ ...formData, versionHistory: history } as QualityManualRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Section' : 'New Manual Section'}</h1>
          <p className="text-sm font-medium text-slate-500">Create or modify a Quality Manual section</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Internal Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Section Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Leadership and Commitment" />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Chapter *</label>
                 <input required type="text" name="chapter" value={formData.chapter || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Chapter 1: Leadership" />
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

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date Published</label>
                <input type="date" name="datePublished" value={formData.datePublished || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" disabled={formData.status !== 'Published'} />
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Roles</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-6">
                <div>
                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Author *</label>
                   <input required type="text" name="author" value={formData.author || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Author Name" />
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
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Content</h3>
             <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Purpose</label>
                  <textarea name="purpose" value={formData.purpose || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Describe the purpose of this section..." />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Detailed Content *</label>
                  <textarea required name="content" value={formData.content || ''} onChange={handleChange} rows={10} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Enter manual section details..." />
                </div>
             </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              Version History
              <button type="button" onClick={addHistoryEntry} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Entry
              </button>
            </h3>
            
            {(!formData.versionHistory || formData.versionHistory.length === 0) ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center bg-slate-50">
                <History className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No version history</p>
                <p className="text-xs text-slate-500">Add an entry to track changes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.versionHistory.map((history, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Version</label>
                       <input type="text" value={history.version} onChange={(e) => handleHistoryChange(index, 'version', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                       <input type="date" value={history.dateModified} onChange={(e) => handleHistoryChange(index, 'dateModified', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-3">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Modified By</label>
                       <input type="text" value={history.modifiedBy} onChange={(e) => handleHistoryChange(index, 'modifiedBy', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-4">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Changes</label>
                       <input type="text" value={history.changes} onChange={(e) => handleHistoryChange(index, 'changes', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-1 flex justify-end mt-5">
                       <button type="button" onClick={() => removeHistoryEntry(index)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <p className="text-xs text-slate-500">Upload diagrams or appendicies.</p>
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
            <Save className="w-4 h-4" /> {initialData ? 'Update Section' : 'Save Section'}
          </button>
        </div>
      </form>
    </div>
  );
}

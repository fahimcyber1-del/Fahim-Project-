import React, { useState } from 'react';
import { OrganogramRecord, OrganogramNode } from './types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface OrganogramFormProps {
  initialData?: OrganogramRecord;
  onSave: (data: OrganogramRecord) => void;
  onCancel: () => void;
}

export function OrganogramForm({ initialData, onSave, onCancel }: OrganogramFormProps) {
  const [formData, setFormData] = useState<Partial<OrganogramRecord>>(initialData || {
    id: `ORG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    department: '',
    version: '1.0',
    status: 'Draft',
    description: '',
    nodes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value, 
      dateLastModified: format(new Date(), 'yyyy-MM-dd') 
    }));
  };

  const handleAddNode = () => {
    const newNode: OrganogramNode = {
      id: Math.random().toString(36).substring(7),
      role: '',
      name: '',
      parentId: null
    };
    setFormData(prev => ({
      ...prev,
      nodes: [...(prev.nodes || []), newNode]
    }));
  };

  const handleUpdateNode = (id: string, field: keyof OrganogramNode, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.map(n => n.id === id ? { ...n, [field]: value === '' && field === 'parentId' ? null : value } : n)
    }));
  };

  const handleRemoveNode = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.filter(n => n.id !== id).map(n => n.parentId === id ? { ...n, parentId: null } : n) // Or handle orphan nodes differently
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department) return;
    onSave(formData as OrganogramRecord);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Organogram' : 'New Organogram'}</h1>
          <p className="text-sm font-medium text-slate-500">Map out roles and structure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Sales Team Structure" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Department *</label>
                <input required type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Sales" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Version *</label>
                <input required type="text" name="version" value={formData.version || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. 1.0" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Description</h3>
             <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Provide an overview of this structure..." />
          </div>

          <div>
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Roles & Hierarchy</h3>
                <button type="button" onClick={handleAddNode} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                  <Plus className="w-4 h-4" /> Add Role
                </button>
             </div>

             {(!formData.nodes || formData.nodes.length === 0) ? (
               <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                 <p className="text-sm font-medium text-slate-500">No roles added yet.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {formData.nodes.map(node => (
                   <div key={node.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 border border-slate-200 rounded-xl">
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Role Title *</label>
                        <input required type="text" value={node.role || ''} onChange={(e) => handleUpdateNode(node.id, 'role', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Manager" />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name (Optional)</label>
                        <input type="text" value={node.name || ''} onChange={(e) => handleUpdateNode(node.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. John Doe" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reports To</label>
                        <select value={node.parentId || ''} onChange={(e) => handleUpdateNode(node.id, 'parentId', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                          <option value="">None (Top Level)</option>
                          {formData.nodes?.filter(n => n.id !== node.id).map(n => (
                            <option key={n.id} value={n.id}>{n.role} {n.name ? `(${n.name})` : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button type="button" onClick={() => handleRemoveNode(node.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
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
            <Save className="w-4 h-4" /> {initialData ? 'Update Organogram' : 'Save Organogram'}
          </button>
        </div>
      </form>
    </div>
  );
}

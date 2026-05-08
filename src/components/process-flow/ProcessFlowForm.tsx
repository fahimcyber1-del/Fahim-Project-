import React, { useState } from 'react';
import { ProcessFlowRecord, FlowNode, NodeType } from './types';
import { ArrowLeft, Save, Plus, Trash2, Link, LayoutTemplate, List } from 'lucide-react';
import { format } from 'date-fns';
import { VisualFlowEditor } from './VisualFlowEditor';

interface ProcessFlowFormProps {
  initialData?: ProcessFlowRecord;
  onSave: (data: ProcessFlowRecord) => void;
  onCancel: () => void;
}

export function ProcessFlowForm({ initialData, onSave, onCancel }: ProcessFlowFormProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const [formData, setFormData] = useState<Partial<ProcessFlowRecord>>(initialData || {
    id: `FLOW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`,
    dateCreated: format(new Date(), 'yyyy-MM-dd'),
    dateLastModified: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    department: '',
    version: '1.0',
    status: 'Draft',
    author: '',
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
    const newNode: FlowNode = {
      id: Math.random().toString(36).substring(7),
      type: 'process',
      label: 'New Step',
      description: '',
      nextNodes: []
    };
    setFormData(prev => ({
      ...prev,
      nodes: [...(prev.nodes || []), newNode]
    }));
  };

  const handleUpdateNode = (id: string, field: keyof FlowNode, value: any) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const handleRemoveNode = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.filter(n => n.id !== id).map(n => ({
        ...n,
        nextNodes: n.nextNodes.filter(nextId => nextId !== id)
      }))
    }));
  };

  const toggleConnection = (sourceId: string, targetId: string) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.map(n => {
        if (n.id === sourceId) {
          const nextNodes = n.nextNodes.includes(targetId)
            ? n.nextNodes.filter(id => id !== targetId)
            : [...n.nextNodes, targetId];
          return { ...n, nextNodes };
        }
        return n;
      })
    }));
  };

  const toggleDependency = (nodeId: string, dependencyId: string) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.map(n => {
        if (n.id === nodeId) {
          const deps = n.dependencies || [];
          const dependencies = deps.includes(dependencyId)
            ? deps.filter(id => id !== dependencyId)
            : [...deps, dependencyId];
          return { ...n, dependencies };
        }
        return n;
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.author) return;
    onSave(formData as ProcessFlowRecord);
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} type="button" className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Process Flow' : 'New Process Flow'}</h1>
          <p className="text-sm font-medium text-slate-500">Design flowchart steps and connections</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-8 flex-1">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Title *</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Quality Inspection Process" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Department *</label>
                <input required type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. QA" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Author *</label>
                <input required type="text" name="author" value={formData.author || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Author Name" />
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
              
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                 <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Describe the process..." />
              </div>
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Process Steps</h3>
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setViewMode('visual')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'visual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <LayoutTemplate className="w-4 h-4" /> Visual Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <List className="w-4 h-4" /> List Editor
                    </button>
                  </div>
                  {viewMode === 'list' && (
                    <button type="button" onClick={handleAddNode} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                      <Plus className="w-4 h-4" /> Add Step
                    </button>
                  )}
                </div>
             </div>

             {viewMode === 'visual' ? (
                <VisualFlowEditor 
                  nodes={formData.nodes || []} 
                  onChange={(nodes) => setFormData(prev => ({ ...prev, nodes }))} 
                />
             ) : (
                <>
                  {(!formData.nodes || formData.nodes.length === 0) ? (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                      <p className="text-sm font-medium text-slate-500">No steps added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.nodes.map((node, index) => (
                        <div key={node.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start bg-slate-50 p-4 border border-slate-200 rounded-xl">
                           <div className="lg:col-span-3">
                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Step Type</label>
                             <select value={node.type} onChange={(e) => handleUpdateNode(node.id, 'type', e.target.value as NodeType)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white">
                               <option value="start">Start</option>
                               <option value="process">Process</option>
                               <option value="decision">Decision</option>
                               <option value="document">Document</option>
                               <option value="end">End</option>
                             </select>
                           </div>
                           
                           <div className="lg:col-span-8 space-y-3">
                             <div>
                               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Label *</label>
                               <input required type="text" value={node.label || ''} onChange={(e) => handleUpdateNode(node.id, 'label', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Inspect Package" />
                             </div>
                             <div>
                               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                               <input type="text" value={node.description || ''} onChange={(e) => handleUpdateNode(node.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="Optional details..." />
                             </div>
                             
                             <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Link className="w-3 h-3" /> Connects To (Next Steps)</label>
                                <div className="flex flex-wrap gap-2">
                                   {formData.nodes?.filter(n => n.id !== node.id).map(n => (
                                     <button
                                       key={n.id}
                                       type="button"
                                       onClick={() => toggleConnection(node.id, n.id)}
                                       className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${node.nextNodes.includes(n.id) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                     >
                                       {n.label || 'Unnamed Step'}
                                     </button>
                                   ))}
                                   {formData.nodes?.length === 1 && <span className="text-xs text-slate-400 italic">Add more steps to connect.</span>}
                                </div>
                             </div>

                             <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Link className="w-3 h-3" /> Depends On (Prerequisites)</label>
                                <div className="flex flex-wrap gap-2">
                                   {formData.nodes?.filter(n => n.id !== node.id).map(n => (
                                     <button
                                       key={n.id}
                                       type="button"
                                       onClick={() => toggleDependency(node.id, n.id)}
                                       className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${(node.dependencies || []).includes(n.id) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                     >
                                       {n.label || 'Unnamed Step'}
                                     </button>
                                   ))}
                                   {formData.nodes?.length === 1 && <span className="text-xs text-slate-400 italic">Add more steps to set dependencies.</span>}
                                </div>
                             </div>
                           </div>
                           
                           <div className="lg:col-span-1 flex justify-end">
                             <button type="button" onClick={() => handleRemoveNode(node.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors mt-6">
                               <Trash2 className="w-5 h-5" />
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
             )}
          </div>
          
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-white transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {initialData ? 'Update Flow' : 'Save Flow'}
          </button>
        </div>
      </form>
    </div>
  );
}

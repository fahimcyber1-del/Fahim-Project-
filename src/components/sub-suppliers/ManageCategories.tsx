import React, { useState } from 'react';
import { useSubSupplierCategoriesState, useSubSupplierConfig } from '../../store';
import { useApiStorage } from '../../hooks/useApiData';
import { INITIAL_DOCUMENTS } from '../document-control/mockData';
import { DocumentRecord } from '../document-control/types';
import { ArrowLeft, Plus, Trash2, Tag, Save, Search, FileText } from 'lucide-react';

interface ManageCategoriesProps {
  onBack: () => void;
  onNewSupplier: () => void;
}

export function ManageCategories({ onBack, onNewSupplier }: ManageCategoriesProps) {
  const { categories, setCategories } = useSubSupplierCategoriesState();
  const { config, setConfig } = useSubSupplierConfig();
  const [documents] = useApiStorage<DocumentRecord>('aqm_documentcontrol_records', INITIAL_DOCUMENTS);
  
  const [newCat, setNewCat] = useState('');
  const [docCodeText, setDocCodeText] = useState(config.documentCode);
  const [showDocSuggestions, setShowDocSuggestions] = useState(false);

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) return; // prevent duplicate
    setCategories([...categories, newCat.trim()]);
    setNewCat('');
  };

  const handleDeleteCat = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  const saveDocCode = () => {
    setConfig({ ...config, documentCode: docCodeText });
  };

  const filteredDocs = documents.filter(doc => 
    doc.id.toLowerCase().includes(docCodeText.toLowerCase()) || 
    doc.title.toLowerCase().includes(docCodeText.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Manage Settings</h1>
            <p className="text-sm font-medium text-slate-500">Configure categories and document code</p>
          </div>
        </div>
        <button 
           onClick={onNewSupplier}
           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700"
        >
           New Supplier
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-900">Document Code Configuration</h2>
              <p className="text-sm text-slate-500">Set the official document code and revision for exports.</p>
           </div>
        </div>
        
        <div className="relative">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Default Document Code</label>
          <div className="flex gap-3">
             <div className="relative flex-1">
               <input
                 type="text"
                 value={docCodeText}
                 onFocus={() => setShowDocSuggestions(true)}
                 onBlur={() => setTimeout(() => setShowDocSuggestions(false), 200)}
                 onChange={(e) => setDocCodeText(e.target.value)}
                 placeholder="e.g. DOC-123 Rev 1.0 or type to search..."
                 className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
               />
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
               
               {showDocSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                   {filteredDocs.length > 0 ? (
                     filteredDocs.map(doc => (
                       <button
                         key={doc.id}
                         type="button"
                         onClick={() => {
                           setDocCodeText(`${doc.id} Rev ${doc.version}`);
                           setShowDocSuggestions(false);
                         }}
                         className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex flex-col gap-1"
                       >
                         <span className="text-sm font-bold text-slate-800">{doc.id} (Rev {doc.version})</span>
                         <span className="text-xs text-slate-500 truncate">{doc.title}</span>
                       </button>
                     ))
                   ) : (
                     <div className="px-4 py-3 text-sm text-slate-500 text-center">No documents found.</div>
                   )}
                 </div>
               )}
             </div>
             
             <button 
                onClick={saveDocCode}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-800"
             >
               <Save className="w-4 h-4" /> Save
             </button>
          </div>
          {config.documentCode && (
             <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                Currently saved: <strong>{config.documentCode}</strong>
             </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Tag className="w-5 h-5 text-indigo-600" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-900">Supplier Categories</h2>
              <p className="text-sm text-slate-500">Manage available categories for sub-suppliers.</p>
           </div>
        </div>
        <form onSubmit={handleAddCat} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Enter new category name..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
          <button 
             type="submit" 
             disabled={!newCat.trim()}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-indigo-600" />
                 </div>
                 <span className="font-semibold text-slate-700 text-sm">{cat}</span>
              </div>
              <button 
                onClick={() => { if(window.confirm(`Are you sure you want to delete the category "${cat}"?`)) handleDeleteCat(cat); }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded bg-white border border-slate-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">No categories created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

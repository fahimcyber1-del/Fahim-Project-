import React, { useState } from 'react';
import { DefectItem, ViewState } from './types';
import { INITIAL_DEFECTS } from './mockData';
import { DefectDashboard } from './DefectDashboard';
import { DefectList } from './DefectList';
import { DefectForm } from './DefectForm';
import { DefectDetail } from './DefectDetail';
import { DefectSettings } from './DefectSettings';
import { LayoutDashboard, List, FileText, Settings as SettingsIcon } from 'lucide-react';

export function DefectLibraryModule() {
  const [records, setRecords] = useState<DefectItem[]>(INITIAL_DEFECTS);
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [categories, setCategories] = useState<string[]>(['Stitching', 'Fabric', 'Measurement', 'Finishing', 'Knitting', 'Color', 'Others']);
  const [departments, setDepartments] = useState<string[]>(['Sewing', 'Cutting', 'Finishing', 'Knitting', 'Warehousing']);
  const [standards, setStandards] = useState<string[]>(['ASTM-D3990', 'ISO-9001', 'AQL-1.5', 'AQL-2.5']);

  const handleCreate = () => {
    setViewState({ type: 'form' });
  };

  const handleEdit = (id: string) => {
    setViewState({ type: 'form', recordId: id });
  };

  const handleView = (id: string) => {
    setViewState({ type: 'detail', recordId: id });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(prev => prev.filter(r => !ids.includes(r.id)));
  };

  const handleSave = (record: DefectItem) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [record, ...prev];
    });
    setViewState({ type: 'list' });
  };

  // Internal Navigation
  const renderNav = () => (
    <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
      <button
        onClick={() => setViewState({ type: 'dashboard' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </button>
      <button
        onClick={() => setViewState({ type: 'list' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> Defect List
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <FileText className="w-4 h-4" /> New Defect
      </button>
      <button
        onClick={() => setViewState({ type: 'settings' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'settings' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <SettingsIcon className="w-4 h-4" /> Manage
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {renderNav()}
      
      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && (
          <DefectDashboard 
            records={records} 
            onViewList={() => setViewState({ type: 'list' })} 
          />
        )}
        
        {viewState.type === 'list' && (
          <DefectList 
            records={records} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        )}
        
        {viewState.type === 'form' && (
          <DefectForm 
            initialData={viewState.recordId ? records.find(r => r.id === viewState.recordId) : undefined}
            categories={categories}
            departments={departments}
            standards={standards}
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'list' })}
          />
        )}
        
        {viewState.type === 'detail' && viewState.recordId && (
          <DefectDetail 
            record={records.find(r => r.id === viewState.recordId)!}
            onEdit={handleEdit}
            onBack={() => setViewState({ type: 'list' })}
          />
        )}

        {viewState.type === 'settings' && (
          <DefectSettings
            categories={categories}
            departments={departments}
            standards={standards}
            onSaveCategories={setCategories}
            onSaveDepartments={setDepartments}
            onSaveStandards={setStandards}
          />
        )}
      </div>
    </div>
  );
}

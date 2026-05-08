import React, { useState } from 'react';
import { InspectionRecord, ViewState } from './types';
import { INITIAL_RECORDS } from './mockData';
import { InspectionDashboard } from './InspectionDashboard';
import { InspectionSummary } from './InspectionSummary';
import { InspectionForm } from './InspectionForm';
import { InspectionDetail } from './InspectionDetail';
import { LayoutDashboard, List, FileText } from 'lucide-react';

export function InspectionModule() {
  const [records, setRecords] = useState<InspectionRecord[]>(INITIAL_RECORDS);
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });

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

  const handleSave = (record: InspectionRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [record, ...prev];
    });
    setViewState({ type: 'summary' });
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
        onClick={() => setViewState({ type: 'summary' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'summary' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> Summary List
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <FileText className="w-4 h-4" /> New Form
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {renderNav()}
      
      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && (
          <InspectionDashboard records={records} />
        )}
        
        {viewState.type === 'summary' && (
          <InspectionSummary 
            records={records} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        )}
        
        {viewState.type === 'form' && (
          <InspectionForm 
            initialData={viewState.recordId ? records.find(r => r.id === viewState.recordId) : undefined}
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'summary' })}
          />
        )}
        
        {viewState.type === 'detail' && viewState.recordId && (
          <InspectionDetail 
            record={records.find(r => r.id === viewState.recordId)!}
            onEdit={handleEdit}
            onBack={() => setViewState({ type: 'summary' })}
          />
        )}
      </div>
    </div>
  );
}

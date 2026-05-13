import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, OrganogramRecord } from './types';
import { INITIAL_ORGANOGRAMS } from './mockData';
import { OrganogramDashboard } from './OrganogramDashboard';
import { OrganogramList } from './OrganogramList';
import { OrganogramForm } from './OrganogramForm';
import { OrganogramDetail } from './OrganogramDetail';
import { Users, List, PlusCircle, LayoutDashboard } from 'lucide-react';

export function OrganogramModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_organogram_records', INITIAL_ORGANOGRAMS);

  const handleSave = (data: OrganogramRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Organogram?')) {
      setRecords(records.filter(r => r.id !== id));
      if (viewState.type === 'detail' && viewState.recordId === id) {
        setViewState({ type: 'list' });
      }
    }
  };

  const currentRecord = viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)
    ? records.find(r => r.id === viewState.recordId)
    : undefined;

  return (
    <div className="w-full h-full flex flex-col p-4 sm:px-6 lg:px-8 pb-8 pt-2 gap-4 overflow-hidden bg-slate-50/50">
      <div className="flex gap-2 mb-2 border-b border-slate-200 pb-4 flex-shrink-0 overflow-x-auto bg-white p-2 rounded-lg shadow-sm">
        <button
          onClick={() => setViewState({ type: 'dashboard' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setViewState({ type: 'list' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' || viewState.type === 'detail' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <List className="w-4 h-4" /> All Charts
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> New Chart
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {viewState.type === 'dashboard' && <OrganogramDashboard records={records} />}
        {viewState.type === 'list' && (
          <OrganogramList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <OrganogramForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <OrganogramDetail 
              record={currentRecord}
              onBack={() => setViewState({ type: 'list' })}
              onEdit={() => setViewState({ type: 'form', recordId: currentRecord.id })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

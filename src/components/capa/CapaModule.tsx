import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, CapaRecord } from './types';
import { INITIAL_CAPAS } from './mockData';
import { CapaDashboard } from './CapaDashboard';
import { CapaList } from './CapaList';
import { CapaForm } from './CapaForm';
import { CapaDetail } from './CapaDetail';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';

export function CapaModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_capa_records', INITIAL_CAPAS);

  const handleSave = (data: CapaRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (idOrIds: string | string[]) => {
    const idsToDelete = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} CAPA record(s)?`)) {
      setRecords(records.filter(r => !idsToDelete.includes(r.id)));
      if (viewState.type === 'detail' && viewState.recordId && idsToDelete.includes(viewState.recordId)) {
        setViewState({ type: 'list' });
      }
    }
  };

  const currentRecord = viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)
    ? records.find(r => r.id === viewState.recordId)
    : undefined;

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden p-4 bg-slate-50/50`}>
      <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-3 shrink-0 w-fit">
        <button
          onClick={() => setViewState({ type: 'dashboard' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setViewState({ type: 'list' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' || viewState.type === 'detail' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <List className="w-4 h-4" /> All CAPAs
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> Raise CAPA
        </button>
      </div>

      <div className={`flex-1 w-full relative ${viewState.type === 'list' ? 'overflow-hidden flex flex-col min-h-0' : 'overflow-y-auto'}`}>
        {viewState.type === 'dashboard' && <CapaDashboard records={records} />}
        {viewState.type === 'list' && (
          <CapaList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2">
            <CapaForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2">
            <CapaDetail 
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

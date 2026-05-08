import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, TraceabilityRecord } from './types';
import { mockTraceabilityRecords } from './mockData';
import { TraceabilityDashboard } from './TraceabilityDashboard';
import { TraceabilityList } from './TraceabilityList';
import { TraceabilityForm } from './TraceabilityForm';
import { TraceabilityDetail } from './TraceabilityDetail';
import { LayoutDashboard, Map, PlusCircle } from 'lucide-react';

export function TraceabilityModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage<TraceabilityRecord>('aqm_traceability_records', mockTraceabilityRecords);

  const handleSave = (data: TraceabilityRecord) => {
    setRecords([data, ...records]);
    setViewState({ type: 'list' });
  };

  const currentRecord = viewState.type === 'detail' && viewState.recordId 
    ? records.find(r => r.id === viewState.recordId) 
    : undefined;

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
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${(viewState.type === 'list' || viewState.type === 'detail') ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <Map className="w-4 h-4" /> Traceability
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> New Record
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-50/50">
      {renderNav()}

      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && <TraceabilityDashboard records={records} onViewList={() => setViewState({ type: 'list' })} />}
        {viewState.type === 'list' && (
           <TraceabilityList 
             records={records}
             onView={(id) => setViewState({ type: 'detail', recordId: id })}
             onCreate={() => setViewState({ type: 'form' })}
           />
        )}
        {viewState.type === 'form' && (
          <TraceabilityForm 
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'list' })}
          />
        )}
        {viewState.type === 'detail' && currentRecord && (
          <TraceabilityDetail 
            record={currentRecord}
            onBack={() => setViewState({ type: 'list' })}
            onUpdate={(updatedRecord) => {
              setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
            }}
          />
        )}
      </div>
    </div>
  );
}

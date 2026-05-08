import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, RootCauseRecord } from './types';
import { INITIAL_RCA_RECORDS } from './mockData';
import { RootCauseDashboard } from './RootCauseDashboard';
import { RootCauseList } from './RootCauseList';
import { RootCauseForm } from './RootCauseForm';
import { RootCauseDetail } from './RootCauseDetail';
import { GitMerge, List, PlusCircle, LayoutDashboard } from 'lucide-react';

export function RootCauseModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_rootcause_records', INITIAL_RCA_RECORDS);

  const handleSave = (data: RootCauseRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(records.filter(r => !ids.includes(r.id)));
    if (viewState.type === 'detail' && ids.includes(viewState.recordId as string)) {
      setViewState({ type: 'list' });
    }
  };

  const currentRecord = viewState.type === 'detail' || (viewState.type === 'form' && viewState.recordId)
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
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' || viewState.type === 'detail' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <List className="w-4 h-4" /> All RCAs
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> New RCA
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Root Cause Analysis</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Investigate and discover the underlying reasons for incidents or issues</p>
        </div>
      </div>
      
      {renderNav()}

      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {viewState.type === 'dashboard' && <RootCauseDashboard records={records} />}
        {viewState.type === 'list' && (
          <RootCauseList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <RootCauseForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <RootCauseDetail 
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

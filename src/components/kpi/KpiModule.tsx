import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, KpiRecord } from './types';
import { INITIAL_KPIS } from './mockData';
import { KpiDashboard } from './KpiDashboard';
import { KpiList } from './KpiList';
import { KpiForm } from './KpiForm';
import { KpiDetail } from './KpiDetail';
import { Target, List, PlusCircle } from 'lucide-react';

export function KpiModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_kpi_records', INITIAL_KPIS);

  const handleSave = (data: KpiRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">KPI Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track and manage organizational key performance indicators</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4 flex-shrink-0 overflow-x-auto">
        <button
          onClick={() => setViewState({ type: 'dashboard' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <Target className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setViewState({ type: 'list' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'list' || viewState.type === 'detail' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <List className="w-4 h-4" /> All KPIs
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> Configure KPI
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {viewState.type === 'dashboard' && <KpiDashboard records={records} />}
        {viewState.type === 'list' && (
          <KpiList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2">
            <KpiForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2">
            <KpiDetail 
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

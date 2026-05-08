import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, QualityGoalRecord } from './types';
import { INITIAL_GOALS } from './mockData';
import { QualityGoalDashboard } from './QualityGoalDashboard';
import { QualityGoalList } from './QualityGoalList';
import { QualityGoalForm } from './QualityGoalForm';
import { QualityGoalDetail } from './QualityGoalDetail';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';

export function QualityGoalModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_qualitygoal_records', INITIAL_GOALS);

  const handleSave = (data: QualityGoalRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (idOrIds: string | string[]) => {
    const idsToDelete = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} goal(s)?`)) {
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quality Goals</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track targets, metrics, and milestones for continuous improvement</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4 flex-shrink-0 overflow-x-auto">
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
          <List className="w-4 h-4" /> All Goals
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {viewState.type === 'dashboard' && <QualityGoalDashboard records={records} />}
        {viewState.type === 'list' && (
          <QualityGoalList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2">
            <QualityGoalForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2">
            <QualityGoalDetail 
              record={currentRecord}
              onBack={() => setViewState({ type: 'list' })}
              onEdit={() => setViewState({ type: 'form', recordId: currentRecord.id })}
              onUpdate={(updatedRecord) => {
                 setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

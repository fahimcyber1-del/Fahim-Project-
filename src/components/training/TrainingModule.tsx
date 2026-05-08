import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, TrainingRecord } from './types';
import { INITIAL_TRAININGS } from './mockData';
import { TrainingDashboard } from './TrainingDashboard';
import { TrainingPlan } from './TrainingPlan';
import { TrainingCalendar } from './TrainingCalendar';
import { TrainingForm } from './TrainingForm';
import { TrainingDetail } from './TrainingDetail';
import { BookOpen, List, PlusCircle, LayoutDashboard, Calendar as CalendarIcon } from 'lucide-react';

export function TrainingModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_training_records', INITIAL_TRAININGS);

  const handleSave = (data: TrainingRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'plan' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Training?')) {
      setRecords(records.filter(r => r.id !== id));
      if (viewState.type === 'detail' && viewState.recordId === id) {
        setViewState({ type: 'plan' });
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Training Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Plan, schedule, and track employee training</p>
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
          onClick={() => setViewState({ type: 'plan' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'plan' || viewState.type === 'detail' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <List className="w-4 h-4" /> Training Plan
        </button>
        <button
          onClick={() => setViewState({ type: 'calendar' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'calendar' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <CalendarIcon className="w-4 h-4" /> Calendar
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> New Training
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {viewState.type === 'dashboard' && <TrainingDashboard records={records} />}
        {viewState.type === 'plan' && (
          <TrainingPlan 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'calendar' && (
          <div className="h-full pr-2">
            <TrainingCalendar 
              records={records}
              onView={(id) => setViewState({ type: 'detail', recordId: id })}
            />
          </div>
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <TrainingForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'plan' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2 pb-12">
            <TrainingDetail 
              record={currentRecord}
              onBack={() => setViewState({ type: 'plan' })}
              onEdit={() => setViewState({ type: 'form', recordId: currentRecord.id })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

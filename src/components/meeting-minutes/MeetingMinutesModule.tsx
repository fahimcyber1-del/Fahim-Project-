import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, MeetingRecord } from './types';
import { INITIAL_MEETINGS } from './mockData';
import { MeetingMinutesDashboard } from './MeetingMinutesDashboard';
import { MeetingMinutesList } from './MeetingMinutesList';
import { MeetingMinutesForm } from './MeetingMinutesForm';
import { MeetingMinutesDetail } from './MeetingMinutesDetail';
import { MeetingCalendar } from './MeetingCalendar';
import { LayoutDashboard, List, Calendar as CalendarIcon, PlusCircle } from 'lucide-react';

export function MeetingMinutesModule() {
  const [records, setRecords] = useApiStorage('aqm_meetingminutes_records', INITIAL_MEETINGS);
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });

  const handleSave = (record: MeetingRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [...prev, record];
    });
    setViewState({ type: 'list' });
  };

  const handleDelete = (ids: string[]) => {
    setRecords(prev => prev.filter(r => !ids.includes(r.id)));
    if (viewState.type === 'detail' && ids.includes(viewState.recordId)) {
      setViewState({ type: 'list' });
    }
  };

  const renderContent = () => {
    switch (viewState.type) {
      case 'dashboard':
        return <MeetingMinutesDashboard records={records} />;
      case 'list':
        return (
          <MeetingMinutesList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        );
      case 'calendar':
        return (
          <MeetingCalendar 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
          />
        );
      case 'form':
        return (
          <MeetingMinutesForm 
            initialData={records.find(r => r.id === viewState.recordId)}
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'list' })}
          />
        );
      case 'detail':
        const record = records.find(r => r.id === viewState.recordId);
        if (!record) return <div>Record not found</div>;
        return (
          <MeetingMinutesDetail 
            record={record}
            onBack={() => setViewState({ type: 'list' })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-4 flex-shrink-0 overflow-x-auto">
        <button
          onClick={() => setViewState({ type: 'dashboard' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            viewState.type === 'dashboard'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setViewState({ type: 'list' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            viewState.type === 'list' || viewState.type === 'detail'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <List className="w-4 h-4" /> Meeting Records
        </button>
        <button
          onClick={() => setViewState({ type: 'calendar' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            viewState.type === 'calendar'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <CalendarIcon className="w-4 h-4" /> Calendar
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            viewState.type === 'form' && !viewState.recordId
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> New Meeting
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-12">
        {renderContent()}
      </div>
    </div>
  );
}

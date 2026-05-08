import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, CustomerComplaintRecord } from './types';
import { INITIAL_COMPLAINTS } from './mockData';
import { CustomerComplaintsDashboard } from './CustomerComplaintsDashboard';
import { CustomerComplaintsList } from './CustomerComplaintsList';
import { CustomerComplaintsForm } from './CustomerComplaintsForm';
import { CustomerComplaintsDetail } from './CustomerComplaintsDetail';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';

export function CustomerComplaintsModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_customercomplaints_records', INITIAL_COMPLAINTS);

  const handleSave = (data: CustomerComplaintRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (idOrIds: string | string[]) => {
    const idsToDelete = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} complaint(s)?`)) {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Complaints</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and track customer feedback, issues, and resolution actions</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4 flex-shrink-0 overflow-x-auto">
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
          <List className="w-4 h-4" /> All Complaints
        </button>
        <button
          onClick={() => setViewState({ type: 'form' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <PlusCircle className="w-4 h-4" /> New Complaint
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {viewState.type === 'dashboard' && <CustomerComplaintsDashboard records={records} />}
        {viewState.type === 'list' && (
          <CustomerComplaintsList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2">
            <CustomerComplaintsForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2">
            <CustomerComplaintsDetail 
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

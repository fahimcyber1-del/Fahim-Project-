import { useApiStorage } from '../../hooks/useApiData';
import React, { useState } from 'react';
import { ViewState, RiskRecord } from './types';
import { INITIAL_RISKS } from './mockData';
import { RiskAssessmentDashboard } from './RiskAssessmentDashboard';
import { RiskAssessmentList } from './RiskAssessmentList';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { RiskAssessmentDetail } from './RiskAssessmentDetail';
import { RiskAssessmentManage } from './RiskAssessmentManage';
import { ShieldAlert, List, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';

export function RiskAssessmentModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useApiStorage('aqm_riskassessment_records', INITIAL_RISKS);

  const handleSave = (data: RiskRecord) => {
    if (viewState.type === 'form' && viewState.recordId) {
      setRecords(records.map(r => r.id === data.id ? data : r));
    } else {
      setRecords([data, ...records]);
    }
    setViewState({ type: 'list' });
  };

  const handleDelete = (idOrIds: string | string[]) => {
    const idsToDelete = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} risk assessment(s)?`)) {
      setRecords(records.filter(r => !idsToDelete.includes(r.id)));
      if (viewState.type === 'detail' && viewState.recordId && idsToDelete.includes(viewState.recordId)) {
        setViewState({ type: 'list' });
      }
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
        <List className="w-4 h-4" /> All Risks
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' && !viewState.recordId ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> New Risk
      </button>
      <button
        onClick={() => setViewState({ type: 'manage' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'manage' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <Settings className="w-4 h-4" /> Manage
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {renderNav()}

      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {viewState.type === 'dashboard' && <RiskAssessmentDashboard records={records} />}
        {viewState.type === 'list' && (
          <RiskAssessmentList 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
            onNew={() => setViewState({ type: 'form' })}
          />
        )}
        {viewState.type === 'form' && (
          <div className="overflow-y-auto h-full pr-2">
            <RiskAssessmentForm 
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={() => setViewState({ type: 'list' })}
            />
          </div>
        )}
        {viewState.type === 'detail' && currentRecord && (
          <div className="overflow-y-auto h-full pr-2">
            <RiskAssessmentDetail 
              record={currentRecord}
              onBack={() => setViewState({ type: 'list' })}
              onEdit={() => setViewState({ type: 'form', recordId: currentRecord.id })}
            />
          </div>
        )}
        {viewState.type === 'manage' && (
          <RiskAssessmentManage 
            records={records}
            onView={(id) => setViewState({ type: 'detail', recordId: id })}
            onEdit={(id) => setViewState({ type: 'form', recordId: id })}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

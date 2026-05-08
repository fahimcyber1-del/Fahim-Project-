import React, { useState } from 'react';
import { ViewState, CertificateRecord } from './types';
import { mockCertificates } from './mockData';
import { CertificateDashboard } from './CertificateDashboard';
import { CertificateList } from './CertificateList';
import { CertificateForm } from './CertificateForm';
import { CertificateDetail } from './CertificateDetail';
import { LayoutDashboard, Award, PlusCircle } from 'lucide-react';

export function CertificateModule() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'dashboard' });
  const [records, setRecords] = useState<CertificateRecord[]>(mockCertificates);

  const handleSave = (data: CertificateRecord) => {
    setRecords([data, ...records]);
    setViewState({ type: 'list' });
  };

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
        <Award className="w-4 h-4" /> Certificates
      </button>
      <button
        onClick={() => setViewState({ type: 'form' })}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${viewState.type === 'form' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <PlusCircle className="w-4 h-4" /> Add Certificate
      </button>
    </div>
  );

  const currentRecord = viewState.type === 'detail' && viewState.recordId 
    ? records.find(r => r.id === viewState.recordId) 
    : undefined;

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-50/50">
      {renderNav()}

      <div className="flex-1 overflow-y-auto w-full">
        {viewState.type === 'dashboard' && <CertificateDashboard certificates={records} onViewList={() => setViewState({ type: 'list' })}/>}
        {viewState.type === 'list' && (
           <CertificateList 
             certificates={records}
             onView={(id) => setViewState({ type: 'detail', recordId: id })}
             onCreate={() => setViewState({ type: 'form' })}
           />
        )}
        {viewState.type === 'form' && (
          <CertificateForm 
            onSave={handleSave}
            onCancel={() => setViewState({ type: 'list' })}
          />
        )}
        {viewState.type === 'detail' && currentRecord && (
          <CertificateDetail 
            record={currentRecord}
            onBack={() => setViewState({ type: 'list' })}
          />
        )}
      </div>
    </div>
  );
}
